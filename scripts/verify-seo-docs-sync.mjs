/**
 * File: scripts/verify-seo-docs-sync.mjs
 * Module: scripts
 * Purpose: Ensure key SEO/docs inventory claims match the live content state.
 * Notes:
 * - Guards against stale post-count numbers in rollout docs.
 * - Verifies critical command references remain documented.
 */

import fs from "node:fs";
import path from "node:path";

const BLOG_ROOT = path.join(process.cwd(), "content/blog");
const MANIFEST_PATH = path.join(BLOG_ROOT, "_ops/generated-seo-cluster-manifest.json");

const DOC_PATHS = {
  rootReadme: path.join(process.cwd(), "README.md"),
  quickstart: path.join(process.cwd(), "SEO_QUICKSTART.md"),
  blogReadme: path.join(BLOG_ROOT, "README.md"),
  setupGuide: path.join(process.cwd(), "docs/SEO_SETUP_GUIDE.md"),
  mediaInventory: path.join(process.cwd(), "docs/SEO_MEDIA_ASSET_INVENTORY.md"),
  postDeployChecklist: path.join(process.cwd(), "docs/SEO_POST_DEPLOY_SMOKE_CHECKLIST.md"),
  canonicalHostGuide: path.join(
    process.cwd(),
    "docs/SEO_CANONICAL_HOST_DEPLOYMENT_GUIDE.md"
  ),
  rolloutReport: path.join(process.cwd(), "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md"),
  technicalSummary: path.join(process.cwd(), "docs/SEO_TECHNICAL_IMPLEMENTATION.md"),
  completionSummary: path.join(process.cwd(), "SEO_IMPLEMENTATION_COMPLETE.md"),
  featureBlogModuleDoc: path.join(process.cwd(), "src/features/blog/MODULE_DOC.md"),
  libBlogModuleDoc: path.join(process.cwd(), "src/lib/blog/MODULE_DOC.md"),
  scriptsModuleDoc: path.join(process.cwd(), "scripts/MODULE_DOC.md"),
  seoLibModuleDoc: path.join(process.cwd(), "src/lib/seo/MODULE_DOC.md"),
  ciWorkflow: path.join(process.cwd(), ".github/workflows/seo-quality-gate.yml"),
};

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

function readGeneratedCountFromManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found at ${MANIFEST_PATH}`);
  }

  const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  if (!Array.isArray(parsed?.generatedFiles)) {
    throw new Error("Manifest missing generatedFiles[] array.");
  }

  return parsed.generatedFiles.length;
}

function assertIncludes(content, snippet, failures, context) {
  if (!content.includes(snippet)) {
    failures.push({
      check: "doc-snippet",
      context,
      reason: `Missing required snippet: "${snippet}"`,
    });
  }
}

function main() {
  const publishablePostCount = getMarkdownFiles(BLOG_ROOT).length;
  const generatedPostCount = readGeneratedCountFromManifest();
  const failures = [];

  console.info("seo-docs-sync-verify-start", {
    timestamp: Date.now(),
    publishablePostCount,
    generatedPostCount,
  });

  const rootReadme = fs.readFileSync(DOC_PATHS.rootReadme, "utf-8");
  const quickstart = fs.readFileSync(DOC_PATHS.quickstart, "utf-8");
  const blogReadme = fs.readFileSync(DOC_PATHS.blogReadme, "utf-8");
  const setupGuide = fs.readFileSync(DOC_PATHS.setupGuide, "utf-8");
  const mediaInventory = fs.readFileSync(DOC_PATHS.mediaInventory, "utf-8");
  const postDeployChecklist = fs.readFileSync(DOC_PATHS.postDeployChecklist, "utf-8");
  const canonicalHostGuide = fs.readFileSync(DOC_PATHS.canonicalHostGuide, "utf-8");
  const rolloutReport = fs.readFileSync(DOC_PATHS.rolloutReport, "utf-8");
  const technicalSummary = fs.readFileSync(DOC_PATHS.technicalSummary, "utf-8");
  const completionSummary = fs.readFileSync(DOC_PATHS.completionSummary, "utf-8");
  const featureBlogModuleDoc = fs.readFileSync(DOC_PATHS.featureBlogModuleDoc, "utf-8");
  const libBlogModuleDoc = fs.readFileSync(DOC_PATHS.libBlogModuleDoc, "utf-8");
  const scriptsModuleDoc = fs.readFileSync(DOC_PATHS.scriptsModuleDoc, "utf-8");
  const seoLibModuleDoc = fs.readFileSync(DOC_PATHS.seoLibModuleDoc, "utf-8");
  const ciWorkflow = fs.readFileSync(DOC_PATHS.ciWorkflow, "utf-8");

  assertIncludes(
    rootReadme,
    ".env.example",
    failures,
    "README.md:env-template-reference"
  );
  assertIncludes(
    rootReadme,
    "SEO_ENABLE_APP_HOST_REDIRECTS=false",
    failures,
    "README.md:host-redirect-env-reference"
  );
  assertIncludes(
    rootReadme,
    "SEO_VERIFY_LIVE_REDIRECTS=true npm run verify:live-redirects",
    failures,
    "README.md:verify-live-redirects-command"
  );

  assertIncludes(
    quickstart,
    "SEO_ENABLE_APP_HOST_REDIRECTS=false",
    failures,
    "SEO_QUICKSTART.md:host-redirect-env-reference"
  );
  assertIncludes(
    quickstart,
    "SEO_VERIFY_LIVE_REDIRECTS=true npm run verify:live-redirects",
    failures,
    "SEO_QUICKSTART.md:verify-live-redirects-command"
  );

  assertIncludes(
    blogReadme,
    `Total publishable posts: **${publishablePostCount}**`,
    failures,
    "content/blog/README.md:post-count"
  );
  assertIncludes(
    blogReadme,
    "npm run verify:generator",
    failures,
    "content/blog/README.md:verify-generator-command"
  );
  assertIncludes(
    blogReadme,
    "npm run verify:manual-seeds",
    failures,
    "content/blog/README.md:verify-manual-seeds-command"
  );
  assertIncludes(
    blogReadme,
    "npm run verify:generator:determinism",
    failures,
    "content/blog/README.md:verify-generator-determinism-command"
  );
  assertIncludes(
    blogReadme,
    "npm run verify:seo-chain",
    failures,
    "content/blog/README.md:verify-seo-chain-command"
  );
  assertIncludes(
    blogReadme,
    "npm run verify:ci-gate",
    failures,
    "content/blog/README.md:verify-ci-gate-command"
  );
  assertIncludes(
    blogReadme,
    "npm run verify:blog-surfaces",
    failures,
    "content/blog/README.md:verify-blog-surfaces-command"
  );
  assertIncludes(
    blogReadme,
    "npm run verify:docs-sync",
    failures,
    "content/blog/README.md:verify-docs-sync-command"
  );
  assertIncludes(
    blogReadme,
    "manifestVersion",
    failures,
    "content/blog/README.md:manifest-version-reference"
  );
  assertIncludes(
    blogReadme,
    "manual seed anchors",
    failures,
    "content/blog/README.md:manual-seed-reference"
  );

  assertIncludes(
    setupGuide,
    "npm run verify:generator",
    failures,
    "docs/SEO_SETUP_GUIDE.md:verify-generator-command"
  );
  assertIncludes(
    setupGuide,
    "npm run verify:manual-seeds",
    failures,
    "docs/SEO_SETUP_GUIDE.md:verify-manual-seeds-command"
  );
  assertIncludes(
    setupGuide,
    "npm run verify:generator:determinism",
    failures,
    "docs/SEO_SETUP_GUIDE.md:verify-generator-determinism-command"
  );
  assertIncludes(
    setupGuide,
    "npm run verify:seo-chain",
    failures,
    "docs/SEO_SETUP_GUIDE.md:verify-seo-chain-command"
  );
  assertIncludes(
    setupGuide,
    "npm run verify:ci-gate",
    failures,
    "docs/SEO_SETUP_GUIDE.md:verify-ci-gate-command"
  );
  assertIncludes(
    setupGuide,
    "npm run verify:blog-surfaces",
    failures,
    "docs/SEO_SETUP_GUIDE.md:verify-blog-surfaces-command"
  );
  assertIncludes(
    setupGuide,
    "SEO_ENABLE_APP_HOST_REDIRECTS=false",
    failures,
    "docs/SEO_SETUP_GUIDE.md:host-redirect-env-reference"
  );
  assertIncludes(
    setupGuide,
    "npm run verify:live-redirects",
    failures,
    "docs/SEO_SETUP_GUIDE.md:verify-live-redirects-command"
  );
  assertIncludes(
    setupGuide,
    "npm run verify:docs-sync",
    failures,
    "docs/SEO_SETUP_GUIDE.md:verify-docs-sync-command"
  );
  assertIncludes(
    setupGuide,
    "manual seed anchors",
    failures,
    "docs/SEO_SETUP_GUIDE.md:manual-seed-reference"
  );
  assertIncludes(
    setupGuide,
    "npm run seo:check:strict",
    failures,
    "docs/SEO_SETUP_GUIDE.md:strict-gate-command"
  );

  assertIncludes(
    mediaInventory,
    "/gallery/hero-image-2026-02-05.svg",
    failures,
    "docs/SEO_MEDIA_ASSET_INVENTORY.md:hero-asset-reference"
  );
  assertIncludes(
    mediaInventory,
    "/logo/logo.svg",
    failures,
    "docs/SEO_MEDIA_ASSET_INVENTORY.md:logo-asset-reference"
  );
  assertIncludes(
    mediaInventory,
    "npm run seo:check",
    failures,
    "docs/SEO_MEDIA_ASSET_INVENTORY.md:seo-check-command"
  );

  assertIncludes(
    postDeployChecklist,
    "SEO_VERIFY_LIVE_REDIRECTS=true",
    failures,
    "docs/SEO_POST_DEPLOY_SMOKE_CHECKLIST.md:live-redirect-env"
  );
  assertIncludes(
    postDeployChecklist,
    "npm run verify:live-redirects",
    failures,
    "docs/SEO_POST_DEPLOY_SMOKE_CHECKLIST.md:live-redirect-command"
  );
  assertIncludes(
    postDeployChecklist,
    "/robots.txt",
    failures,
    "docs/SEO_POST_DEPLOY_SMOKE_CHECKLIST.md:robots-surface-reference"
  );
  assertIncludes(
    postDeployChecklist,
    "/sitemap.xml",
    failures,
    "docs/SEO_POST_DEPLOY_SMOKE_CHECKLIST.md:sitemap-surface-reference"
  );

  assertIncludes(
    canonicalHostGuide,
    "NEXT_PUBLIC_SITE_URL=https://www.gajananmaharajsanstan.com",
    failures,
    "docs/SEO_CANONICAL_HOST_DEPLOYMENT_GUIDE.md:canonical-origin-reference"
  );
  assertIncludes(
    canonicalHostGuide,
    "SEO_ENABLE_APP_HOST_REDIRECTS=false",
    failures,
    "docs/SEO_CANONICAL_HOST_DEPLOYMENT_GUIDE.md:host-redirect-flag-reference"
  );
  assertIncludes(
    canonicalHostGuide,
    "npm run verify:live-redirects",
    failures,
    "docs/SEO_CANONICAL_HOST_DEPLOYMENT_GUIDE.md:live-redirect-command"
  );
  assertIncludes(
    canonicalHostGuide,
    "www",
    failures,
    "docs/SEO_CANONICAL_HOST_DEPLOYMENT_GUIDE.md:www-reference"
  );

  assertIncludes(
    rolloutReport,
    `Publishable markdown blogs: **${publishablePostCount}**`,
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:publishable-count"
  );
  assertIncludes(
    rolloutReport,
    `Generated new blog posts: **${generatedPostCount}**`,
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:generated-count"
  );
  assertIncludes(
    rolloutReport,
    "npm run verify:generator",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:verify-generator-command"
  );
  assertIncludes(
    rolloutReport,
    "npm run verify:manual-seeds",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:verify-manual-seeds-command"
  );
  assertIncludes(
    rolloutReport,
    "npm run verify:generator:determinism",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:verify-generator-determinism-command"
  );
  assertIncludes(
    rolloutReport,
    "npm run verify:seo-chain",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:verify-seo-chain-command"
  );
  assertIncludes(
    rolloutReport,
    "npm run verify:ci-gate",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:verify-ci-gate-command"
  );
  assertIncludes(
    rolloutReport,
    "npm run verify:blog-surfaces",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:verify-blog-surfaces-command"
  );
  assertIncludes(
    rolloutReport,
    "npm run verify:docs-sync",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:verify-docs-sync-command"
  );
  assertIncludes(
    rolloutReport,
    "npm run verify:live-redirects",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:verify-live-redirects-command"
  );
  assertIncludes(
    rolloutReport,
    "managed namespace ownership checks",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:manual-seed-reference"
  );
  assertIncludes(
    rolloutReport,
    "manifestVersion: 2",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:manifest-version-reference"
  );
  assertIncludes(
    rolloutReport,
    "npm run seo:check:strict",
    failures,
    "docs/SEO_ROLLOUT_VERIFICATION_REPORT.md:strict-gate-command"
  );

  assertIncludes(
    technicalSummary,
    `Blog inventory expanded to ${publishablePostCount} posts (${generatedPostCount} generated cluster posts + existing seed posts)`,
    failures,
    "docs/SEO_TECHNICAL_IMPLEMENTATION.md:inventory-counts"
  );
  assertIncludes(
    technicalSummary,
    "SEO_ENABLE_APP_HOST_REDIRECTS=false",
    failures,
    "docs/SEO_TECHNICAL_IMPLEMENTATION.md:host-redirect-env-reference"
  );
  assertIncludes(
    technicalSummary,
    "SEO_VERIFY_LIVE_REDIRECTS=true npm run verify:live-redirects",
    failures,
    "docs/SEO_TECHNICAL_IMPLEMENTATION.md:verify-live-redirects-command"
  );

  assertIncludes(
    completionSummary,
    `added ${generatedPostCount} new markdown blogs (${publishablePostCount} total live posts)`,
    failures,
    "SEO_IMPLEMENTATION_COMPLETE.md:inventory-counts"
  );
  assertIncludes(
    completionSummary,
    "npm run verify:generator",
    failures,
    "SEO_IMPLEMENTATION_COMPLETE.md:verify-generator-command"
  );
  assertIncludes(
    completionSummary,
    "npm run verify:live-redirects",
    failures,
    "SEO_IMPLEMENTATION_COMPLETE.md:verify-live-redirects-command"
  );
  assertIncludes(
    featureBlogModuleDoc,
    `${publishablePostCount} posts (${generatedPostCount} generated + existing)`,
    failures,
    "src/features/blog/MODULE_DOC.md:inventory-counts"
  );
  assertIncludes(
    scriptsModuleDoc,
    "verify:generator",
    failures,
    "scripts/MODULE_DOC.md:verify-generator-reference"
  );
  assertIncludes(
    scriptsModuleDoc,
    "verify:manual-seeds",
    failures,
    "scripts/MODULE_DOC.md:verify-manual-seeds-reference"
  );
  assertIncludes(
    scriptsModuleDoc,
    "verify:generator:determinism",
    failures,
    "scripts/MODULE_DOC.md:verify-generator-determinism-reference"
  );
  assertIncludes(
    scriptsModuleDoc,
    "verify:seo-chain",
    failures,
    "scripts/MODULE_DOC.md:verify-seo-chain-reference"
  );
  assertIncludes(
    scriptsModuleDoc,
    "verify:ci-gate",
    failures,
    "scripts/MODULE_DOC.md:verify-ci-gate-reference"
  );
  assertIncludes(
    scriptsModuleDoc,
    "verify:blog-surfaces",
    failures,
    "scripts/MODULE_DOC.md:verify-blog-surfaces-reference"
  );
  assertIncludes(
    scriptsModuleDoc,
    "verify:docs-sync",
    failures,
    "scripts/MODULE_DOC.md:verify-docs-sync-reference"
  );
  assertIncludes(
    scriptsModuleDoc,
    "seo:check:strict",
    failures,
    "scripts/MODULE_DOC.md:strict-gate-reference"
  );
  assertIncludes(
    ciWorkflow,
    "npm run seo:check:strict",
    failures,
    ".github/workflows/seo-quality-gate.yml:strict-gate-run-command"
  );

  for (const [docKey, content] of [
    ["src/features/blog/MODULE_DOC.md", featureBlogModuleDoc],
    ["src/lib/blog/MODULE_DOC.md", libBlogModuleDoc],
    ["scripts/MODULE_DOC.md", scriptsModuleDoc],
    ["src/lib/seo/MODULE_DOC.md", seoLibModuleDoc],
  ]) {
    assertIncludes(content, "```mermaid", failures, `${docKey}:mermaid-flowchart`);
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("seo-docs-sync-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("seo-docs-sync-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("seo-docs-sync-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    publishablePostCount,
    generatedPostCount,
    checkedDocs: Object.keys(DOC_PATHS).length,
  });
}

try {
  main();
} catch (error) {
  console.error("seo-docs-sync-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
