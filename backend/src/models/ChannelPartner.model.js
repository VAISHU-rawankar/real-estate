'use strict';

const mongoose = require('mongoose');

const channelPartnerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agencyName: { type: String, required: true, trim: true },
    reraNumber: { type: String, trim: true },
    logo: { type: String },
    bio: { type: String, maxlength: 1000 },

    serviceAreas: [String], // cities/localities
    specializations: [
      {
        type: String,
        enum: ['residential', 'commercial', 'agricultural', 'plot', 'luxury', 'affordable'],
      },
    ],

    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'rejected'],
      default: 'pending',
      index: true,
    },

    referralCode: { type: String, unique: true, sparse: true },

    commissionSlab: {
      residential: { type: Number, default: 1 },    // percentage
      commercial: { type: Number, default: 2 },
      agricultural: { type: Number, default: 1.5 },
      plot: { type: Number, default: 1.5 },
    },

    // Performance stats (denormalized for speed)
    totalLeadsSubmitted: { type: Number, default: 0 },
    totalDealsClosied: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },

    activatedAt: { type: Date },
    activatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

channelPartnerSchema.index({ userId: 1 }, { unique: true });
channelPartnerSchema.index({ referralCode: 1 }, { sparse: true });

const ChannelPartner = mongoose.model('ChannelPartner', channelPartnerSchema);

module.exports = ChannelPartner;
