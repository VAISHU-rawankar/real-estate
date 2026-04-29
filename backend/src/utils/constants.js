'use strict';

// ─── Property Constants ───────────────────────────────────────────────────────
const PROPERTY_TYPES = ['residential', 'commercial', 'agricultural', 'plot'];

const LISTING_TYPES = ['sale', 'rent', 'lease'];

const PROPERTY_STATUSES = ['active', 'draft', 'sold', 'rented', 'archived', 'featured'];

const BHK_CONFIGS = ['studio', '1bhk', '2bhk', '3bhk', '4bhk', '4+bhk'];

const FACING_DIRECTIONS = ['east', 'west', 'north', 'south', 'north-east', 'north-west', 'south-east', 'south-west'];

const FURNISHING_STATUSES = ['furnished', 'semi-furnished', 'unfurnished'];

const POSSESSION_STATUSES = ['ready-to-move', 'under-construction', 'new-launch'];

const AREA_UNITS = ['sqft', 'sqyard', 'sqmeter', 'acre', 'hectare'];

const AGE_OPTIONS = ['new', 'less-than-5', '5-10', '10+'];

const PARKING_OPTIONS = ['covered', 'open', 'both', 'none'];

const SOCIETY_AMENITIES = [
  'gym', 'swimming-pool', 'clubhouse', '24hr-security', 'power-backup',
  'lift', 'cctv', 'intercom', 'visitor-parking', 'garden', 'playground',
  'jogging-track', 'tennis-court', 'basketball-court', 'indoor-games',
  'amphitheatre', 'party-hall', 'atm', 'supermarket',
];

const UNIT_AMENITIES = [
  'air-conditioning', 'modular-kitchen', 'wardrobe', 'washing-machine',
  'dishwasher', 'refrigerator', 'geyser', 'water-purifier',
  'false-ceiling', 'wood-flooring', 'marble-flooring', 'vitrified-tiles',
];

// ─── Lead Constants ───────────────────────────────────────────────────────────
const LEAD_STATUSES = ['new', 'contacted', 'interested', 'site-visit-scheduled', 'closed', 'lost'];

const LEAD_SOURCES = ['enquiry-form', 'whatsapp', 'call', 'callback-request', 'homepage-form', 'contact-page', 'search-alert'];

// ─── Roles ────────────────────────────────────────────────────────────────────
const USER_ROLES = ['user', 'admin', 'channelPartner'];

// ─── Pagination ───────────────────────────────────────────────────────────────
const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 50;

// ─── OTP ─────────────────────────────────────────────────────────────────────
const OTP_EXPIRY_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 3;
const OTP_BLOCK_MINUTES = 15;

// ─── Image ───────────────────────────────────────────────────────────────────
const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGES_PER_PROPERTY = 30;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const IMAGE_MAX_WIDTH = 1200;
const THUMBNAIL_WIDTH = 400;
const IMAGE_QUALITY = 80;

// ─── Cache TTL (seconds) ──────────────────────────────────────────────────────
const CACHE_TTL = {
  PROPERTY_SEARCH: 60,
  PROPERTY_DETAIL: 300,
  FEATURED_PROPERTIES: 300,
  DASHBOARD_STATS: 120,
};

// ─── Payment ─────────────────────────────────────────────────────────────────
const FEATURED_LISTING_PRICE_PAISE = parseInt(process.env.FEATURED_LISTING_PRICE || '99900', 10);

module.exports = {
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_STATUSES,
  BHK_CONFIGS,
  FACING_DIRECTIONS,
  FURNISHING_STATUSES,
  POSSESSION_STATUSES,
  AREA_UNITS,
  AGE_OPTIONS,
  PARKING_OPTIONS,
  SOCIETY_AMENITIES,
  UNIT_AMENITIES,
  LEAD_STATUSES,
  LEAD_SOURCES,
  USER_ROLES,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  OTP_EXPIRY_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_BLOCK_MINUTES,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGES_PER_PROPERTY,
  ALLOWED_MIME_TYPES,
  IMAGE_MAX_WIDTH,
  THUMBNAIL_WIDTH,
  IMAGE_QUALITY,
  CACHE_TTL,
  FEATURED_LISTING_PRICE_PAISE,
};
