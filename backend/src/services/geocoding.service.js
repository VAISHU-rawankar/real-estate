'use strict';

const logger = require('../utils/logger');

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api';

/**
 * Geocode an address string to lat/lng coordinates.
 * @param {string} address
 * @returns {Promise<{lat, lng} | null>}
 */
async function geocodeAddress(address) {
  if (!MAPS_API_KEY) {
    logger.warn('GOOGLE_MAPS_API_KEY not set — geocoding skipped');
    return null;
  }

  try {
    const url = `${BASE_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_API_KEY}&region=in`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }

    logger.warn(`Geocoding returned status ${data.status} for: ${address}`);
    return null;
  } catch (err) {
    logger.error(`Geocoding error for "${address}": ${err.message}`);
    return null;
  }
}

/**
 * Reverse geocode lat/lng to a human-readable address.
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<string | null>}
 */
async function reverseGeocode(lat, lng) {
  if (!MAPS_API_KEY) return null;

  try {
    const url = `${BASE_URL}/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (err) {
    logger.error(`Reverse geocoding error: ${err.message}`);
    return null;
  }
}

/**
 * Get place autocomplete suggestions from Google Places API.
 * @param {string} query
 * @returns {Promise<Array>}
 */
async function getPlaceSuggestions(query) {
  if (!MAPS_API_KEY || !query) return [];

  try {
    const url = `${BASE_URL}/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${MAPS_API_KEY}&components=country:in&types=(cities)`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();

    if (data.status === 'OK') {
      return data.predictions.map((p) => ({
        placeId: p.place_id,
        description: p.description,
        mainText: p.structured_formatting.main_text,
      }));
    }
    return [];
  } catch (err) {
    logger.error(`Places autocomplete error: ${err.message}`);
    return [];
  }
}

module.exports = { geocodeAddress, reverseGeocode, getPlaceSuggestions };
