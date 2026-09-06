/**
 * File: scripts/verify-phone-consistency.mjs
 * Module: scripts
 * Purpose: Enforce that every phone/mobile number in the repo matches the
 *   canonical number(s) defined in src/data/contact.ts (single source of truth).
 * Notes:
 * - Parses src/data/contact.ts as text (no TS import needed) for the
 *   mobile / whatsapp / secondary fields; those values are the allowed set.
 * - Scans src/, public/, content/ (including blog posts), scripts/ and root
 *   docs for Indian mobile-number patterns and fails on anything not canonical.
 * - Retired numbers are permitted ONLY inside documented historical
 *   references: MODULE_DOC.md change-logs and this file's retired list.
 * - Run via `npm run verify:phone` (also part of `npm run seo:ci`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTACT_TS = path.join(ROOT, "src", "data", "contact.ts");

/** Normalize any number form ("+91 70335 16657", "917070604312", …) to 10 local digits. */
function toLocalDigits(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

/**
 * Retired numbers — allowed ONLY in MODULE_DOC.md change-log history and this
 * file. If one of these shows up anywhere else, it is stale content and fails.
 */
const RETIRED_NUMBERS = new Set(
  [
    "+917033516657",
    "+917970580390",
    "+918053190691",
    "+919599417591",
    "8796359334",
    "7521063034",
    "9599417591",
    "+917265255000",
    "+91 84342 89721",
    "+91 89698 71378",
  ].map(toLocalDigits)
);
const RETIRED_ALLOWED_IN = [/MODULE_DOC\.md$/];

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".astro",
  ".vercel",
  ".remember",
  ".playwright-mcp",
  "dist",
  "_ops", // generated manifests contain content hashes, not phone numbers
]);
const INCLUDE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".astro",
  ".mjs",
  ".cjs",
  ".js",
  ".json",
  ".md",
  ".mdx",
  ".txt",
  ".html",
  ".xml",
  ".yml",
  ".yaml",
]);

/**
 * Indian mobile number: optional +91 / 91 prefix (space/dash tolerated), then
 * [6-9] followed by 9 more digits, optionally split 5+5. Lookbehind/lookahead
 * guard against matching inside longer digit runs (timestamps, IDs) and inside
 * hex strings (content hashes like "a4462aa8554…").
 */
const PHONE_RE = /(?<![0-9a-fA-F])(?:\+?91[\s-]?)?([6-9]\d{4}[\s-]?\d{5})(?![0-9a-fA-F])/g;

function readCanonicalNumbers() {
  const source = fs.readFileSync(CONTACT_TS, "utf-8");
  const canonical = new Set();
  for (const field of ["mobile", "whatsapp", "secondary"]) {
    const match = source.match(new RegExp(`${field}:\\s*"?([0-9+\\s-]{10,18})"?`));
    if (!match) {
      throw new Error(`Could not find "${field}" in src/data/contact.ts`);
    }
    canonical.add(toLocalDigits(match[1]));
  }
  return canonical;
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(path.join(dir, entry.name));
    } else {
      yield path.join(dir, entry.name);
    }
  }
}

function isScannable(filePath) {
  const base = path.basename(filePath);
  if (base.startsWith(".env")) return true; // .env.example etc.
  return INCLUDE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function scanFile(filePath, canonical, violations) {
  if (RETIRED_ALLOWED_IN.some((re) => re.test(path.basename(filePath)))) return;
  if (rel(filePath) === "scripts/verify-phone-consistency.mjs") return;

  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const match of lines[i].matchAll(PHONE_RE)) {
      const local = toLocalDigits(match[1]);
      if (canonical.has(local)) continue;
      const status = RETIRED_NUMBERS.has(local) ? "RETIRED number" : "UNKNOWN number";
      violations.push({
        file: rel(filePath),
        line: i + 1,
        found: match[1],
        normalized: local,
        status,
      });
    }
  }
}

function main() {
  const canonical = readCanonicalNumbers();

  console.info("phone-verify-start", {
    timestamp: Date.now(),
    canonicalNumbers: [...canonical],
    source: "src/data/contact.ts",
  });

  const targets = [
    ...walk(path.join(ROOT, "src")),
    ...walk(path.join(ROOT, "public")),
    ...walk(path.join(ROOT, "content")),
    ...walk(path.join(ROOT, "scripts")),
    ...fs
      .readdirSync(ROOT, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => path.join(ROOT, e.name)),
  ].filter(isScannable);

  const violations = [];
  for (const filePath of targets) {
    scanFile(filePath, canonical, violations);
  }

  if (violations.length > 0) {
    for (const v of violations) {
      console.error("phone-verify-failure", { timestamp: Date.now(), ...v });
    }
    console.error("phone-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      violationCount: violations.length,
      hint: "Update src/data/contact.ts to change the number, or fix the flagged files to use the canonical number.",
    });
    process.exit(1);
  }

  console.info("phone-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    filesScanned: targets.length,
    canonicalNumbers: [...canonical],
  });
}

try {
  main();
} catch (error) {
  console.error("phone-verify-failure", {
    timestamp: Date.now(),
    reason: error instanceof Error ? error.message : String(error),
    check: "unhandled-runtime-error",
  });
  process.exit(1);
}
