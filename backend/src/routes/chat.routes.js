'use strict';

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.post('/', optionalAuth, chatController.handleChat);
router.get('/test', (req, res) => res.json({ success: true, message: 'Chat API is alive and reachable', apiKeyConfigured: !!process.env.GEMINI_API_KEY }));

module.exports = router;
