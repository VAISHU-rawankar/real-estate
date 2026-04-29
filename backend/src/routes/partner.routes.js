'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const ChannelPartner = require('../models/ChannelPartner.model');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

// Public: register as partner
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, phone, password, agencyName, reraNumber, serviceAreas, specializations } = req.body;

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, phone, passwordHash, role: 'channelPartner' });
  await ChannelPartner.create({ userId: user._id, agencyName, reraNumber, serviceAreas, specializations });

  sendSuccess(res, { status: 201, message: 'Partner application submitted. Pending admin approval.' });
}));

module.exports = router;
