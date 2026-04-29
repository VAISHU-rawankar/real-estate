'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const paymentService = require('../services/payment.service');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/create-order', requireAuth, asyncHandler(async (req, res) => {
  const { propertyId } = req.body;
  const order = await paymentService.createFeaturedOrder(propertyId, req.user._id);
  sendSuccess(res, { data: order, message: 'Order created' });
}));

router.post('/verify', requireAuth, asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const payment = await paymentService.verifyPayment(orderId, paymentId, signature);
  sendSuccess(res, { data: payment, message: 'Payment verified and listing activated' });
}));

// Razorpay webhook — raw body needed for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  await paymentService.handleWebhook(req.body.toString(), signature, JSON.parse(req.body));
  res.status(200).json({ received: true });
}));

module.exports = router;
