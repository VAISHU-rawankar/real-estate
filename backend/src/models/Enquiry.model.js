'use strict';

const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    message: { type: String, maxlength: 1000 },
    source: {
      type: String,
      enum: ['form', 'whatsapp', 'call', 'callback'],
      default: 'form',
    },
    status: {
      type: String,
      enum: ['new', 'viewed', 'responded'],
      default: 'new',
    },
    visitRequested: { type: Boolean, default: false },
    preferredDate: { type: Date },
    isPhoneVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

enquirySchema.index({ property: 1, createdAt: -1 });
enquirySchema.index({ status: 1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = Enquiry;
