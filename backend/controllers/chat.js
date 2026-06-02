const Chat = require("../models/chat");
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:10000';

async function sendMessage(req, res) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Message text is required" });
    const response = await axios.post(`${AI_SERVICE_URL}/ask`, {
      question: question
    });

    return res.status(200).json({ reply: response.data.answer });
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    return res.status(500).json({ error: "AI Service is unreachable" });
  }
}

async function getChatHistory(req, res) {
  try {
    const userId = req.user._id;
    const chat = await Chat.findOne({ user: userId });
    return res.status(200).json({ chat: chat || { user: userId, messages: [] } });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { sendMessage, getChatHistory };