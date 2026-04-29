'use strict';

const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate shortlist entries per user+property
shortlistSchema.index({ user: 1, property: 1 }, { unique: true });

const Shortlist = mongoose.model('Shortlist', shortlistSchema);
module.exports = Shortlist;
