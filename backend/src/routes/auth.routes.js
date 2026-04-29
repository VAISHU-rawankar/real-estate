'use strict';

const express = require('express');
const router = express.Router();
const { authLimiter, otpLimiter } = require('../middleware/rateLimit.middleware');
const { requireAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { z } = require('zod');
const controller = require('../controllers/auth/auth.controller');

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const otpSchema = z.object({
  contact: z.string().min(5),
  contactType: z.enum(['phone', 'email']),
  type: z.enum(['registration', 'login', 'password-reset', 'phone-verify', 'admin-2fa']),
});

const verifyOTPSchema = z.object({
  contact: z.string().min(5),
  code: z.string().length(6),
  type: z.enum(['registration', 'login', 'password-reset', 'phone-verify', 'admin-2fa']),
});

const forgotSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(8).max(100),
});

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', requireAuth, controller.logout);
router.post('/send-otp', otpLimiter, validate(otpSchema), controller.sendOTP);
router.post('/verify-otp', otpLimiter, validate(verifyOTPSchema), controller.verifyOTP);
router.post('/forgot-password', authLimiter, validate(forgotSchema), controller.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetSchema), controller.resetPassword);

module.exports = router;
