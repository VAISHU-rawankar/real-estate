'use strict';

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT access token.
 * @param {Object} payload - { id, role }
 * @returns {string} signed JWT
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    issuer: 'realestate-platform',
  });
}

/**
 * Generate a signed JWT refresh token.
 * @param {Object} payload - { id }
 * @returns {string} signed JWT
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: 'realestate-platform',
  });
}

/**
 * Verify and decode a JWT access token.
 * @param {string} token
 * @returns {Object} decoded payload
 */
function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
    issuer: 'realestate-platform',
  });
}

/**
 * Verify and decode a JWT refresh token.
 * @param {string} token
 * @returns {Object} decoded payload
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: 'realestate-platform',
  });
}

/**
 * Options for setting the refresh token httpOnly cookie.
 */
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/api/v1/auth',
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  REFRESH_COOKIE_OPTIONS,
};
