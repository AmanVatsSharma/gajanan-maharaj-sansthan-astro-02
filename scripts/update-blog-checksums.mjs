/**
 * Recompute generatedFileChecksums in the blog manifest after manual edits.
 * This realigns the manifest without regenerating content.
 *
 * Usage: node scripts/update-blog-checksums.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const BLOG_DIR = join(process.cwd(), "content/blog");
const MANIFEST_PATH = join(BLOG_DIR, "_ops/generated-seo-cluster-manifest.json");

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
const files = manifest.generatedFiles;

if (!Array.isArray(files) || files.length === 0) {
  console.error("No generatedFiles found in manifest.");
  process.exit(1);
}

const checksums = {};
let updated = 0;
let missing = 0;

for (const relPath of files) {
  const absPath = join(BLOG_DIR, relPath);
  try {
    const content = readFileSync(absPath, "utf-8");
    checksums[relPath] = createHash("sha256").update(content).digest("hex");
    updated++;
  } catch {
    console.warn(`  missing: ${relPath}`);
    missing++;
  }
}

manifest.generatedFileChecksums = checksums;
writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");

console.log(`Updated ${updated} checksums, ${missing} files missing.`);
console.log("Manifest rewritten to:", MANIFEST_PATH);
