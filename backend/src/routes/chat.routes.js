'use strict';

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.post('/', optionalAuth, chatController.handleChat);

module.exports = router;
