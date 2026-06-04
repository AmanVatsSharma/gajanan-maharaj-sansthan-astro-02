/**
 * File: scripts/verify-location-seo-surfaces.mjs
 * Module: scripts
 * Purpose: Validate SEO signals across all prerendered location detail pages.
 * Notes:
 * - Ensures each location page has canonical + keywords meta + geo tags.
 * - Ensures each location page includes PlaceOfWorship, LocalBusiness, LodgingBusiness schemas.
 */

import fs from "node:fs";
import path from "node:path";

const LOCATION_HTML_DIR = path.join(process.cwd(), "dist/client/locations");
const REQUIRED_SCHEMA_TYPES = ["PlaceOfWorship", "LocalBusiness", "LodgingBusiness"];
const REQUIRED_GEO_META_NAMES = ["geo.position", "geo.placename", "geo.region", "ICBM"];
const CANONICAL_ORIGIN = "https://www.srigajananmaharajsanstan.com/locations/";

function getLocationDetailFiles() {
  if (!fs.existsSync(LOCATION_HTML_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(LOCATION_HTML_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const candidate = path.join(LOCATION_HTML_DIR, entry.name, "index.html");
      return {
        absolutePath: candidate,
        fileName: `${entry.name}.html`,
      };
    })
    .filter(({ absolutePath }) => fs.existsSync(absolutePath));
}

function extractSchemaTypes(html) {
  const schemaTypes = new Set();
  const jsonLdRegex =
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let match;

  function collectTypes(value) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          schemaTypes.add(item);
        } else {
          collectTypes(item);
        }
      }
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    const typedValue = value;
    const atType = typedValue["@type"];
    if (typeof atType === "string") {
      schemaTypes.add(atType);
    } else if (Array.isArray(atType)) {
      for (const item of atType) {
        if (typeof item === "string") {
          schemaTypes.add(item);
        }
      }
    }

    for (const child of Object.values(typedValue)) {
      collectTypes(child);
    }
  }

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      collectTypes(parsed);
    } catch {
      // Skip malformed schema script parsing; separate checks will catch missing types.
    }
  }

  return schemaTypes;
}

function hasCanonicalForLocation(html) {
  return new RegExp(
    `<link[^>]+rel="canonical"[^>]+href="${CANONICAL_ORIGIN.replace(
      /\//g,
      "\\/"
    )}[^"]+"`
  ).test(html);
}

function hasKeywordsMeta(html) {
  return /<meta[^>]+name="keywords"[^>]+content="[^"]{10,}"/.test(html);
}

function hasGeoMeta(html, metaName) {
  return new RegExp(`<meta[^>]+name="${metaName.replace(".", "\\.")}"[^>]+content="[^"]+"`).test(
    html
  );
}

function main() {
  console.info("location-seo-verify-start", {
    timestamp: Date.now(),
    locationDir: LOCATION_HTML_DIR,
  });

  const locationFiles = getLocationDetailFiles();
  if (locationFiles.length === 0) {
    console.error("location-seo-verify-error", {
      timestamp: Date.now(),
      message: "No prerendered location detail HTML files found. Run npm run build first.",
    });
    process.exit(1);
  }

  const failures = [];

  for (const locationFile of locationFiles) {
    const html = fs.readFileSync(locationFile.absolutePath, "utf-8");
    const relativePath = `locations/${locationFile.fileName}`;

    if (!hasCanonicalForLocation(html)) {
      failures.push({
        file: relativePath,
        check: "canonical",
        reason: "Missing or invalid location canonical URL.",
      });
    }

    if (!hasKeywordsMeta(html)) {
      failures.push({
        file: relativePath,
        check: "keywords",
        reason: "Missing keywords meta tag on location page.",
      });
    }

    for (const geoMetaName of REQUIRED_GEO_META_NAMES) {
      if (!hasGeoMeta(html, geoMetaName)) {
        failures.push({
          file: relativePath,
          check: "geo-meta",
          reason: `Missing geo meta tag "${geoMetaName}"`,
        });
      }
    }

    const availableSchemaTypes = extractSchemaTypes(html);
    for (const schemaType of REQUIRED_SCHEMA_TYPES) {
      if (!availableSchemaTypes.has(schemaType)) {
        failures.push({
          file: relativePath,
          check: "schema-type",
          reason: `Missing required schema @type "${schemaType}"`,
        });
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures.slice(0, 30)) {
      console.error("location-seo-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("location-seo-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      locationCount: locationFiles.length,
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("location-seo-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    locationCount: locationFiles.length,
  });
}

try {
  main();
} catch (error) {
  console.error("location-seo-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
