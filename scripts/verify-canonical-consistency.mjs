/**
 * File: scripts/verify-canonical-consistency.mjs
 * Module: scripts
 * Purpose: Verify canonical-link consistency across prerendered HTML pages.
 * Notes:
 * - Scans all generated .html files in `.next/server/app`.
 * - For SEO pages (identified via keywords meta), requires a valid canonical tag.
 * - Ensures canonical host matches production canonical origin.
 */

import fs from "node:fs";
import path from "node:path";

const APP_SERVER_DIR = path.join(process.cwd(), "dist/client");
const CANONICAL_ORIGIN = "https://www.srigajananmaharajsanstan.com";

function getHtmlFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractCanonicalHrefValues(html) {
  const hrefValues = [];
  const regex = /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    hrefValues.push(match[1]);
  }

  return hrefValues;
}

function hasKeywordsMeta(html) {
  return /<meta[^>]+name="keywords"[^>]+content="[^"]{2,}"/.test(html);
}

function isValidCanonicalHref(href) {
  if (!href) {
    return false;
  }

  if (href === "/") {
    return true;
  }

  return href.startsWith(`${CANONICAL_ORIGIN}/`) || href === CANONICAL_ORIGIN;
}

function main() {
  console.info("canonical-verify-start", {
    timestamp: Date.now(),
    appServerDir: APP_SERVER_DIR,
    canonicalOrigin: CANONICAL_ORIGIN,
  });

  if (!fs.existsSync(APP_SERVER_DIR)) {
    console.error("canonical-verify-error", {
      timestamp: Date.now(),
      message: "Build output directory not found. Run `npm run build` first.",
      path: APP_SERVER_DIR,
    });
    process.exit(1);
  }

  const htmlFiles = getHtmlFiles(APP_SERVER_DIR);
  const failures = [];
  let seoPageCount = 0;

  for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(htmlFile, "utf-8");
    const isSeoPage = hasKeywordsMeta(html);

    if (!isSeoPage) {
      continue;
    }

    seoPageCount += 1;
    const canonicalHrefValues = extractCanonicalHrefValues(html);

    if (canonicalHrefValues.length === 0) {
      failures.push({
        file: path.relative(APP_SERVER_DIR, htmlFile),
        check: "canonical-presence",
        reason: "Missing canonical tag on SEO page.",
      });
      continue;
    }

    if (canonicalHrefValues.length > 1) {
      failures.push({
        file: path.relative(APP_SERVER_DIR, htmlFile),
        check: "canonical-singleton",
        reason: `Expected one canonical tag but found ${canonicalHrefValues.length}.`,
      });
      continue;
    }

    const canonicalHref = canonicalHrefValues[0];
    if (!isValidCanonicalHref(canonicalHref)) {
      failures.push({
        file: path.relative(APP_SERVER_DIR, htmlFile),
        check: "canonical-origin",
        reason: `Canonical href "${canonicalHref}" is outside canonical origin.`,
      });
    }
  }

  if (failures.length > 0) {
    for (const failure of failures.slice(0, 25)) {
      console.error("canonical-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("canonical-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      seoPageCount,
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("canonical-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    seoPageCount,
  });
}

try {
  main();
} catch (error) {
  console.error("canonical-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
