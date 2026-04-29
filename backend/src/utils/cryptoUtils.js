'use strict';

const crypto = require('crypto');

/**
 * Generate a cryptographically secure random OTP.
 * @param {number} digits - Number of digits (default 6)
 * @returns {string} zero-padded OTP string
 */
function generateOTPCode(digits = 6) {
  const max = Math.pow(10, digits);
  const randomInt = crypto.randomInt(0, max);
  return randomInt.toString().padStart(digits, '0');
}

/**
 * Create an HMAC SHA-256 hash of a string.
 * @param {string} data
 * @param {string} secret
 * @returns {string} hex digest
 */
function createHMAC(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Constant-time string comparison to prevent timing attacks.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Generate a random hex token (for password reset, etc.)
 * @param {number} bytes
 * @returns {string} hex string
 */
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

module.exports = { generateOTPCode, createHMAC, safeCompare, generateSecureToken };
