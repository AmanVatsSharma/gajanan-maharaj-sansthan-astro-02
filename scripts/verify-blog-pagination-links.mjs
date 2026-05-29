/**
 * File: scripts/verify-blog-pagination-links.mjs
 * Module: scripts
 * Purpose: Verify crawl-friendly pagination links across blog archive pages.
 * Notes:
 * - Ensures `/blog` links to `/blog/page/2` when paginated pages exist.
 * - Ensures each `/blog/page/<n>` includes previous/next navigation links.
 */

import fs from "node:fs";
import path from "node:path";

const APP_SERVER_DIR = path.join(process.cwd(), ".next/server/app");
const BLOG_INDEX_HTML_PATH = path.join(APP_SERVER_DIR, "blog.html");
const BLOG_PAGE_DIR = path.join(APP_SERVER_DIR, "blog/page");

function getPaginatedPageNumbers() {
  if (!fs.existsSync(BLOG_PAGE_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(BLOG_PAGE_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => Number.parseInt(entry.name.replace(/\.html$/, ""), 10))
    .filter((page) => Number.isInteger(page) && page >= 2)
    .sort((a, b) => a - b);
}

function hasHref(html, href) {
  return html.includes(`href="${href}"`);
}

function main() {
  console.info("blog-pagination-verify-start", {
    timestamp: Date.now(),
    appServerDir: APP_SERVER_DIR,
  });

  if (!fs.existsSync(APP_SERVER_DIR)) {
    console.error("blog-pagination-verify-error", {
      timestamp: Date.now(),
      message: "Build output directory not found. Run `npm run build` first.",
    });
    process.exit(1);
  }

  if (!fs.existsSync(BLOG_INDEX_HTML_PATH)) {
    console.error("blog-pagination-verify-error", {
      timestamp: Date.now(),
      message: "Missing prerendered /blog HTML file.",
      path: path.relative(APP_SERVER_DIR, BLOG_INDEX_HTML_PATH),
    });
    process.exit(1);
  }

  const failures = [];
  const pageNumbers = getPaginatedPageNumbers();

  if (pageNumbers.length === 0) {
    console.info("blog-pagination-verify-summary", {
      timestamp: Date.now(),
      status: "passed",
      paginatedPageCount: 0,
      message: "No paginated blog pages detected; pagination link checks skipped.",
    });
    return;
  }

  const blogIndexHtml = fs.readFileSync(BLOG_INDEX_HTML_PATH, "utf-8");
  if (!hasHref(blogIndexHtml, "/blog/page/2")) {
    failures.push({
      path: "blog.html",
      check: "index-to-page-2-link",
      reason: 'Expected /blog to include link href="/blog/page/2".',
    });
  }

  const maxPage = pageNumbers[pageNumbers.length - 1];

  for (const page of pageNumbers) {
    const pagePath = path.join(BLOG_PAGE_DIR, `${page}.html`);
    const html = fs.readFileSync(pagePath, "utf-8");
    const relativePath = `blog/page/${page}.html`;

    const previousHref = page === 2 ? "/blog" : `/blog/page/${page - 1}`;
    if (!hasHref(html, previousHref)) {
      failures.push({
        path: relativePath,
        check: "previous-link",
        reason: `Missing previous-page link href="${previousHref}".`,
      });
    }

    if (page < maxPage) {
      const nextHref = `/blog/page/${page + 1}`;
      if (!hasHref(html, nextHref)) {
        failures.push({
          path: relativePath,
          check: "next-link",
          reason: `Missing next-page link href="${nextHref}".`,
        });
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("blog-pagination-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("blog-pagination-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      paginatedPageCount: pageNumbers.length,
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("blog-pagination-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    paginatedPageCount: pageNumbers.length,
    maxPage,
  });
}

try {
  main();
} catch (error) {
  console.error("blog-pagination-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
