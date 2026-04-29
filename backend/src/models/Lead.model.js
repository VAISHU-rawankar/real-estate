'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    email: { type: String, lowercase: true, trim: true },
    message: { type: String, maxlength: 1000 },

    // Property this lead is for (optional — could be a general enquiry)
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },

    // Source of the lead
    source: {
      type: String,
      enum: ['enquiry-form', 'whatsapp', 'call', 'callback-request', 'homepage-form', 'contact-page', 'search-alert'],
      default: 'enquiry-form',
    },

    // CRM Status workflow
    status: {
      type: String,
      enum: ['new', 'contacted', 'interested', 'site-visit-scheduled', 'closed', 'lost'],
      default: 'new',
      index: true,
    },

    // Lead quality
    isVerified: { type: Boolean, default: false }, // phone OTP verified
    isDuplicate: { type: Boolean, default: false },

    // Visit scheduling
    visitScheduledAt: { type: Date },
    preferredVisitTime: { type: String },

    // Assignment
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Channel Partner attribution
    channelPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'ChannelPartner' },

    // Admin notes timeline
    notes: [noteSchema],

    // Status history
    statusHistory: [
      {
        status: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
leadSchema.index({ phone: 1 });
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ property: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ channelPartner: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
