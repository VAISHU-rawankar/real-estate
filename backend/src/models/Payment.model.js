'use strict';

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    // Razorpay references
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, sparse: true },
    razorpaySignature: { type: String, select: false },

    // Idempotency
    idempotencyKey: { type: String, unique: true },

    amount: { type: Number, required: true }, // in paise
    currency: { type: String, default: 'INR' },

    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },

    purpose: {
      type: String,
      enum: ['featured-listing', 'premium-placement'],
      default: 'featured-listing',
    },

    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    webhookVerified: { type: Boolean, default: false },
    paidAt: { type: Date },

    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ property: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
