/**
 * File: scripts/verify-taxonomy-prerender.mjs
 * Module: scripts
 * Purpose: Ensure blog taxonomy routes are prerendered for all discovered slugs.
 * Notes:
 * - Reads markdown inventory to compute expected tag/category route slugs.
 * - Verifies corresponding prerendered HTML files exist under `.next/server/app`.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_ROOT = path.join(process.cwd(), "content/blog");
const APP_SERVER_DIR = path.join(process.cwd(), ".next/server/app");
const BLOG_POSTS_PER_PAGE = 24;

function getMarkdownFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_")) {
      continue;
    }

    const normalizedName = entry.name.toLowerCase();
    if (normalizedName === "readme.md") {
      continue;
    }

    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && normalizedName.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function toTaxonomySlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getExpectedTaxonomyInventory() {
  const markdownFiles = getMarkdownFiles(BLOG_ROOT);
  const tagSlugs = new Set();
  const categorySlugs = new Set();
  let postCount = 0;

  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    const slug = typeof data.slug === "string" ? data.slug.trim() : "";
    if (!slug) {
      continue;
    }

    postCount += 1;
    const tags = toStringArray(data.tags);
    for (const tag of tags) {
      tagSlugs.add(toTaxonomySlug(tag));
    }

    if (typeof data.category === "string" && data.category.trim()) {
      categorySlugs.add(toTaxonomySlug(data.category));
    }
  }

  return {
    postCount,
    tagSlugs: [...tagSlugs],
    categorySlugs: [...categorySlugs],
  };
}

function assertFileExists(relativePath, failures, check) {
  const absolutePath = path.join(APP_SERVER_DIR, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push({
      check,
      path: relativePath,
      reason: "Expected prerendered file does not exist.",
    });
  }
}

function main() {
  console.info("taxonomy-verify-start", {
    timestamp: Date.now(),
    blogRoot: BLOG_ROOT,
    appServerDir: APP_SERVER_DIR,
  });

  if (!fs.existsSync(APP_SERVER_DIR)) {
    console.error("taxonomy-verify-error", {
      timestamp: Date.now(),
      message: "Build output directory not found. Run `npm run build` first.",
    });
    process.exit(1);
  }

  const inventory = getExpectedTaxonomyInventory();
  const failures = [];

  assertFileExists("blog.html", failures, "blog-index-prerender");

  const expectedPaginationPages = Math.max(0, Math.ceil(inventory.postCount / BLOG_POSTS_PER_PAGE) - 1);
  for (let page = 2; page <= expectedPaginationPages + 1; page += 1) {
    assertFileExists(`blog/page/${page}.html`, failures, "blog-pagination-prerender");
  }

  for (const tagSlug of inventory.tagSlugs) {
    assertFileExists(`blog/tag/${tagSlug}.html`, failures, "blog-tag-prerender");
  }

  for (const categorySlug of inventory.categorySlugs) {
    assertFileExists(
      `blog/category/${categorySlug}.html`,
      failures,
      "blog-category-prerender"
    );
  }

  if (failures.length > 0) {
    for (const failure of failures.slice(0, 25)) {
      console.error("taxonomy-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("taxonomy-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
      postCount: inventory.postCount,
      tagCount: inventory.tagSlugs.length,
      categoryCount: inventory.categorySlugs.length,
    });
    process.exit(1);
  }

  console.info("taxonomy-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    postCount: inventory.postCount,
    tagCount: inventory.tagSlugs.length,
    categoryCount: inventory.categorySlugs.length,
    paginationPagesChecked: expectedPaginationPages,
  });
}

try {
  main();
} catch (error) {
  console.error("taxonomy-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
