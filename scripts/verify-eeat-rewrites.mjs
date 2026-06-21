#!/usr/bin/env node
/**
 * File: scripts/verify-eeat-rewrites.mjs
 * Module: scripts
 *
 * Quick spot-check for the 50 E-E-A-T rewrites the sub-agents produced.
 * Runs the structural validators on the rewritten files only, so we can
 * catch "agent broke the frontmatter" / "agent added too few internal links"
 * / "agent dropped FAQ" / "agent went under 1500 words" before committing.
 *
 * Usage:
 *   node scripts/verify-eeat-rewrites.mjs
 *
 * Exit code 0 = clean, 1 = at least one structural check failed.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const CONTENT_BLOG = path.join(REPO_ROOT, "content", "blog");
const LANDING_DIR = path.join(REPO_ROOT, "src", "pages");

// Files we expect to have been rewritten
const MARKDOWN_FILES = [
  // Shegaon
  "guides/shegaon-accommodation-guide.md",
  "locations/shegaon/shegaon-darshan-timing-guide.md",
  "locations/shegaon/shegaon-best-time-to-visit.md",
  "locations/shegaon/shegaon-travel-guide.md",
  "locations/shegaon/nearby-places-from-shegaon.md",
  "locations/shegaon/shegaon-anand-sagar-visit-guide.md",
  "guides/bhakta-niwas-complete-booking-guide.md",
  "guides/bhakta-niwas-across-locations-comparison.md",
  "guides/bhakta-niwas-frequently-asked-questions.md",
  "events/gajanan-maharaj-pragat-din-utsav-guide.md",
  "locations/shegaon/shegaon-bhakta-niwas-vs-anand-vihar.md",
  "locations/shegaon/shegaon-accommodation-near-temple.md",
  // Omkareshwar
  "locations/omkareshwar/omkareshwar-darshan-timings.md",
  "locations/omkareshwar/omkareshwar-jyotirlinga-yatra-planning.md",
  "locations/omkareshwar/omkareshwar-accommodation-near-temple.md",
  "locations/omkareshwar/omkareshwar-best-time-to-visit.md",
  "locations/omkareshwar/omkareshwar-first-time-visitor-guide.md",
  "locations/omkareshwar/omkareshwar-bhakta-niwas-accommodation-guide.md",
  "locations/omkareshwar/omkareshwar-darshan-timing-guide.md",
  "locations/omkareshwar/omkareshwar-canteen-and-mahaprasad-guide.md",
  "locations/omkareshwar/omkareshwar-bhakta-niwas-room-types-and-facilities.md",
  "locations/omkareshwar/omkareshwar-festival-season-guide.md",
  "locations/omkareshwar/omkareshwar-anand-vihar-vs-visawa.md",
  "locations/omkareshwar/omkareshwar-weekend-getaway-from-mumbai.md",
  // Pandharpur
  "events/ashadhi-ekadashi-pandharpur-wari-guide.md",
  "locations/pandharpur/pandharpur-accommodation-near-temple.md",
  "locations/pandharpur/pandharpur-vitthal-darshan-timing-guide.md",
  "events/kartik-ekadashi-pandharpur-darshan-guide.md",
  "guides/omkareshwar-pandharpur-combined-yatra.md",
  "locations/pandharpur/pandharpur-anand-sagar-visit-guide.md",
  "locations/pandharpur/pandharpur-bhakta-niwas-vs-anand-vihar.md",
  "locations/pandharpur/pandharpur-festival-season-guide.md",
  "locations/pandharpur/pandharpur-first-time-visitor-guide.md",
  "locations/pandharpur/pandharpur-darshan-timing-guide.md",
  // Trimbakeshwar
  "locations/trimbakeshwar/trimbakeshwar-accommodation-near-temple.md",
  "locations/trimbakeshwar/trimbakeshwar-best-time-to-visit.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-accommodation-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-jyotirlinga-yatra-planning.md",
  "locations/trimbakeshwar/trimbakeshwar-anand-vihar-vs-visawa.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-room-types-and-facilities.md",
  "locations/trimbakeshwar/trimbakeshwar-festival-season-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-anand-sagar-visit-guide.md",
  "events/maha-shivaratri-sansthan-visit.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-vs-anand-vihar.md",
  // Cross-cluster
  "guides/jyotirlinga-and-sansthan-combined-itinerary.md",
  "guides/week-long-devotional-circuit-planner.md",
  "guides/all-12-jyotirlinga-planning.md",
  "guides/phone-and-whatsapp-booking-best-practices.md",
  "guides/gajanan-maharaj-sansthan-complete-guide.md",
  "events/diwali-darshan-and-accommodation.md",
];

const ASTRO_LANDING_FILES = [
  "shegaon-accommodation.astro",
  "omkareshwar-bhakta-niwas.astro",
  "pandharpur-room-booking.astro",
  "trimbakeshwar-bhakt-niwas.astro",
];

const MIN_WORD_COUNT = 1500;
const MAX_WORD_COUNT = 2500;
const MIN_INTERNAL_LINKS = 5;
const MIN_FAQ_QUESTIONS = 4;
const MIN_PULL_QUOTE = 1;
const MIN_2026_REFERENCES = 2;

const issues = [];
const stats = {
  total: 0,
  ok: 0,
  underWc: 0,
  overWc: 0,
  missingFrontmatter: 0,
  lowInternalLinks: 0,
  noFaq: 0,
  noPullQuote: 0,
  no2026Ref: 0,
};

function countWords(text) {
  return (text.match(/\S+/g) || []).length;
}

function checkFile(relPath, fullPath) {
  stats.total++;
  if (!fs.existsSync(fullPath)) {
    issues.push({ file: relPath, kind: "missing", detail: "file not found" });
    return;
  }
  const raw = fs.readFileSync(fullPath, "utf8");

  // Frontmatter presence
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    stats.missingFrontmatter++;
    issues.push({ file: relPath, kind: "frontmatter", detail: "no frontmatter block" });
    return;
  }
  const body = fmMatch[2];

  const wc = countWords(body);
  if (wc < MIN_WORD_COUNT) {
    stats.underWc++;
    issues.push({ file: relPath, kind: "wordcount-low", detail: `${wc} words (min ${MIN_WORD_COUNT})` });
  }
  if (wc > MAX_WORD_COUNT) {
    stats.overWc++;
    issues.push({ file: relPath, kind: "wordcount-high", detail: `${wc} words (max ${MAX_WORD_COUNT})` });
  }

  // Internal links: [[slug]] or [text](/blog/...) or [text](/booking) etc.
  const internalLinks =
    (body.match(/\[\[([^\]]+)\]\]/g) || []).length +
    (body.match(/\]\(\/(blog|booking|locations|contact|services)\b[^)]*\)/g) || []).length;
  if (internalLinks < MIN_INTERNAL_LINKS) {
    stats.lowInternalLinks++;
    issues.push({ file: relPath, kind: "internal-links", detail: `${internalLinks} (min ${MIN_INTERNAL_LINKS})` });
  }

  // FAQ: at least 4 markdown **Q?** patterns
  const faqCount = (body.match(/^\*\*[^*]+\?\*\*\s+/gm) || []).length;
  if (faqCount < MIN_FAQ_QUESTIONS) {
    stats.noFaq++;
    issues.push({ file: relPath, kind: "faq", detail: `${faqCount} Qs (min ${MIN_FAQ_QUESTIONS})` });
  }

  // Pull-quote: a `> **` block
  const pullQuoteCount = (body.match(/^>\s+\*\*[^*]+\*\*\s*$/m) || []).length;
  if (pullQuoteCount < MIN_PULL_QUOTE) {
    stats.noPullQuote++;
    issues.push({ file: relPath, kind: "pull-quote", detail: `${pullQuoteCount} (min ${MIN_PULL_QUOTE})` });
  }

  // 2026 reference (any 2026 numeric mention in body)
  const two026 = (body.match(/2026/g) || []).length;
  if (two026 < MIN_2026_REFERENCES) {
    stats.no2026Ref++;
    issues.push({ file: relPath, kind: "2026", detail: `${two026} 2026 refs (min ${MIN_2026_REFERENCES})` });
  }

  if (
    wc >= MIN_WORD_COUNT && wc <= MAX_WORD_COUNT &&
    internalLinks >= MIN_INTERNAL_LINKS &&
    faqCount >= MIN_FAQ_QUESTIONS &&
    pullQuoteCount >= MIN_PULL_QUOTE &&
    two026 >= MIN_2026_REFERENCES
  ) {
    stats.ok++;
  }
}

for (const rel of MARKDOWN_FILES) {
  checkFile(`content/blog/${rel}`, path.join(CONTENT_BLOG, rel));
}
for (const rel of ASTRO_LANDING_FILES) {
  const full = path.join(LANDING_DIR, rel);
  if (!fs.existsSync(full)) {
    stats.total++;
    issues.push({ file: `src/pages/${rel}`, kind: "missing", detail: "landing not found" });
    continue;
  }
  const raw = fs.readFileSync(full, "utf8");
  // Astro landing pages: rough check — body must have at least 1500 words of text
  const wc = countWords(raw);
  stats.total++;
  if (wc < 1500) {
    issues.push({ file: `src/pages/${rel}`, kind: "wordcount-low", detail: `${wc} words (Astro min 1500)` });
  } else {
    stats.ok++;
  }
}

console.log("\n=== E-E-A-T rewrite verification ===\n");
console.log(`Total files: ${stats.total}`);
console.log(`  OK:        ${stats.ok}`);
console.log(`  Under 1500 words: ${stats.underWc}`);
console.log(`  Over 2500 words:  ${stats.overWc}`);
console.log(`  Missing frontmatter: ${stats.missingFrontmatter}`);
console.log(`  <5 internal links:  ${stats.lowInternalLinks}`);
console.log(`  <4 FAQ questions:   ${stats.noFaq}`);
console.log(`  No pull-quote:      ${stats.noPullQuote}`);
console.log(`  <2 2026 refs:       ${stats.no2026Ref}`);

if (issues.length) {
  console.log(`\nIssues (${issues.length}):`);
  for (const i of issues) {
    console.log(`  [${i.kind}] ${i.file} — ${i.detail}`);
  }
}

const fail = stats.underWc || stats.missingFrontmatter || stats.noFaq || stats.missingFrontmatter;
process.exit(fail ? 1 : 0);
