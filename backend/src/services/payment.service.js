'use strict';

const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment.model');
const Property = require('../models/Property.model');
const { createHMAC, safeCompare } = require('../utils/cryptoUtils');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { FEATURED_LISTING_PRICE_PAISE } = require('../utils/constants');

/**
 * Create a Razorpay order for a featured listing payment.
 * @param {string} propertyId
 * @param {string} userId
 * @returns {Promise<{orderId, amount, currency, key}>}
 */
async function createFeaturedOrder(propertyId, userId) {
  const property = await Property.findById(propertyId).lean();
  if (!property) throw Object.assign(new Error('Property not found'), { statusCode: 404 });

  const idempotencyKey = `featured-${propertyId}-${Date.now()}`;
  const receipt = `feat_${propertyId.slice(-8)}_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount: FEATURED_LISTING_PRICE_PAISE,
    currency: 'INR',
    receipt,
    notes: { propertyId, userId, purpose: 'featured-listing' },
  });

  await Payment.create({
    razorpayOrderId: order.id,
    amount: FEATURED_LISTING_PRICE_PAISE,
    currency: 'INR',
    property: propertyId,
    user: userId,
    idempotencyKey,
    status: 'created',
  });

  return {
    orderId: order.id,
    amount: FEATURED_LISTING_PRICE_PAISE,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID,
  };
}

/**
 * Verify Razorpay payment signature and activate featured listing.
 * @param {string} orderId
 * @param {string} paymentId
 * @param {string} signature
 * @returns {Promise<Payment>}
 */
async function verifyPayment(orderId, paymentId, signature) {
  // Verify HMAC SHA-256 signature
  const expectedSignature = createHMAC(`${orderId}|${paymentId}`, process.env.RAZORPAY_KEY_SECRET);

  if (!safeCompare(expectedSignature, signature)) {
    throw Object.assign(new Error('Payment signature verification failed'), { statusCode: 400, code: 'INVALID_SIGNATURE' });
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: orderId, status: 'created' },
    {
      razorpayPaymentId: paymentId,
      status: 'paid',
      webhookVerified: false,
      paidAt: new Date(),
    },
    { new: true }
  );

  if (!payment) throw Object.assign(new Error('Payment record not found'), { statusCode: 404 });

  // Activate featured listing
  if (payment.property) {
    await Property.findByIdAndUpdate(payment.property, { isFeatured: true, status: 'featured' });
  }

  return payment;
}

/**
 * Handle Razorpay webhook.
 * Verifies the webhook signature with HMAC SHA-256.
 * @param {string} rawBody  - Raw request body string
 * @param {string} webhookSignature
 * @param {Object} event    - Parsed webhook payload
 */
async function handleWebhook(rawBody, webhookSignature, event) {
  const expectedSignature = createHMAC(rawBody, process.env.RAZORPAY_WEBHOOK_SECRET);

  if (!safeCompare(expectedSignature, webhookSignature)) {
    throw Object.assign(new Error('Invalid webhook signature'), { statusCode: 400 });
  }

  if (event.event === 'payment.captured') {
    const { order_id, id: paymentId } = event.payload.payment.entity;
    await Payment.findOneAndUpdate(
      { razorpayOrderId: order_id },
      { razorpayPaymentId: paymentId, status: 'paid', webhookVerified: true, paidAt: new Date() }
    );
    logger.info(`Webhook: payment captured for order ${order_id}`);
  }

  if (event.event === 'payment.failed') {
    const { order_id } = event.payload.payment.entity;
    await Payment.findOneAndUpdate({ razorpayOrderId: order_id }, { status: 'failed' });
    logger.info(`Webhook: payment failed for order ${order_id}`);
  }
}

module.exports = { createFeaturedOrder, verifyPayment, handleWebhook };
