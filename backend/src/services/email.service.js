'use strict';

const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const logger = require('../utils/logger');

// ─── Configure transport ──────────────────────────────────────────────────────
let transporter;

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const FROM = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`;

// ─── Core send function ───────────────────────────────────────────────────────
async function sendEmail({ to, subject, html, text }) {
  try {
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send({ from: FROM, to, subject, html, text: text || '' });
    } else {
      await transporter.sendMail({ from: FROM, to, subject, html, text: text || '' });
    }
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Email send failed to ${to}: ${err.message}`);
    // Don't throw — email failures shouldn't break user flows
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────────

/**
 * Send OTP via email.
 * @param {string} email
 * @param {string} otp
 * @param {string} type - 'registration' | 'password-reset' | 'login'
 */
async function sendOTPEmail(email, otp, type) {
  const typeLabels = {
    registration: 'verify your account',
    'password-reset': 'reset your password',
    login: 'log in',
    'phone-verify': 'verify your phone',
    'admin-2fa': 'confirm your identity',
  };

  const label = typeLabels[type] || 'proceed';

  await sendEmail({
    to: email,
    subject: `Your OTP to ${label} — ${otp}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #0F172A; margin: 0;">Real Estate Platform</h1>
        </div>
        <p style="color: #64748B; font-size: 15px;">Use the OTP below to ${label}. It expires in 5 minutes.</p>
        <div style="background: #0F172A; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 40px; font-weight: 700; letter-spacing: 12px; color: #D4A853; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
        <p style="color: #94A3B8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Real Estate Platform. All rights reserved.</p>
      </div>
    `,
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
  });
}

/**
 * Send welcome email to new user.
 * @param {{ name, email }} user
 */
async function sendWelcomeEmail(user) {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Real Estate Platform!',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="color: #0F172A;">Welcome, ${user.name}! 🏠</h1>
        <p style="color: #64748B;">Your account has been created successfully. Start exploring thousands of verified properties.</p>
        <a href="${process.env.CLIENT_URL}" style="display: inline-block; background: #D4A853; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Browse Properties</a>
      </div>
    `,
  });
}

/**
 * Notify admin of a new lead.
 * @param {{ name, email }} admin
 * @param {Object} lead
 * @param {Object} property
 */
async function sendLeadNotification(admin, lead, property) {
  await sendEmail({
    to: admin.email,
    subject: `New Lead: ${lead.name} enquired about ${property?.title || 'a property'}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h2 style="color: #0F172A;">New Lead Received 🔔</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Name</td><td style="padding: 8px 0; color: #0F172A;">${lead.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Phone</td><td style="padding: 8px 0; color: #0F172A;">${lead.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Email</td><td style="padding: 8px 0; color: #0F172A;">${lead.email || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Property</td><td style="padding: 8px 0; color: #0F172A;">${property?.title || 'General Enquiry'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Message</td><td style="padding: 8px 0; color: #0F172A;">${lead.message || '—'}</td></tr>
        </table>
        <a href="${process.env.CLIENT_URL}/admin/leads" style="display: inline-block; background: #0F172A; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">View in Dashboard</a>
      </div>
    `,
  });
}

/**
 * Send search alert email to user with matching new properties.
 * @param {{ name, email }} user
 * @param {Property[]} properties
 * @param {Object} savedSearch
 */
async function sendSearchAlertEmail(user, properties, savedSearch) {
  const propCards = properties
    .slice(0, 5)
    .map(
      (p) => `
        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <h3 style="margin: 0 0 4px; color: #0F172A; font-size: 16px;">${p.title}</h3>
          <p style="margin: 0; color: #64748B; font-size: 14px;">${p.location?.locality}, ${p.location?.city}</p>
          <p style="margin: 8px 0 0; color: #D4A853; font-weight: 600;">${p.formattedPrice}</p>
          <a href="${process.env.CLIENT_URL}/properties/${p.slug}" style="color: #0F172A; font-size: 13px;">View Property →</a>
        </div>
      `
    )
    .join('');

  await sendEmail({
    to: user.email,
    subject: `${properties.length} new properties match your alert!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 540px; margin: 0 auto; padding: 40px 24px;">
        <h2 style="color: #0F172A;">New Properties for You 🏠</h2>
        <p style="color: #64748B;">We found <strong>${properties.length}</strong> new listings matching your saved search "${savedSearch.name || 'your search'}".</p>
        ${propCards}
        <a href="${process.env.CLIENT_URL}/properties" style="display: inline-block; background: #D4A853; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View All Results</a>
      </div>
    `,
  });
}

/**
 * Send partner welcome email.
 * @param {{ name, email }} partner
 */
async function sendPartnerWelcomeEmail(partner) {
  await sendEmail({
    to: partner.email,
    subject: 'Welcome to Our Channel Partner Program!',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="color: #0F172A;">Welcome, ${partner.name}! 🤝</h1>
        <p style="color: #64748B;">Your channel partner account has been activated. Access your portal below to start sharing listings and tracking commissions.</p>
        <a href="${process.env.CLIENT_URL}/partner" style="display: inline-block; background: #D4A853; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Access Partner Portal</a>
      </div>
    `,
  });
}

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendLeadNotification,
  sendSearchAlertEmail,
  sendPartnerWelcomeEmail,
};
