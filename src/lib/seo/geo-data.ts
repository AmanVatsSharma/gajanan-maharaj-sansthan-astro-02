/**
 * File: src/lib/seo/geo-data.ts
 * Module: lib/seo
 * Purpose: Geographic coordinates for locations to enhance local SEO
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 * Notes:
 * - Latitude and longitude for each location
 * - Used in structured data and geo meta tags
 * - Helps with local search rankings
 */

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
}

/**
 * Geographic coordinates for each Sansthan location
 */
export const LOCATION_COORDINATES: Record<string, GeoCoordinates> = {
  // Shegaon locations
  "shegaon-bhakt-niwas": {
    latitude: 20.7934,
    longitude: 76.6983,
    googleMapsUrl: "https://maps.google.com/?q=20.7934,76.6983",
  },
  "shegaon-anand-vihar": {
    latitude: 20.7950,
    longitude: 76.7000,
    googleMapsUrl: "https://maps.google.com/?q=20.7950,76.7000",
  },
  "shegaon-visawa": {
    latitude: 20.7920,
    longitude: 76.6970,
    googleMapsUrl: "https://maps.google.com/?q=20.7920,76.6970",
  },
  // Pandharpur
  "pandharpur-math": {
    latitude: 17.6741,
    longitude: 75.3270,
    googleMapsUrl: "https://maps.google.com/?q=17.6741,75.3270",
  },
  // Trimbakeshwar
  "trimbakeshwar": {
    latitude: 19.9331,
    longitude: 73.5297,
    googleMapsUrl: "https://maps.google.com/?q=19.9331,73.5297",
  },
  // Omkareshwar
  "omkareshwar": {
    latitude: 22.2405,
    longitude: 76.1476,
    googleMapsUrl: "https://maps.google.com/?q=22.2405,76.1476",
  },
};

/**
 * Get coordinates for a location by ID
 */
export function getLocationCoordinates(
  locationId: string
): GeoCoordinates | null {
  return LOCATION_COORDINATES[locationId] || null;
}

/**
 * Generate geo meta tags for a location
 */
export function getLocationGeoMetaTags(locationId: string) {
  const coords = getLocationCoordinates(locationId);
  if (!coords) return {};

  return {
    "geo.position": `${coords.latitude};${coords.longitude}`,
    "geo.placename": locationId,
    "ICBM": `${coords.latitude}, ${coords.longitude}`,
  };
}
