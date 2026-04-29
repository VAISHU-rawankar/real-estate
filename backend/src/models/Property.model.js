'use strict';

const mongoose = require('mongoose');
const slugify = require('slugify');

// ─── Helper: generate unique slug ─────────────────────────────────────────────
async function generateUniqueSlug(title, excludeId = null) {
  const Property = mongoose.model('Property');
  let base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Property.findOne(query).select('_id').lean();
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    thumbnailUrl: String,
    caption: String,
    tag: {
      type: String,
      enum: ['exterior', 'living-room', 'bedroom', 'kitchen', 'bathroom', 'balcony', 'amenity', 'floor-plan', 'other'],
      default: 'other',
    },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const propertySchema = new mongoose.Schema(
  {
    // ─── Identity ────────────────────────────────────────────────────────────
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    description: { type: String, maxlength: 5000 },

    // ─── Classification ──────────────────────────────────────────────────────
    propertyType: {
      type: String,
      enum: ['residential', 'commercial', 'agricultural', 'plot'],
      required: [true, 'Property type is required'],
      index: true,
    },
    propertySubType: {
      type: String,
      enum: [
        // Residential
        'apartment', 'studio', '1bhk', '2bhk', '3bhk', '4bhk', '4+bhk',
        'penthouse', 'duplex', 'independent-house', 'villa', 'row-house',
        'twin-bungalow', 'bungalow', 'farmhouse', 'builder-floor', 'service-apartment',
        // Commercial
        'office-space', 'co-working', 'retail-shop', 'showroom', 'kiosk',
        'commercial-complex', 'mall', 'warehouse', 'cold-storage',
        'industrial-shed', 'factory', 'hotel', 'resort',
        // Agricultural
        'agricultural-land', 'orchard', 'plantation', 'poultry-farm',
        'weekend-farmhouse', 'commercial-farmhouse',
        // Plots
        'residential-plot', 'na-plot', 'layout-plot', 'corner-plot',
        'commercial-plot', 'industrial-plot', 'midc-plot', 'sez-plot',
        'agricultural-plot', 'mixed-use-plot', 'institutional-plot',
      ],
      required: [true, 'Property sub-type is required'],
    },
    listingType: {
      type: String,
      enum: ['sale', 'rent', 'lease'],
      required: [true, 'Listing type is required'],
      index: true,
    },

    // ─── Pricing ─────────────────────────────────────────────────────────────
    price: { type: Number, required: [true, 'Price is required'], min: 0, index: true },
    pricePerSqft: { type: Number, min: 0 },
    priceNegotiable: { type: Boolean, default: false },
    priceBreakup: {
      basePrice: Number,
      stampDuty: Number,
      registrationCharges: Number,
      maintenanceDeposit: Number,
      otherCharges: Number,
    },

    // ─── Area ────────────────────────────────────────────────────────────────
    carpetArea: { type: Number, min: 0 },
    builtUpArea: { type: Number, min: 0 },
    superBuiltUpArea: { type: Number, min: 0 },
    areaUnit: { type: String, enum: ['sqft', 'sqyard', 'sqmeter', 'acre', 'hectare'], default: 'sqft' },
    plotDimensions: { length: Number, width: Number },

    // ─── Configuration (Residential) ─────────────────────────────────────────
    bhkConfig: {
      type: String,
      enum: ['studio', '1bhk', '2bhk', '3bhk', '4bhk', '4+bhk'],
    },
    bathrooms: { type: Number, min: 0, max: 20 },
    balconies: { type: Number, min: 0, max: 10 },
    floorNumber: { type: Number },
    totalFloors: { type: Number },
    facing: {
      type: String,
      enum: ['east', 'west', 'north', 'south', 'north-east', 'north-west', 'south-east', 'south-west'],
    },
    ageOfProperty: { type: String, enum: ['new', 'less-than-5', '5-10', '10+'] },

    // ─── Status & Features ────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'draft', 'sold', 'rented', 'archived', 'featured'],
      default: 'draft',
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    furnishingStatus: { type: String, enum: ['furnished', 'semi-furnished', 'unfurnished'] },
    possessionStatus: { type: String, enum: ['ready-to-move', 'under-construction', 'new-launch'] },
    possessionDate: { type: Date },
    parking: { type: String, enum: ['covered', 'open', 'both', 'none'] },

    // ─── Legal ───────────────────────────────────────────────────────────────
    reraNumber: { type: String, trim: true },
    reraApproved: { type: Boolean, default: false },
    legalStatus: { type: String },
    projectName: { type: String, trim: true },

    // ─── Location ────────────────────────────────────────────────────────────
    location: {
      address: { type: String, required: [true, 'Address is required'] },
      locality: { type: String, required: [true, 'Locality is required'], index: true },
      city: { type: String, required: [true, 'City is required'], index: true },
      state: { type: String, required: [true, 'State is required'] },
      pincode: { type: String, match: [/^[0-9]{6}$/, 'Invalid pincode'] },
      country: { type: String, default: 'India' },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] }, // [longitude, latitude]
      },
    },

    // ─── Media ───────────────────────────────────────────────────────────────
    images: [imageSchema],
    videoUrl: { type: String },
    floorPlanImages: [{ url: String, caption: String }],
    virtualTourUrl: { type: String },

    // ─── Amenities ───────────────────────────────────────────────────────────
    societyAmenities: [
      {
        type: String,
        enum: [
          'gym', 'swimming-pool', 'clubhouse', '24hr-security', 'power-backup',
          'lift', 'cctv', 'intercom', 'visitor-parking', 'garden', 'playground',
          'temple', 'jogging-track', 'tennis-court', 'basketball-court',
          'indoor-games', 'amphitheatre', 'party-hall', 'atm', 'supermarket',
        ],
      },
    ],
    unitAmenities: [
      {
        type: String,
        enum: [
          'air-conditioning', 'modular-kitchen', 'wardrobe', 'washing-machine',
          'dishwasher', 'refrigerator', 'geyser', 'water-purifier',
          'false-ceiling', 'wood-flooring', 'marble-flooring', 'vitrified-tiles',
        ],
      },
    ],

    // ─── Plot-specific ───────────────────────────────────────────────────────
    plotType: { type: String },
    roadWidth: { type: Number },
    isCornerPlot: { type: Boolean },
    developmentPhase: { type: String },
    zoneType: { type: String },
    fsiRatio: { type: Number },
    soilType: { type: String },
    irrigationSource: { type: String },

    // ─── Commercial-specific ─────────────────────────────────────────────────
    officeType: { type: String },
    floorAreaRatio: { type: Number },
    powerLoad: { type: Number },

    // ─── SEO ─────────────────────────────────────────────────────────────────
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },

    // ─── Relations ───────────────────────────────────────────────────────────
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    channelPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'ChannelPartner' },

    // ─── Stats ───────────────────────────────────────────────────────────────
    viewCount: { type: Number, default: 0 },
    enquiryCount: { type: Number, default: 0 },
    shortlistCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ 'location.city': 1, status: 1, propertyType: 1 });
propertySchema.index({ price: 1, status: 1 });
propertySchema.index({ status: 1, isFeatured: 1, createdAt: -1 });
propertySchema.index({ reraNumber: 1 }, { sparse: true });
propertySchema.index({ slug: 1 }, { unique: true });
propertySchema.index(
  { title: 'text', description: 'text', 'location.locality': 'text', 'location.city': 'text', projectName: 'text' },
  { weights: { title: 10, 'location.locality': 5, 'location.city': 3, description: 1 } }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────
propertySchema.virtual('formattedPrice').get(function () {
  if (!this.price) return 'Price on Request';
  if (this.price >= 10_000_000) return `₹${(this.price / 10_000_000).toFixed(2)} Cr`;
  if (this.price >= 100_000) return `₹${(this.price / 100_000).toFixed(2)} L`;
  return `₹${this.price.toLocaleString('en-IN')}`;
});

propertySchema.virtual('primaryImage').get(function () {
  if (!this.images || this.images.length === 0) return null;
  return this.images.find((img) => img.isPrimary) || this.images[0];
});

// ─── Pre-save Hook: generate slug ─────────────────────────────────────────────
propertySchema.pre('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = await generateUniqueSlug(this.title, this._id);
  }
  next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
