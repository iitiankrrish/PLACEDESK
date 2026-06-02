const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chat');
const { userLoggedInOrNot } = require('../middleware/authorisation');

const router = express.Router();

router.post('/send',  sendMessage);
router.get('/history',  getChatHistory);

module.exports = router;
