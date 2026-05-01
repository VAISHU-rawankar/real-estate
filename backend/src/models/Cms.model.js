'use strict';

const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      index: true,
      enum: ['home', 'about', 'contact', 'global'],
    },
    section: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      // Primary language (English) fields
      title: { type: String },
      subtitle: { type: String },
      description: { type: String },
      buttonText: { type: String },
      buttonLink: { type: String },
      imageUrl: { type: String },
      images: [{ type: String }], // Array of images
      features: [{ title: String, description: String, icon: String }],
      testimonials: [{ name: String, role: String, text: String, avatar: String }],
      // Multi-language support mapping e.g., { hi: { title: '...', description: '...' }, es: { ... } }
      translations: { type: mongoose.Schema.Types.Mixed },
      additionalData: { type: mongoose.Schema.Types.Mixed }
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Ensure unique page-section combination
cmsSchema.index({ page: 1, section: 1 }, { unique: true });

const Cms = mongoose.model('Cms', cmsSchema);

module.exports = Cms;
