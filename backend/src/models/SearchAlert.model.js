'use strict';

const mongoose = require('mongoose');

const searchAlertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    name: { type: String, trim: true, maxlength: 100 }, // user-given name for alert

    // Mirror of search filters
    filters: {
      city: String,
      locality: String,
      propertyType: String,
      bhkConfig: [String],
      listingType: String,
      priceMin: Number,
      priceMax: Number,
      areaMin: Number,
      areaMax: Number,
      furnishingStatus: String,
      possessionStatus: String,
      amenities: [String],
      reraApproved: Boolean,
    },

    isActive: { type: Boolean, default: true },
    lastTriggeredAt: { type: Date },
    matchCount: { type: Number, default: 0 }, // total matches sent
  },
  {
    timestamps: true,
  }
);

searchAlertSchema.index({ user: 1, isActive: 1 });

const SearchAlert = mongoose.model('SearchAlert', searchAlertSchema);

module.exports = SearchAlert;
