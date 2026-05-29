/**
 * File: scripts/verify-rss-feed.mjs
 * Module: scripts
 * Purpose: Validate prerendered Astro RSS feed after build.
 * Notes:
 * - Reads dist/client/feed.xml (not Next route modules).
 * - Item count matches markdown post inventory (including fallback slugs).
 */

import fs from "node:fs";
import path from "node:path";
import { getBlogInventory } from "./blog-content-inventory.mjs";
import {
  distClientFile,
  getDistClientDir,
  getExpectedSiteOrigin,
} from "./seo-verify-shared.mjs";

const BLOG_ROOT = path.join(process.cwd(), "content/blog");

function countOccurrences(text, token) {
  if (!text) return 0;
  return text.split(token).length - 1;
}

function main() {
  const siteOrigin = getExpectedSiteOrigin();
  const feedPath = distClientFile("feed.xml");

  console.info("rss-verify-start", {
    timestamp: Date.now(),
    blogRoot: BLOG_ROOT,
    feedPath,
    siteOrigin,
  });

  if (!fs.existsSync(feedPath)) {
    console.error("rss-verify-error", {
      timestamp: Date.now(),
      message: "feed.xml not found. Run npm run build first.",
      path: feedPath,
      distClient: getDistClientDir(),
    });
    process.exit(1);
  }

  const xml = fs.readFileSync(feedPath, "utf-8");
  const inventory = getBlogInventory(BLOG_ROOT);
  const expectedPostCount = inventory.postSlugs.length;
  const itemCount = countOccurrences(xml, "<item>");
  const failures = [];

  if (!xml.includes('<rss version="2.0"')) {
    failures.push("Missing RSS root element with version 2.0.");
  }

  if (!xml.includes("<channel>")) {
    failures.push("Missing channel element in RSS feed.");
  }

  const selfLink = `${siteOrigin}/feed.xml`;
  if (!xml.includes(selfLink)) {
    failures.push(`Missing self-referencing atom link to ${selfLink}`);
  }

  if (itemCount !== expectedPostCount) {
    failures.push(
      `Feed item count mismatch. Expected ${expectedPostCount} items, found ${itemCount}.`
    );
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("rss-verify-failure", {
        timestamp: Date.now(),
        reason: failure,
      });
    }

    console.error("rss-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      expectedPostCount,
      itemCount,
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("rss-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    expectedPostCount,
    itemCount,
  });
}

try {
  main();
} catch (error) {
  console.error("rss-verify-failure", {
    timestamp: Date.now(),
    reason: error instanceof Error ? error.message : String(error),
    check: "unhandled-runtime-error",
  });
  process.exit(1);
}
