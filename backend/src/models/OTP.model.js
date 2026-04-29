'use strict';

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    // Contact: phone number or email
    contact: { type: String, required: true, trim: true, index: true },
    contactType: { type: String, enum: ['phone', 'email'], required: true },

    // OTP details
    code: { type: String, required: true },
    type: {
      type: String,
      enum: ['registration', 'login', 'password-reset', 'phone-verify', 'admin-2fa'],
      required: true,
    },

    // Security
    attempts: { type: Number, default: 0, max: 3 },
    isUsed: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    blockedUntil: { type: Date },

    // Expiry (TTL index on expiresAt)
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// ─── TTL Index — MongoDB auto-deletes expired OTPs ───────────────────────────
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ contact: 1, type: 1 });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
