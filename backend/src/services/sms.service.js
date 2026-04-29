'use strict';

const logger = require('../utils/logger');

/**
 * Send OTP via SMS (Twilio or MSG91).
 * Falls back gracefully if credentials are not configured.
 * @param {string} phone - 10-digit Indian mobile number
 * @param {string} otp   - 6-digit OTP code
 */
async function sendOTPSMS(phone, otp) {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  // ─── MSG91 (preferred for India) ─────────────────────────────────────────
  if (process.env.MSG91_AUTH_KEY) {
    try {
      const response = await fetch('https://api.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: process.env.MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
          template_id: process.env.MSG91_TEMPLATE_ID,
          mobile: formattedPhone,
          otp,
          sender: process.env.MSG91_SENDER_ID || 'YRBRND',
        }),
      });

      const data = await response.json();
      if (data.type === 'success') {
        logger.info(`OTP SMS sent via MSG91 to ${formattedPhone}`);
        return;
      }
      throw new Error(data.message || 'MSG91 send failed');
    } catch (err) {
      logger.error(`MSG91 OTP send failed: ${err.message}`);
    }
  }

  // ─── Twilio fallback ──────────────────────────────────────────────────────
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await twilio.messages.create({
        body: `Your OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`,
        from: process.env.TWILIO_FROM_NUMBER,
        to: formattedPhone,
      });
      logger.info(`OTP SMS sent via Twilio to ${formattedPhone}`);
    } catch (err) {
      logger.error(`Twilio OTP send failed: ${err.message}`);
    }
    return;
  }

  // ─── Development: log OTP ─────────────────────────────────────────────────
  logger.info(`[DEV] OTP for ${formattedPhone}: ${otp}`);
}

module.exports = { sendOTPSMS };
