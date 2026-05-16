const express = require('express');
const router = express.Router();
const { chat } = require('./chatbotController');
const authMiddleware = require('../../middleware/auth');

router.post('/message', authMiddleware, chat);

module.exports = router;
