/**
 * File: scripts/verify-seo-build.mjs
 * Module: scripts
 * Purpose: Validate critical SEO signals in prerendered build HTML.
 * Notes:
 * - This script checks canonical/meta/schema presence for key routes.
 * - Intended to be run after `npm run build`.
 */

import fs from "node:fs";
import path from "node:path";

const APP_SERVER_DIR = path.join(process.cwd(), ".next/server/app");

const REQUIRED_ROUTES = [
  {
    id: "home",
    filePath: "index.html",
    checks: ["canonical", "keywords", "ogTitle", "jsonLd"],
    requiredSchemaTypes: ["Organization", "WebSite"],
    requiredKeywordFragments: [
      "shri gajanan maharaj sansthan",
      "shree gajanan maharaj sansthan",
      "sri gajanan maharaj sansthan",
      "shri gajanan maharaj sanstan",
    ],
  },
  {
    id: "booking",
    filePath: "booking.html",
    checks: ["canonical", "keywords", "jsonLd"],
    requiredSchemaTypes: ["FAQPage", "BreadcrumbList"],
    requiredKeywordFragments: ["shegaon accommodation booking", "gajanan maharaj booking helpline"],
  },
  {
    id: "locations-index",
    filePath: "locations.html",
    checks: ["canonical", "keywords"],
    requiredKeywordFragments: ["shegaon", "omkareshwar", "pandharpur", "trimbakeshwar"],
  },
  {
    id: "location-shegaon-bhakt-niwas",
    filePath: "locations/shegaon-bhakt-niwas.html",
    checks: ["canonical", "keywords", "jsonLd"],
    requiredSchemaTypes: ["PlaceOfWorship", "LocalBusiness", "LodgingBusiness"],
    requiredKeywordFragments: ["shegaon", "bhakt niwas", "dharamshala booking"],
  },
  {
    id: "blog-index",
    filePath: "blog.html",
    checks: ["canonical", "keywords", "jsonLd"],
    requiredSchemaTypes: ["CollectionPage"],
    requiredKeywordFragments: ["shegaon pilgrimage guide", "omkareshwar pilgrimage guide"],
  },
  {
    id: "blog-page-2",
    filePath: "blog/page/2.html",
    checks: ["canonical", "keywords", "jsonLd"],
    requiredSchemaTypes: ["CollectionPage"],
  },
  {
    id: "blog-post-shegaon-travel-guide",
    filePath: "blog/shegaon-travel-guide.html",
    checks: ["canonical", "keywords", "ogTitle", "jsonLd"],
    requiredSchemaTypes: ["BlogPosting", "BreadcrumbList"],
    requiredKeywordFragments: ["shegaon travel guide", "gajanan maharaj sansthan shegaon"],
  },
  {
    id: "blog-category-locations",
    filePath: "blog/category/locations.html",
    checks: ["canonical", "keywords", "jsonLd"],
    requiredSchemaTypes: ["CollectionPage", "BreadcrumbList"],
  },
  {
    id: "blog-tag-shegaon",
    filePath: "blog/tag/shegaon.html",
    checks: ["canonical", "keywords", "jsonLd"],
    requiredSchemaTypes: ["CollectionPage", "BreadcrumbList"],
  },
  {
    id: "contact",
    filePath: "contact.html",
    checks: ["canonical", "keywords"],
  },
];

function getRouteFileAbsolutePath(routeFilePath) {
  return path.join(APP_SERVER_DIR, routeFilePath);
}

function hasCanonicalTag(html) {
  const hasAbsoluteCanonical =
    /<link[^>]+rel="canonical"[^>]+href="https:\/\/www\.gajananmaharajsanstan\.com(?:\/[^"]*)?"/.test(
      html
    );
  const hasRootRelativeCanonical = /<link[^>]+rel="canonical"[^>]+href="\/"/.test(
    html
  );

  return hasAbsoluteCanonical || hasRootRelativeCanonical;
}

function hasKeywordsMeta(html) {
  return /<meta[^>]+name="keywords"[^>]+content="[^"]{10,}"/.test(html);
}

function hasOgTitle(html) {
  return /<meta[^>]+property="og:title"[^>]+content="[^"]+"/.test(html);
}

function hasJsonLd(html) {
  return /<script[^>]+type="application\/ld\+json"/.test(html);
}

function extractKeywordsMetaContent(html) {
  const match = html.match(/<meta[^>]+name="keywords"[^>]+content="([^"]*)"/);
  return match?.[1]?.toLowerCase() || "";
}

/**
 * Extract all schema @type values from inline JSON-LD scripts.
 * Supports objects, arrays, and nested graph structures.
 */
function extractSchemaTypes(html) {
  const schemaTypes = new Set();
  const jsonLdRegex =
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let match;

  function collectTypes(value) {
    if (Array.isArray(value)) {
      for (const item of value) {
        collectTypes(item);
      }
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    const typedValue = value;
    if (typeof typedValue["@type"] === "string") {
      schemaTypes.add(typedValue["@type"]);
    }

    for (const child of Object.values(typedValue)) {
      collectTypes(child);
    }
  }

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      collectTypes(parsed);
    } catch (error) {
      console.warn("seo-build-verify-warning", {
        timestamp: Date.now(),
        message: "Failed to parse JSON-LD block while extracting schema types.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return schemaTypes;
}

function runCheck(html, checkName) {
  switch (checkName) {
    case "canonical":
      return hasCanonicalTag(html);
    case "keywords":
      return hasKeywordsMeta(html);
    case "ogTitle":
      return hasOgTitle(html);
    case "jsonLd":
      return hasJsonLd(html);
    default:
      return false;
  }
}

function main() {
  console.info("seo-build-verify-start", {
    timestamp: Date.now(),
    appServerDir: APP_SERVER_DIR,
    routeCount: REQUIRED_ROUTES.length,
  });

  if (!fs.existsSync(APP_SERVER_DIR)) {
    console.error("seo-build-verify-error", {
      timestamp: Date.now(),
      message: "Build output directory not found. Run `npm run build` first.",
    });
    process.exit(1);
  }

  const failures = [];

  for (const route of REQUIRED_ROUTES) {
    const absoluteFilePath = getRouteFileAbsolutePath(route.filePath);
    if (!fs.existsSync(absoluteFilePath)) {
      failures.push({
        routeId: route.id,
        filePath: route.filePath,
        check: "file-exists",
        reason: "Expected prerendered HTML file is missing.",
      });
      continue;
    }

    const html = fs.readFileSync(absoluteFilePath, "utf-8");
    for (const check of route.checks) {
      const passed = runCheck(html, check);
      if (!passed) {
        failures.push({
          routeId: route.id,
          filePath: route.filePath,
          check,
          reason: `Missing required SEO signal: ${check}`,
        });
      }
    }

    if (route.requiredSchemaTypes && route.requiredSchemaTypes.length > 0) {
      const availableSchemaTypes = extractSchemaTypes(html);
      for (const requiredSchemaType of route.requiredSchemaTypes) {
        if (!availableSchemaTypes.has(requiredSchemaType)) {
          failures.push({
            routeId: route.id,
            filePath: route.filePath,
            check: "schema-type",
            reason: `Missing required schema @type: ${requiredSchemaType}`,
          });
        }
      }
    }

    if (route.requiredKeywordFragments && route.requiredKeywordFragments.length > 0) {
      const keywordMeta = extractKeywordsMetaContent(html);
      for (const keywordFragment of route.requiredKeywordFragments) {
        if (!keywordMeta.includes(keywordFragment.toLowerCase())) {
          failures.push({
            routeId: route.id,
            filePath: route.filePath,
            check: "keyword-fragment",
            reason: `Missing required keyword fragment in meta keywords: "${keywordFragment}"`,
          });
        }
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("seo-build-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("seo-build-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("seo-build-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    checkedRoutes: REQUIRED_ROUTES.length,
  });
}

try {
  main();
} catch (error) {
  console.error("seo-build-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
