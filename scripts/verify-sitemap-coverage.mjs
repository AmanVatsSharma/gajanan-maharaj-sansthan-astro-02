/**
 * File: scripts/verify-sitemap-coverage.mjs
 * Module: scripts
 * Purpose: Validate prerendered Astro sitemap against markdown and taxonomy inventory.
 * Notes:
 * - Reads dist/client/sitemap.xml after `astro build`.
 * - Set PUBLIC_SITE_URL the same as at build time (defaults to production canonical).
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
const BLOG_POSTS_PER_PAGE = 24;
/** Must match staticPaths.length in src/pages/sitemap.xml.ts */
const STATIC_ROUTE_COUNT = 16;
const LOCATION_ROUTE_COUNT = 6;

function getSitemapUrls(sitemapPath) {
  if (!fs.existsSync(sitemapPath)) {
    console.error("sitemap-verify-error", {
      timestamp: Date.now(),
      message: "Sitemap not found. Run npm run build first.",
      path: sitemapPath,
      distClient: getDistClientDir(),
    });
    process.exit(1);
  }

  const xml = fs.readFileSync(sitemapPath, "utf-8");
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;

  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  return urls;
}

function getAllSitemapUrls(indexPath) {
  const indexUrls = getSitemapUrls(indexPath);
  const sitemapIndex = indexUrls.filter((url) => url.endsWith(".xml"));

  if (sitemapIndex.length <= 1) {
    return indexUrls;
  }

  const distClient = getDistClientDir();
  const all = [];
  for (const url of sitemapIndex) {
    const filename = url.split("/").pop();
    const childPath = path.join(distClient, filename);
    if (fs.existsSync(childPath)) {
      all.push(...getSitemapUrls(childPath));
    }
  }
  return all;
}

function assertPresence(urlSet, url, failures, check) {
  if (!urlSet.has(url)) {
    failures.push({
      check,
      reason: `Missing sitemap URL: ${url}`,
    });
  }
}

function main() {
  const siteOrigin = getExpectedSiteOrigin();
  const sitemapPath = distClientFile("sitemap.xml");
  const inventory = getBlogInventory(BLOG_ROOT);
  const sitemapUrls = getAllSitemapUrls(sitemapPath);
  const urlSet = new Set(sitemapUrls);
  const failures = [];

  const blogPostCount = inventory.postSlugs.length;
  const paginatedPageCount = Math.max(0, Math.ceil(blogPostCount / BLOG_POSTS_PER_PAGE) - 1);

  const expectedUrlCount =
    STATIC_ROUTE_COUNT +
    LOCATION_ROUTE_COUNT +
    blogPostCount +
    paginatedPageCount +
    inventory.tagSlugs.length +
    inventory.categorySlugs.length;

  console.info("sitemap-verify-start", {
    timestamp: Date.now(),
    sitemapPath,
    siteOrigin,
    blogPostCount,
    tagCount: inventory.tagSlugs.length,
    categoryCount: inventory.categorySlugs.length,
    paginatedPageCount,
    expectedUrlCount,
    actualUrlCount: sitemapUrls.length,
  });

  if (sitemapUrls.length !== expectedUrlCount) {
    failures.push({
      check: "url-count",
      reason: `Expected ${expectedUrlCount} URLs but found ${sitemapUrls.length}`,
    });
  }

  for (const slug of inventory.postSlugs) {
    assertPresence(urlSet, `${siteOrigin}/blog/${slug}`, failures, "blog-post-route");
  }

  for (let page = 2; page <= paginatedPageCount + 1; page += 1) {
    assertPresence(
      urlSet,
      `${siteOrigin}/blog/page/${page}`,
      failures,
      "blog-pagination-route"
    );
  }

  for (const tagSlug of inventory.tagSlugs) {
    assertPresence(urlSet, `${siteOrigin}/blog/tag/${tagSlug}`, failures, "blog-tag-route");
  }

  for (const categorySlug of inventory.categorySlugs) {
    assertPresence(
      urlSet,
      `${siteOrigin}/blog/category/${categorySlug}`,
      failures,
      "blog-category-route"
    );
  }

  if (failures.length > 0) {
    for (const failure of failures.slice(0, 20)) {
      console.error("sitemap-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("sitemap-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("sitemap-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    checkedUrls: sitemapUrls.length,
  });
}

try {
  main();
} catch (error) {
  console.error("sitemap-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
