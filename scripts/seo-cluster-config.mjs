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
  "locations/omkareshwar/omkareshwar-darshan-timings.md",
  "locations/shegaon/nearby-places-from-shegaon.md",
  "locations/shegaon/shegaon-travel-guide.md",
  "welcome-to-sansthan.md",
];
