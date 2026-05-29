/**
 * File: scripts/verify-manual-seed-posts.mjs
 * Module: scripts
 * Purpose: Validate non-generated manual seed blog posts used as anchor content.
 * Notes:
 * - Ensures manual seed paths stay valid while excluded from generated manifest ownership.
 * - Guards baseline editorial/SEO linking quality for historical seed content.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { MANUAL_SEED_POST_PATHS } from "./seo-cluster-config.mjs";

const BLOG_ROOT = path.join(process.cwd(), "content/blog");
const MANIFEST_PATH = path.join(BLOG_ROOT, "_ops/generated-seo-cluster-manifest.json");

function extractInternalLinks(content) {
  const links = [];
  const regex = /\[[^\]]+\]\((\/[^)]+)\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function normalizeEntry(entry) {
  return String(entry || "").trim().replace(/\\/g, "/");
}

function main() {
  console.info("manual-seed-verify-start", {
    timestamp: Date.now(),
    blogRoot: BLOG_ROOT,
    manualSeedCount: MANUAL_SEED_POST_PATHS.length,
  });

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("manual-seed-verify-failure", {
      timestamp: Date.now(),
      check: "manifest-exists",
      reason: "Generated manifest is missing. Run npm run generate:blogs first.",
    });
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const generatedEntries = new Set(
    (Array.isArray(manifest?.generatedFiles) ? manifest.generatedFiles : []).map((entry) =>
      normalizeEntry(entry)
    )
  );

  const failures = [];
  let validatedSeedCount = 0;

  for (const seedRelativePath of MANUAL_SEED_POST_PATHS) {
    const normalizedSeedPath = normalizeEntry(seedRelativePath);
    const absolutePath = path.join(BLOG_ROOT, normalizedSeedPath);

    if (!fs.existsSync(absolutePath)) {
      failures.push({
        check: "seed-file-exists",
        reason: `Manual seed file does not exist: ${normalizedSeedPath}`,
      });
      continue;
    }

    if (generatedEntries.has(normalizedSeedPath)) {
      failures.push({
        check: "seed-not-generated",
        reason: `Manual seed file is unexpectedly tracked in generated manifest: ${normalizedSeedPath}`,
      });
    }

    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const { data, content } = matter(fileContent);
    const slug = typeof data.slug === "string" ? data.slug.trim() : "";
    const category = typeof data.category === "string" ? data.category.trim() : "";
    const expectedSlug = path.basename(normalizedSeedPath, ".md");
    const internalLinks = extractInternalLinks(content);

    if (!slug || slug !== expectedSlug) {
      failures.push({
        check: "seed-slug-match",
        reason: `Manual seed "${normalizedSeedPath}" slug "${slug}" does not match expected "${expectedSlug}".`,
      });
    }

    if (!category) {
      failures.push({
        check: "seed-category",
        reason: `Manual seed "${normalizedSeedPath}" is missing category.`,
      });
    }

    if (internalLinks.length < 3) {
      failures.push({
        check: "seed-internal-link-count",
        reason: `Manual seed "${normalizedSeedPath}" has only ${internalLinks.length} internal links.`,
      });
    }

    const hasLocationLink = internalLinks.some((link) => link.startsWith("/locations/"));
    const hasIntentLink = internalLinks.some(
      (link) => link.startsWith("/booking") || link.startsWith("/contact")
    );
    const hasBlogLink = internalLinks.some((link) => link.startsWith("/blog/"));
    if (!hasLocationLink || !hasIntentLink || !hasBlogLink) {
      failures.push({
        check: "seed-internal-link-intent",
        reason: `Manual seed "${normalizedSeedPath}" must include /locations, /booking|/contact, and /blog links.`,
      });
    }

    validatedSeedCount += 1;
  }

  if (failures.length > 0) {
    for (const failure of failures.slice(0, 20)) {
      console.error("manual-seed-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("manual-seed-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("manual-seed-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    validatedSeedCount,
  });
}

try {
  main();
} catch (error) {
  console.error("manual-seed-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
