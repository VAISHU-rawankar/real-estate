'use strict';

const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema(
  {
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'ChannelPartner', required: true, index: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },

    dealValue: { type: Number, required: true, min: 0 },
    commissionPercentage: { type: Number, required: true },
    commissionAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'rejected'],
      default: 'pending',
      index: true,
    },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },

    paymentReference: { type: String },
    payoutDate: { type: Date },

    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

commissionSchema.index({ partner: 1, status: 1 });
commissionSchema.index({ createdAt: -1 });

const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;
