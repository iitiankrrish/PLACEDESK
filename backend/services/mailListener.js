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
    },
  };

  let connection;
  try {
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
    console.log(`Found ${messages.length} messages to process.`);

    for (const item of messages) {
      const part = item.parts.find((p) => p.which === "");
      const parsed = await simpleParser(part.body);
      const messageId = parsed.messageId;
      const alreadyExists = await ReceivedMail.findOne({
        messageId: messageId,
      });
      if (alreadyExists) continue;
      const bodyText = parsed.text || parsed.html || "";
      const cleanBody = bodyText
        .split(/On.*wrote:/i)[0]
        .split(/---.*Forwarded/i)[0]
        .trim();
      const inReplyTo = parsed.headers.get("in-reply-to");
      const original = inReplyTo
        ? await SentMail.findOne({ messageId: inReplyTo })
        : null;
      if (!original) continue;
      console.log(`Analyzing Reply for: ${original.subject}`);

      try {
        const aiRes = await axios.post(
          `${process.env.AI_SERVICE_URL}/analyze-email`,
          { emails: [cleanBody] },
        );
        const analysis = aiRes.data.analyses[0];

        await ReceivedMail.create({
          messageId: messageId,
          subject: parsed.subject,
          from: parsed.from.text,
          body: parsed.text,
          date: parsed.date,
          relatedSentMail: original._id,
          ...analysis,
        });

        original.status = "Replied";
        original.replies.push(messageId);
        await original.save();
      } catch (aiErr) {
        console.error("AI Analysis failed for a specific mail.");
      }
    }
    await connection.end();
    return { success: true, count: messages.length };
  } catch (err) {
    if (connection) connection.end();
    console.error("IMAP Sync Error:", err.message);
    return { success: false };
  }
};

module.exports = { fetchUnreadEmails };
