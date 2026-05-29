/**
 * File: scripts/verify-robots-policy.mjs
 * Module: scripts
 * Purpose: Validate prerendered robots.txt from Astro dist.
 * Notes:
 * - Reads dist/client/robots.txt after `astro build`.
 * - Directive names are matched case-insensitively where robots.txt allows variants.
 */

import fs from "node:fs";
import {
  distClientFile,
  getDistClientDir,
  getExpectedSiteOrigin,
} from "./seo-verify-shared.mjs";

function normalizeLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function directiveKey(line) {
  const idx = line.indexOf(":");
  if (idx === -1) {
    return line.toLowerCase();
  }
  const name = line.slice(0, idx).trim().toLowerCase();
  const value = line.slice(idx + 1).trim().toLowerCase();
  return `${name}:${value}`;
}

function main() {
  const siteOrigin = getExpectedSiteOrigin();
  const robotsPath = distClientFile("robots.txt");

  console.info("robots-verify-start", {
    timestamp: Date.now(),
    robotsPath,
    siteOrigin,
  });

  if (!fs.existsSync(robotsPath)) {
    console.error("robots-verify-error", {
      timestamp: Date.now(),
      message: "robots.txt not found. Run npm run build first.",
      path: robotsPath,
      distClient: getDistClientDir(),
    });
    process.exit(1);
  }

  const content = fs.readFileSync(robotsPath, "utf-8");
  const lines = normalizeLines(content);
  const keySet = new Set(lines.map(directiveKey));
  const failures = [];

  const required = [
    "user-agent:*",
    "allow:/",
    "disallow:/api/",
    "disallow:/admin/",
    "user-agent:googlebot-image",
    "allow:/images/",
    "allow:/gallery/",
    `sitemap:${siteOrigin}/sitemap.xml`,
    `host:${siteOrigin}`,
  ];

  for (const req of required) {
    if (!keySet.has(req)) {
      failures.push(`Missing required robots directive (normalized): "${req}"`);
    }
  }

  const sitemapLines = lines.filter((line) => line.toLowerCase().startsWith("sitemap:"));
  if (sitemapLines.length !== 1) {
    failures.push(`Expected exactly one Sitemap directive but found ${sitemapLines.length}.`);
  }

  const hostLines = lines.filter((line) => line.toLowerCase().startsWith("host:"));
  if (hostLines.length !== 1) {
    failures.push(`Expected exactly one Host directive but found ${hostLines.length}.`);
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("robots-verify-failure", {
        timestamp: Date.now(),
        reason: failure,
      });
    }

    console.error("robots-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("robots-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    directiveCount: lines.length,
  });
}

try {
  main();
} catch (error) {
  console.error("robots-verify-failure", {
    timestamp: Date.now(),
    reason: error instanceof Error ? error.message : String(error),
    check: "unhandled-runtime-error",
  });
  process.exit(1);
}
