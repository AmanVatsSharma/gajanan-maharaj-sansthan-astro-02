/**
 * File: scripts/seo-cluster-config.mjs
 * Module: scripts
 * Purpose: Shared SEO content-cluster distribution constants for generation and validation.
 * Notes:
 * - Keeps generator targets and validator minimums aligned in one place.
 * - Update this file first when changing cluster sizing strategy.
 */

import crypto from "node:crypto";

export const LOCATION_CLUSTER_TARGETS = {
  shegaon: 80,
  omkareshwar: 130,
  pandharpur: 90,
  trimbakeshwar: 115,
};

export const NON_LOCATION_CLUSTER_TARGETS = {
  guides: 93,
  spiritual: 42,
  events: 41,
};

export const LOCATION_CLUSTER_KEYS = Object.keys(LOCATION_CLUSTER_TARGETS);

export const EXPECTED_GENERATED_TOTAL =
  Object.values(LOCATION_CLUSTER_TARGETS).reduce((sum, value) => sum + value, 0) +
  Object.values(NON_LOCATION_CLUSTER_TARGETS).reduce((sum, value) => sum + value, 0);

export const CLUSTER_CONFIG_PAYLOAD = {
  locationClusterTargets: LOCATION_CLUSTER_TARGETS,
  nonLocationClusterTargets: NON_LOCATION_CLUSTER_TARGETS,
  expectedGeneratedTotal: EXPECTED_GENERATED_TOTAL,
};

export const CLUSTER_CONFIG_FINGERPRINT = crypto
  .createHash("sha256")
  .update(JSON.stringify(CLUSTER_CONFIG_PAYLOAD))
  .digest("hex")
  .slice(0, 16);

/**
 * Legacy/manual seed posts intentionally kept outside generated manifest ownership.
 * These act as historical anchors and should not be deleted by generator cleanup.
 */
export const MANUAL_SEED_POST_PATHS = [
  "guides/shegaon-accommodation-guide.md",
  "locations/omkareshwar/gajanan-maharaj-omkareshwar-combined-yatra-7-day.md",
  "locations/omkareshwar/omkareshwar-12-jyotirlinga-yatra-plan.md",
  "locations/omkareshwar/omkareshwar-bhakta-niwas-advance-payment-guide.md",
  "locations/omkareshwar/omkareshwar-bhakta-niwas-room-photo-tour.md",
  "locations/omkareshwar/omkareshwar-darshan-timings.md",
  "locations/omkareshwar/omkareshwar-contact-and-emergency-support.md",
  "locations/omkareshwar/omkareshwar-family-yatra-planning.md",
  "locations/omkareshwar/omkareshwar-festival-advance-booking-guide.md",
  "locations/omkareshwar/omkareshwar-kartik-purnima-booking-guide.md",
  "locations/omkareshwar/omkareshwar-prasad-and-darshan-etiquette.md",
  "locations/omkareshwar/omkareshwar-sawan-monday-booking-strategy.md",
  "locations/omkareshwar/omkareshwar-senior-citizen-and-accessibility-guide.md",
  "locations/omkareshwar/omkareshwar-ujjain-mahakaleshwar-two-day-combo.md",
  "locations/shegaon/nearby-places-from-shegaon.md",
  "locations/shegaon/shegaon-travel-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-best-time-to-visit.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-accommodation-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-booking-process.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-refund-and-cancellation-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-whatsapp-message-template.md",
  "locations/trimbakeshwar/trimbakeshwar-brahmagiri-trek-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-budget-pilgrimage-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-canteen-and-mahaprasad-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-darshan-timing-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-family-yatra-planning.md",
  "locations/trimbakeshwar/trimbakeshwar-festival-advance-booking-window.md",
  "locations/trimbakeshwar/trimbakeshwar-mahashivratri-booking-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-nashik-trimbakeshwar-combo-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-route-and-transport-options.md",
  "locations/trimbakeshwar/trimbakeshwar-sawan-monday-booking-strategy.md",
  "locations/trimbakeshwar/trimbakeshwar-senior-citizen-travel-tips.md",
  "locations/trimbakeshwar/trimbakeshwar-temple-complex-map-and-directions.md",
  "locations/trimbakeshwar/trimbakeshwar-three-day-itinerary.md",
  "welcome-to-sansthan.md",
  // Part A — 10 new SEO content overhaul posts (2026-07-13)
  "guides/gajanan-vijay-granth-parayan-complete-guide.md",
  "spiritual/gajanan-maharaj-biography-life-story-shegaon.md",
  "spiritual/gajanan-maharaj-aarti-mantra-lyrics-meaning.md",
  "guides/trimbakeshwar-narayan-nagbali-kaal-sarp-dosh-pooja-guide.md",
  "guides/shegaon-samadhi-mandir-history-architecture.md",
  "guides/bhakt-niwas-room-tariff-room-types-2026.md",
  "guides/how-to-reach-shegaon-train-bus-from-every-city.md",
  "guides/shegaon-annadan-mahaprasad-free-food-guide.md",
  "events/rishi-panchami-shegaon-samadhi-utsav-guide.md",
  "guides/omkareshwar-mamleshwar-jyotirlinga-darshan-guide.md",
  // Part A — additional new SEO content overhaul posts (2026-07-15)
  "guides/omkareshwar-bhakta-niwas-accommodation-guide.md",
  "guides/omkareshwar-darshan-timing-guide.md",
  "guides/omkareshwar-first-time-visitor-guide.md",
  // Part B — in-place rewrites (same target keywords, gold-standard content)
  "locations/shegaon/shegaon-darshan-timing-guide.md",
  "locations/shegaon/shegaon-bhakta-niwas-accommodation-guide.md",
  "locations/shegaon/shegaon-bhakta-niwas-booking-process.md",
  "locations/shegaon/shegaon-anand-sagar-visit-guide.md",
  "locations/omkareshwar/omkareshwar-darshan-timing-guide.md",
  "locations/omkareshwar/omkareshwar-bhakta-niwas-accommodation-guide.md",
  "locations/omkareshwar/omkareshwar-first-time-visitor-guide.md",
  "locations/pandharpur/pandharpur-darshan-timing-guide.md",
  "locations/pandharpur/pandharpur-bhakta-niwas-accommodation-guide.md",
  "locations/pandharpur/pandharpur-first-time-visitor-guide.md",
  // Part B — additional in-place rewrites (Pandharpur + Jyotirlinga pillar, 2026-07-16)
  "locations/trimbakeshwar/trimbakeshwar-darshan-timing-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-accommodation-guide.md",
  "guides/all-12-jyotirlinga-planning.md",
  // 2026-09-05 gold-standard batch 1 — Shegaon (#29–38)
  "locations/shegaon/shegaon-bhakta-niwas-check-in-check-out-timings.md",
  "locations/shegaon/shegaon-bhakta-niwas-online-booking-vs-whatsapp.md",
  "locations/shegaon/shegaon-bhakta-niwas-refund-and-cancellation-guide.md",
  "locations/shegaon/shegaon-bhakta-niwas-dormitory-vs-family-rooms.md",
  "locations/shegaon/shegaon-bhakta-niwas-room-types-and-facilities.md",
  "locations/shegaon/shegaon-bhakta-niwas-common-booking-mistakes.md",
  "locations/shegaon/shegaon-room-booking-near-samadhi-mandir.md",
  "locations/shegaon/shegaon-bhakta-niwas-booking-confirmation-timeline.md",
  "locations/shegaon/shegaon-visawa-room-booking-guide.md",
  "locations/shegaon/shegaon-room-booking-during-ekadashi-and-festivals.md",
  // 2026-09-05 gold-standard batch 2 — Shegaon + Pandharpur (#39–48)
  "locations/shegaon/shegaon-bhakta-niwas-advance-payment-guide.md",
  "locations/shegaon/shegaon-same-day-room-booking-options.md",
  "locations/shegaon/shegaon-gajanan-maharaj-temple-complete-visitor-guide.md",
  "locations/shegaon/shegaon-train-timings-and-stay-planning.md",
  "locations/shegaon/shegaon-one-day-vs-two-day-visit-planning.md",
  "locations/shegaon/shegaon-family-trip-itinerary-with-room-booking.md",
  "locations/shegaon/shegaon-darshan-and-stay-same-trip-planning.md",
  "locations/shegaon/shegaon-nearby-devasthan-visit-with-overnight-stay.md",
  "locations/pandharpur/pandharpur-bhakta-niwas-check-in-check-out-timings.md",
  "locations/pandharpur/pandharpur-bhakta-niwas-online-booking-vs-whatsapp.md",
];
