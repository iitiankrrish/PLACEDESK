const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
const axios = require("axios");
const ReceivedMail = require("../models/ReceivedMail");
const SentMail = require("../models/SentMail");

const fetchUnreadEmails = async (isDeepSync = false) => {
  const config = {
    imap: {
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASS,
      host: process.env.IMAP_HOST,
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
    },
  };

  let connection;
  try {
    console.log("[IMAP] Connecting to Gmail...");
    connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    // Logic: UNSEEN by default for speed, or last 7 days for deep sync
    let searchCriteria = ["UNSEEN"];
    if (isDeepSync) {
      const delay = new Date();
      delay.setDate(delay.getDate() - 7);
      searchCriteria = [["SINCE", delay.toISOString()]];
    }

    const messages = await connection.search(searchCriteria, {
      bodies: [""],
      markSeen: true,
    });

    console.log(`[IMAP] Found ${messages.length} messages to evaluate.`);

    for (const item of messages) {
      const part = item.parts.find((p) => p.which === "");
      const parsed = await simpleParser(part.body);
      const messageId = parsed.messageId;

      // 1. DUPLICATE PROTECTION: Hard-skip if we already have this mail
      const alreadyExists = await ReceivedMail.findOne({ messageId: messageId });
      if (alreadyExists) continue;

      // 2. BODY CLEANING: Strip out the original mail history
      // This ensures the AI only reads the NEW reply content
      const bodyText = parsed.text || parsed.html || "";
      const cleanBody = bodyText
        .split(/On.*wrote:/i)[0]
        .split(/---.*Forwarded/i)[0]
        .split(/From:.*<.*@.*>/i)[0]
        .trim();

      // 3. SMART THREAD MATCHING
      const inReplyTo = parsed.headers.get("in-reply-to");
      let original = null;

      // Attempt A: Match via exact Message-ID header
      if (inReplyTo) {
        original = await SentMail.findOne({ messageId: inReplyTo });
      }

      // Attempt B: Fallback (Crucial for Resend API)
      // Match via Subject (ignoring 'Re:') and the HR's email address
      if (!original && parsed.subject) {
        const cleanSubject = parsed.subject.replace(/Re:\s*/i, "").trim();
        const hrEmail = parsed.from.value[0].address;
        
        original = await SentMail.findOne({
          subject: new RegExp(cleanSubject, "i"),
          recipientEmail: hrEmail
        });
      }

      // IF NOT A REPLY TO OUR SYSTEM: Skip it (filters out personal spam)
      if (!original) {
        console.log(`Skipping unrelated mail: ${parsed.subject}`);
        continue;
      }

      console.log(`Analyzing deep recruitment facts for: ${original.companyName || original.subject}`);

      try {
        // 4. CALL AI SERVICE (Port 10000)
        // Increased timeout for Render's network variability
        const aiRes = await axios.post(
          `${process.env.AI_SERVICE_URL}/analyze-email`,
          { emails: [cleanBody] },
          { timeout: 40000 } 
        );

        const analysis = aiRes.data.analyses[0];

        // 5. SAVE RECEIVED MAIL TO DATABASE
        const newMailDoc = await ReceivedMail.create({
          messageId: messageId,
          subject: parsed.subject,
          from: parsed.from.text,
          body: parsed.text, // Store full text for user, but AI only analyzed cleanBody
          date: parsed.date,
          relatedSentMail: original._id,
          ...analysis, // Tone, Rating, Summaries, internship_info
        });

        // 6. UPDATE ORIGINAL SENT MAIL THREAD
        original.status = "Replied";
        original.replies.push(newMailDoc._id); // Store reference to the reply
        await original.save();

        console.log(`Successfully logged reply from ${parsed.from.text}`);

      } catch (aiErr) {
        console.error(`AI Analysis failed for ${parsed.subject}:`, aiErr.message);
        // We save the mail even if analysis fails so it's not lost
        await ReceivedMail.create({
          messageId: messageId,
          subject: parsed.subject,
          from: parsed.from.text,
          body: parsed.text,
          date: parsed.date,
          relatedSentMail: original._id,
          tone: "Neutral",
          is_relevant: true,
          summary: "Analysis failed, please read manually."
        });
      }
    }

    await connection.end();
    return { success: true, count: messages.length };
  } catch (err) {
    if (connection) connection.end();
    console.error("IMAP CRITICAL ERROR:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { fetchUnreadEmails };