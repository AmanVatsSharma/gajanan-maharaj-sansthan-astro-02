/**
 * Stagger clustered blog post publication dates.
 *
 * Any date with 3+ posts is split: the first post keeps the original date,
 * subsequent posts are pushed forward one day at a time, cascading so
 * no date ends up with more than 2 posts.
 *
 * Usage: node scripts/stagger-dates.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const BLOG_DIR = new URL("../content/blog", import.meta.url).pathname;
const MAX_PER_DAY = 2;

function walkMd(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith("_")) continue; // skip _templates and similar
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkMd(full));
    } else if (entry.endsWith(".md") && entry !== "README.md") {
      files.push(full);
    }
  }
  return files;
}

function getDate(content) {
  const m = content.match(/^date:\s*"(\d{4}-\d{2}-\d{2})"/m);
  return m ? m[1] : null;
}

function setDate(content, newDate) {
  return content.replace(/^(date:\s*)"(\d{4}-\d{2}-\d{2})"/m, `$1"${newDate}"`);
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Load all posts with their current dates
const allFiles = walkMd(BLOG_DIR);
const posts = allFiles
  .map((file) => {
    const content = readFileSync(file, "utf8");
    const date = getDate(content);
    return date ? { file, content, date, newDate: date } : null;
  })
  .filter(Boolean);

// Sort stable: date ASC, then filename ASC
posts.sort((a, b) => a.date.localeCompare(b.date) || a.file.localeCompare(b.file));

// Walk through sorted posts and spread any date that exceeds MAX_PER_DAY.
// dateSlots tracks how many posts we've assigned to each date so far.
const dateSlots = new Map();

function slotsFor(d) {
  return dateSlots.get(d) || 0;
}

for (const post of posts) {
  let candidate = post.date;
  // If this candidate date is already at max capacity, push forward
  while (slotsFor(candidate) >= MAX_PER_DAY) {
    candidate = addDays(candidate, 1);
  }
  post.newDate = candidate;
  dateSlots.set(candidate, slotsFor(candidate) + 1);
}

// Report and apply changes
let changed = 0;
let skipped = 0;

for (const post of posts) {
  if (post.date !== post.newDate) {
    const rel = post.file.split("/content/blog/")[1];
    console.log(`  ${post.date} → ${post.newDate}  ${rel}`);
    if (!DRY_RUN) {
      writeFileSync(post.file, setDate(post.content, post.newDate), "utf8");
    }
    changed++;
  } else {
    skipped++;
  }
}

console.log(`\n${DRY_RUN ? "[dry-run] " : ""}${changed} files updated, ${skipped} files unchanged.`);

// Verify: no date exceeds MAX_PER_DAY
const finalSlots = new Map();
for (const post of posts) {
  finalSlots.set(post.newDate, (finalSlots.get(post.newDate) || 0) + 1);
}
const overloaded = [...finalSlots.entries()].filter(([, count]) => count > MAX_PER_DAY);
if (overloaded.length > 0) {
  console.error(`\nWARNING: ${overloaded.length} dates still exceed ${MAX_PER_DAY} posts:`);
  overloaded.forEach(([d, c]) => console.error(`  ${d}: ${c} posts`));
} else {
  console.log(`Verification passed: no date has more than ${MAX_PER_DAY} posts.`);
}
