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
      const alreadyExists = await ReceivedMail.findOne({ messageId: messageId });
      if (alreadyExists) continue;
      const bodyText = parsed.text || parsed.html || "";
      const cleanBody = bodyText
        .split(/On.*wrote:/i)[0]
        .split(/---.*Forwarded/i)[0]
        .split(/From:.*<.*@.*>/i)[0]
        .trim();

      const inReplyTo = parsed.headers.get("in-reply-to");
      let original = null;
      if (inReplyTo) {
        original = await SentMail.findOne({ messageId: inReplyTo });
      }

      if (!original && parsed.subject) {
        const cleanSubject = parsed.subject.replace(/Re:\s*/i, "").trim();
        const hrEmail = parsed.from.value[0].address;
        
        original = await SentMail.findOne({
          subject: new RegExp(cleanSubject, "i"),
          recipientEmail: hrEmail
        });
      }
      if (!original) {
        console.log(`Skipping unrelated mail: ${parsed.subject}`);
        continue;
      }

      console.log(`Analyzing deep recruitment facts for: ${original.companyName || original.subject}`);

      try {
        const aiRes = await axios.post(
          `${process.env.AI_SERVICE_URL}/analyze-email`,
          { emails: [cleanBody] },
          { timeout: 40000 } 
        );

        const analysis = aiRes.data.analyses[0];
        const newMailDoc = await ReceivedMail.create({
          messageId: messageId,
          subject: parsed.subject,
          from: parsed.from.text,
          body: parsed.text, 
          date: parsed.date,
          relatedSentMail: original._id,
          ...analysis, 
        });
        original.status = "Replied";
        original.replies.push(newMailDoc._id); 
        await original.save();

        console.log(`Successfully logged reply from ${parsed.from.text}`);

      } catch (aiErr) {
        console.error(`AI Analysis failed for ${parsed.subject}:`, aiErr.message);
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