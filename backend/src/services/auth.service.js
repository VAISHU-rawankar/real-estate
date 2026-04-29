'use strict';

const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const OTP = require('../models/OTP.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');
const { generateOTPCode } = require('../utils/cryptoUtils');
const { sendOTPEmail } = require('./email.service');
const { sendOTPSMS } = require('./sms.service');
const logger = require('../utils/logger');
const {
  OTP_EXPIRY_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_BLOCK_MINUTES,
} = require('../utils/constants');

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ name, email, phone, password }} data
 * @returns {{ user, accessToken, refreshToken }}
 */
async function register({ name, email, phone, password }) {
  // Duplicate check
  const existingEmail = await User.findOne({ email }).lean();
  if (existingEmail) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  if (phone) {
    const existingPhone = await User.findOne({ phone }).lean();
    if (existingPhone) {
      const err = new Error('An account with this phone number already exists');
      err.statusCode = 409;
      err.code = 'PHONE_EXISTS';
      throw err;
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, phone, passwordHash });

  const tokens = generateTokens(user);

  // Store hashed refresh token
  user.refreshToken = await bcrypt.hash(tokens.refreshToken, 8);
  await user.save();

  return { user: user.toJSON(), ...tokens };
}

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Authenticate user with email and password.
 * @param {{ email, password }} credentials
 * @returns {{ user, accessToken, refreshToken }}
 */
async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash +refreshToken');

  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401, code: 'INVALID_CREDENTIALS' });
  }

  if (!user.isActive) {
    throw Object.assign(new Error('Account is deactivated. Contact support.'), { statusCode: 403, code: 'ACCOUNT_DEACTIVATED' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401, code: 'INVALID_CREDENTIALS' });
  }

  if (user.role === 'admin') {
    await sendOTP({ contact: email, contactType: 'email', type: 'admin-2fa' });
    return { require2FA: true, email };
  }

  const tokens = generateTokens(user);

  // Rotate refresh token
  user.refreshToken = await bcrypt.hash(tokens.refreshToken, 8);
  user.lastLoginAt = new Date();
  await user.save();

  return { user: user.toJSON(), ...tokens };
}

async function verifyAdmin2FA({ email, code }) {
  const user = await User.findOne({ email }).select('+refreshToken');
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404, code: 'USER_NOT_FOUND' });
  }

  if (user.role !== 'admin') {
    throw Object.assign(new Error('Unauthorized'), { statusCode: 403, code: 'UNAUTHORIZED' });
  }

  await verifyOTP({ contact: email, code, type: 'admin-2fa' });

  const tokens = generateTokens(user);
  user.refreshToken = await bcrypt.hash(tokens.refreshToken, 8);
  user.lastLoginAt = new Date();
  await user.save();

  return { user: user.toJSON(), ...tokens };
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

/**
 * Rotate access + refresh tokens using the current refresh token.
 * @param {string} refreshToken
 * @returns {{ accessToken, refreshToken }}
 */
async function refreshAccessToken(refreshToken) {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401, code: 'INVALID_REFRESH_TOKEN' });
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || !user.refreshToken) {
    throw Object.assign(new Error('Session not found — please log in again'), { statusCode: 401, code: 'SESSION_NOT_FOUND' });
  }

  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValid) {
    throw Object.assign(new Error('Refresh token mismatch — possible token theft'), { statusCode: 401, code: 'TOKEN_MISMATCH' });
  }

  const tokens = generateTokens(user);
  user.refreshToken = await bcrypt.hash(tokens.refreshToken, 8);
  await user.save();

  return tokens;
}

// ─── OTP ──────────────────────────────────────────────────────────────────────

/**
 * Send OTP to phone or email.
 * @param {{ contact, contactType, type }} params
 */
async function sendOTP({ contact, contactType, type }) {
  // Check for active block
  const blocked = await OTP.findOne({ contact, type, isBlocked: true, blockedUntil: { $gt: new Date() } });
  if (blocked) {
    const minutesLeft = Math.ceil((blocked.blockedUntil - Date.now()) / 60_000);
    throw Object.assign(
      new Error(`Too many attempts. Try again in ${minutesLeft} minutes.`),
      { statusCode: 429, code: 'OTP_BLOCKED' }
    );
  }

  // Invalidate any existing OTPs for this contact+type
  await OTP.updateMany({ contact, type, isUsed: false }, { isUsed: true });

  const code = generateOTPCode(6);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);

  await OTP.create({ contact, contactType, code: await bcrypt.hash(code, 8), type, expiresAt });

  if (contactType === 'email') {
    await sendOTPEmail(contact, code, type);
  } else {
    await sendOTPSMS(contact, code);
  }

  logger.info(`OTP sent to ${contactType}: ${contact} for ${type}`);
}

/**
 * Verify an OTP code.
 * @param {{ contact, code, type }} params
 * @returns {boolean}
 */
async function verifyOTP({ contact, code, type }) {
  const otp = await OTP.findOne({
    contact,
    type,
    isUsed: false,
    isBlocked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otp) {
    throw Object.assign(new Error('OTP not found or expired'), { statusCode: 400, code: 'OTP_INVALID' });
  }

  const isMatch = await bcrypt.compare(code, otp.code);

  if (!isMatch) {
    otp.attempts += 1;

    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      otp.isBlocked = true;
      otp.blockedUntil = new Date(Date.now() + OTP_BLOCK_MINUTES * 60_000);
      await otp.save();
      throw Object.assign(
        new Error(`Too many wrong attempts. Blocked for ${OTP_BLOCK_MINUTES} minutes.`),
        { statusCode: 429, code: 'OTP_MAX_ATTEMPTS' }
      );
    }

    await otp.save();
    throw Object.assign(
      new Error(`Invalid OTP. ${OTP_MAX_ATTEMPTS - otp.attempts} attempts remaining.`),
      { statusCode: 400, code: 'OTP_INVALID' }
    );
  }

  otp.isUsed = true;
  await otp.save();

  return true;
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

/**
 * Upsert user from Google OAuth profile.
 * @param {{ googleId, email, name, avatar }} profile
 * @returns {{ user, accessToken, refreshToken }}
 */
async function googleOAuth({ googleId, email, name, avatar }) {
  let user = await User.findOne({ $or: [{ googleId }, { email }] }).select('+refreshToken');

  if (user) {
    // Link Google ID if signing in with email that already exists
    if (!user.googleId) user.googleId = googleId;
    if (!user.avatar && avatar) user.avatar = avatar;
    user.isEmailVerified = true;
  } else {
    user = new User({ googleId, email, name, avatar, isEmailVerified: true });
  }

  const tokens = generateTokens(user);
  user.refreshToken = await bcrypt.hash(tokens.refreshToken, 8);
  user.lastLoginAt = new Date();
  await user.save();

  return { user: user.toJSON(), ...tokens };
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

/**
 * Initiate password reset — send OTP to email.
 * @param {string} email
 */
async function forgotPassword(email) {
  const user = await User.findOne({ email }).lean();
  // Always return success to prevent email enumeration
  if (!user) return;

  await sendOTP({ contact: email, contactType: 'email', type: 'password-reset' });
}

/**
 * Reset password after OTP verification.
 * @param {{ email, code, newPassword }} params
 */
async function resetPassword({ email, code, newPassword }) {
  await verifyOTP({ contact: email, code, type: 'password-reset' });

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await User.findOneAndUpdate({ email }, { passwordHash, refreshToken: null });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateTokens(user) {
  const payload = { id: user._id.toString(), role: user.role };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ id: payload.id }),
  };
}

/**
 * Logout — clear refresh token from DB.
 * @param {string} userId
 */
async function logout(userId) {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
}

module.exports = {
  register,
  login,
  verifyAdmin2FA,
  refreshAccessToken,
  sendOTP,
  verifyOTP,
  googleOAuth,
  forgotPassword,
  resetPassword,
  logout,
};
