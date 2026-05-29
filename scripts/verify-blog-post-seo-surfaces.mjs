/**
 * File: scripts/verify-blog-post-seo-surfaces.mjs
 * Module: scripts
 * Purpose: Validate SEO signals across all prerendered blog post pages.
 * Notes:
 * - Ensures every markdown post has a prerendered `/blog/<slug>.html` surface.
 * - Ensures canonical/meta/schema essentials stay intact for all post pages.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content/blog");
const BLOG_APP_BUILD_DIR = path.join(process.cwd(), ".next/server/app/blog");
const CANONICAL_ORIGIN = "https://www.gajananmaharajsanstan.com";
const REQUIRED_SCHEMA_TYPES = ["BlogPosting", "BreadcrumbList"];

function toTaxonomySlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getMarkdownFilePaths(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const filePaths = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_")) {
      continue;
    }

    const normalizedName = entry.name.toLowerCase();
    if (normalizedName === "readme.md") {
      continue;
    }

    const absolutePath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      filePaths.push(...getMarkdownFilePaths(absolutePath));
      continue;
    }

    if (entry.isFile() && normalizedName.endsWith(".md")) {
      filePaths.push(absolutePath);
    }
  }

  return filePaths;
}

function getFallbackSlug(filePath) {
  const relativePath = path.relative(BLOG_CONTENT_DIR, filePath);
  const noExtension = relativePath.replace(/\.md$/, "");
  const normalizedPath = noExtension.replace(/[\\/]/g, "-");
  return toTaxonomySlug(normalizedPath);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasCanonicalForSlug(html, slug) {
  const escapedSlug = escapeRegex(slug);
  const expectedPath = `${escapeRegex(CANONICAL_ORIGIN)}/blog/${escapedSlug}`;
  const regex = new RegExp(
    `<link[^>]+rel="canonical"[^>]+href="${expectedPath}\\/?"\\s*\\/?>`
  );
  return regex.test(html);
}

function hasKeywordsMeta(html) {
  return /<meta[^>]+name="keywords"[^>]+content="[^"]{10,}"/.test(html);
}

function hasOgTitle(html) {
  return /<meta[^>]+property="og:title"[^>]+content="[^"]+"/.test(html);
}

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

    if (typeof value["@type"] === "string") {
      schemaTypes.add(value["@type"]);
    }

    for (const child of Object.values(value)) {
      collectTypes(child);
    }
  }

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      collectTypes(parsed);
    } catch (error) {
      console.warn("blog-post-surfaces-verify-warning", {
        timestamp: Date.now(),
        warning: "failed-json-ld-parse",
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return schemaTypes;
}

function getPostEntries() {
  const markdownFiles = getMarkdownFilePaths(BLOG_CONTENT_DIR);
  const slugToSourcePath = new Map();
  const postEntries = [];

  for (const markdownFilePath of markdownFiles) {
    const markdownContent = fs.readFileSync(markdownFilePath, "utf-8");
    const frontmatter = matter(markdownContent).data || {};
    const sourceSlug =
      typeof frontmatter.slug === "string" && frontmatter.slug.trim().length > 0
        ? frontmatter.slug.trim()
        : getFallbackSlug(markdownFilePath);
    const slug = toTaxonomySlug(sourceSlug);

    if (slugToSourcePath.has(slug)) {
      throw new Error(
        `Duplicate slug "${slug}" found in markdown files: ${slugToSourcePath.get(
          slug
        )} and ${markdownFilePath}`
      );
    }

    slugToSourcePath.set(slug, markdownFilePath);
    postEntries.push({
      slug,
      sourcePath: markdownFilePath,
      htmlPath: path.join(BLOG_APP_BUILD_DIR, `${slug}.html`),
    });
  }

  return postEntries.sort((a, b) => a.slug.localeCompare(b.slug));
}

function main() {
  if (!fs.existsSync(BLOG_APP_BUILD_DIR)) {
    console.error("blog-post-surfaces-verify-failure", {
      timestamp: Date.now(),
      check: "build-output-exists",
      reason: `Build output directory missing at ${BLOG_APP_BUILD_DIR}. Run npm run build first.`,
    });
    process.exit(1);
  }

  const postEntries = getPostEntries();
  console.info("blog-post-surfaces-verify-start", {
    timestamp: Date.now(),
    expectedPostCount: postEntries.length,
    buildDirectory: BLOG_APP_BUILD_DIR,
  });

  const failures = [];

  for (const postEntry of postEntries) {
    if (!fs.existsSync(postEntry.htmlPath)) {
      failures.push({
        slug: postEntry.slug,
        check: "prerendered-file-exists",
        reason: "Missing prerendered blog HTML file.",
        expectedPath: postEntry.htmlPath,
        sourcePath: postEntry.sourcePath,
      });
      continue;
    }

    const html = fs.readFileSync(postEntry.htmlPath, "utf-8");
    if (!hasCanonicalForSlug(html, postEntry.slug)) {
      failures.push({
        slug: postEntry.slug,
        check: "canonical",
        reason: "Missing or invalid canonical link for blog post.",
      });
    }

    if (!hasKeywordsMeta(html)) {
      failures.push({
        slug: postEntry.slug,
        check: "keywords-meta",
        reason: "Missing keywords meta tag on blog post page.",
      });
    }

    if (!hasOgTitle(html)) {
      failures.push({
        slug: postEntry.slug,
        check: "og-title",
        reason: "Missing og:title meta tag on blog post page.",
      });
    }

    const schemaTypes = extractSchemaTypes(html);
    for (const requiredSchemaType of REQUIRED_SCHEMA_TYPES) {
      if (!schemaTypes.has(requiredSchemaType)) {
        failures.push({
          slug: postEntry.slug,
          check: "schema-type",
          reason: `Missing required schema @type "${requiredSchemaType}"`,
        });
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures.slice(0, 50)) {
      console.error("blog-post-surfaces-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("blog-post-surfaces-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      expectedPostCount: postEntries.length,
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("blog-post-surfaces-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    validatedPostCount: postEntries.length,
  });
}

try {
  main();
} catch (error) {
  console.error("blog-post-surfaces-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
