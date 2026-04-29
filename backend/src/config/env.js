'use strict';

const Joi = require('joi');

const envSchema = Joi.object({
  // ─── App ───────────────────────────────────────────────────────────────────
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(5000),
  CLIENT_URL: Joi.string().uri().required(),

  // ─── MongoDB ───────────────────────────────────────────────────────────────
  MONGO_URI: Joi.string().required(),

  // ─── Redis ─────────────────────────────────────────────────────────────────
  REDIS_URL: Joi.string().required(),

  // ─── JWT ───────────────────────────────────────────────────────────────────
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),

  // ─── AWS ───────────────────────────────────────────────────────────────────
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  CLOUDFRONT_DOMAIN: Joi.string().uri().required(),

  // ─── Razorpay ──────────────────────────────────────────────────────────────
  RAZORPAY_KEY_ID: Joi.string().required(),
  RAZORPAY_KEY_SECRET: Joi.string().required(),
  RAZORPAY_WEBHOOK_SECRET: Joi.string().required(),
  FEATURED_LISTING_PRICE: Joi.number().default(99900),

  // ─── Google ────────────────────────────────────────────────────────────────
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_MAPS_API_KEY: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().required(),

  // ─── Email ─────────────────────────────────────────────────────────────────
  SENDGRID_API_KEY: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().required(),
  EMAIL_FROM_NAME: Joi.string().required(),

  // ─── SMS ───────────────────────────────────────────────────────────────────
  TWILIO_ACCOUNT_SID: Joi.string().optional(),
  TWILIO_AUTH_TOKEN: Joi.string().optional(),
  TWILIO_FROM_NUMBER: Joi.string().optional(),
  MSG91_AUTH_KEY: Joi.string().optional(),
  MSG91_SENDER_ID: Joi.string().optional(),
  MSG91_TEMPLATE_ID: Joi.string().optional(),

  // ─── Admin Seed ────────────────────────────────────────────────────────────
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().min(8).required(),
  ADMIN_NAME: Joi.string().required(),

  // ─── Sentry ────────────────────────────────────────────────────────────────
  SENTRY_DSN: Joi.string().uri().optional(),
}).unknown(true);

/**
 * Validates all environment variables at startup.
 * Throws if any required variable is missing or invalid.
 * @returns {Object} validated and typed env object
 */
function validateEnv() {
  const { error, value } = envSchema.validate(process.env, { abortEarly: false });

  if (error) {
    const details = error.details.map((d) => `  ❌ ${d.message}`).join('\n');
    throw new Error(`\n[ENV VALIDATION FAILED]\n${details}\n\nFix these variables in your .env file before starting.`);
  }

  return value;
}

module.exports = validateEnv();
