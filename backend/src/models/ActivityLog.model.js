'use strict';

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true, trim: true },
    target: { type: String, required: true }, // 'property' | 'lead' | 'user' | 'blog' | 'partner'
    targetId: { type: mongoose.Schema.Types.ObjectId },
    targetTitle: { type: String }, // Denormalized for display
    metadata: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ admin: 1, createdAt: -1 });
activityLogSchema.index({ target: 1, targetId: 1 });
activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;
