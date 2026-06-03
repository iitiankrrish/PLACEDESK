const SentMail = require("../models/SentMail");
const ReceivedMail = require("../models/ReceivedMail");
const emailService = require("../services/emailServices");
const { fetchUnreadEmails } = require("../services/mailListener");
const axios = require("axios");

const mailController = {
  async generateMailContent(req, res) {
    try {
      console.log(`[Backend] Requesting AI Generation...`);
      const response = await axios.post(
        `${process.env.AI_SERVICE_URL}/generate-email`,
        req.body,
        { timeout: 60000 }
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error("AI Generation Error:", error.message);
      res.status(500).json({ message: "AI Service Unreachable" });
    }
  },

  async sendMail(req, res) {
    const { recipientEmail, subject, body, followUpDays = 0, companyName, hrName } = req.body;
    try {
      const info = await emailService.sendMail(recipientEmail, subject, body);
      
      const newMail = await SentMail.create({
        messageId: info.messageId, 
        senderEmail: process.env.EMAIL_USER,
        recipientEmail,
        subject,
        body,
        companyName,
        hrName,
        status: "Sent",
        expectedReplyBy: followUpDays > 0 ? new Date(Date.now() + followUpDays * 86400000) : null,
        isFollowUpScheduled: followUpDays > 0,
      });

      res.status(200).json({ message: "Mail sent successfully", mailId: newMail._id });
    } catch (error) {
      console.error("Send Controller Error:", error.message);
      res.status(500).json({ message: error.message });
    }
  },

  async getSentMails(req, res) {
    try {
      const mails = await SentMail.find().sort({ createdAt: -1 });
      res.status(200).json(mails);
    } catch (err) { res.status(500).json({ message: err.message }); }
  },

  async getReceivedMailsByUser(req, res) {
    try {
      const data = await ReceivedMail.find().sort({ date: -1 });
      res.status(200).json({ data });
    } catch (err) { res.status(500).json({ message: err.message }); }
  },

  async fetchAndStoreEmails(req, res) {
    const { deepSync } = req.body;
    try {
      const result = await fetchUnreadEmails(deepSync);
      res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
  },

  async getChatContext(req, res) {
    try {
      const data = await ReceivedMail.find({
        is_relevant: true,
        "internship_info.company_name": { $ne: "Not mentioned" },
      }).lean();
      res.json(data);
    } catch (err) { res.status(500).json(err); }
  },
};

module.exports = mailController;