'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const authService = require('../../services/auth.service');
const { REFRESH_COOKIE_OPTIONS } = require('../../utils/tokenUtils');

/**
 * POST /api/v1/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.validatedBody;
  const { user, accessToken, refreshToken } = await authService.register({ name, email, phone, password });

  // Send OTP for phone/email verification (non-blocking)
  if (phone) {
    authService.sendOTP({ contact: phone, contactType: 'phone', type: 'registration' }).catch(() => {});
  }

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { status: 201, data: { user, accessToken }, message: 'Registration successful' });
});

/**
 * POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;
  const { user, accessToken, refreshToken } = await authService.login({ email, password });

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { data: { user, accessToken }, message: 'Login successful' });
});

/**
 * POST /api/v1/auth/refresh-token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, error: { message: 'No refresh token', code: 'UNAUTHORIZED' } });
  }

  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(token);
  res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { data: { accessToken }, message: 'Token refreshed' });
});

/**
 * POST /api/v1/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  if (req.user) await authService.logout(req.user._id);
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  sendSuccess(res, { message: 'Logged out successfully' });
});

/**
 * POST /api/v1/auth/send-otp
 */
const sendOTP = asyncHandler(async (req, res) => {
  const { contact, contactType, type } = req.validatedBody;
  await authService.sendOTP({ contact, contactType, type });
  sendSuccess(res, { message: `OTP sent to your ${contactType}` });
});

/**
 * POST /api/v1/auth/verify-otp
 */
const verifyOTP = asyncHandler(async (req, res) => {
  const { contact, code, type } = req.validatedBody;
  await authService.verifyOTP({ contact, code, type });
  sendSuccess(res, { message: 'OTP verified successfully' });
});

/**
 * POST /api/v1/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.validatedBody;
  await authService.forgotPassword(email);
  // Always return success to prevent email enumeration
  sendSuccess(res, { message: 'If an account exists with this email, an OTP has been sent.' });
});

/**
 * POST /api/v1/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.validatedBody;
  await authService.resetPassword({ email, code, newPassword });
  sendSuccess(res, { message: 'Password reset successfully. Please log in.' });
});

module.exports = { register, login, refreshToken, logout, sendOTP, verifyOTP, forgotPassword, resetPassword };
