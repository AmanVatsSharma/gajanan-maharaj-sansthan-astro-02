/**
 * File: scripts/verify-generated-cluster-manifest.mjs
 * Module: scripts
 * Purpose: Verify deterministic blog-cluster manifest distribution and integrity.
 * Notes:
 * - Ensures generated clusters match expected location/non-location targets.
 * - Fails with actionable diagnostics when generator output drifts.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import {
  CLUSTER_CONFIG_FINGERPRINT,
  EXPECTED_GENERATED_TOTAL,
  LOCATION_CLUSTER_KEYS,
  LOCATION_CLUSTER_TARGETS,
  MANUAL_SEED_POST_PATHS,
  NON_LOCATION_CLUSTER_TARGETS,
} from "./seo-cluster-config.mjs";

const BLOG_ROOT = path.join(process.cwd(), "content/blog");
const MANIFEST_PATH = path.join(BLOG_ROOT, "_ops/generated-seo-cluster-manifest.json");
const GENERATED_SLUG_SEGMENT_PATTERN = "[a-z0-9]+(?:-[a-z0-9]+)*";

function normalizeManifestEntry(entry) {
  return typeof entry === "string" ? entry.trim().replace(/\\/g, "/") : "";
}

function getChecksum(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function getExpectedCategory(entry) {
  if (entry.startsWith("locations/")) return "locations";
  if (entry.startsWith("guides/")) return "guides";
  if (entry.startsWith("spiritual/")) return "spiritual";
  if (entry.startsWith("events/")) return "events";
  return "";
}

function escapeRegexToken(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

function main() {
  console.info("generator-manifest-verify-start", {
    timestamp: Date.now(),
    manifestPath: MANIFEST_PATH,
    expectedConfigFingerprint: CLUSTER_CONFIG_FINGERPRINT,
  });

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("generator-manifest-verify-failure", {
      timestamp: Date.now(),
      check: "manifest-exists",
      reason: "Missing generated cluster manifest. Run npm run generate:blogs first.",
    });
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  } catch (error) {
    console.error("generator-manifest-verify-failure", {
      timestamp: Date.now(),
      check: "manifest-parse",
      reason: `Unable to parse manifest JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
    process.exit(1);
  }

  const entriesRaw = Array.isArray(parsed?.generatedFiles) ? parsed.generatedFiles : [];
  const entries = [...new Set(entriesRaw.map((entry) => normalizeManifestEntry(entry)).filter(Boolean))];
  const failures = [];
  const normalizedEntriesRaw = entriesRaw
    .map((entry) => normalizeManifestEntry(entry))
    .filter(Boolean);
  const sortedEntries = [...entries].sort();
  if (JSON.stringify(entries) !== JSON.stringify(sortedEntries)) {
    failures.push({
      check: "manifest-generated-files-sorted",
      reason: "Manifest generatedFiles[] entries must be lexicographically sorted for deterministic diffs.",
    });
  }
  if (normalizedEntriesRaw.length !== entriesRaw.length) {
    failures.push({
      check: "manifest-generated-files-normalized",
      reason: "Manifest generatedFiles[] contains empty or non-normalized path entries.",
    });
  }
  const manifestVersion =
    typeof parsed?.manifestVersion === "number" ? parsed.manifestVersion : null;
  const manifestFingerprint =
    typeof parsed?.configFingerprint === "string" ? parsed.configFingerprint : null;
  const manifestChecksums =
    parsed?.generatedFileChecksums &&
    typeof parsed.generatedFileChecksums === "object" &&
    !Array.isArray(parsed.generatedFileChecksums)
      ? parsed.generatedFileChecksums
      : null;

  if (manifestVersion !== 2) {
    failures.push({
      check: "manifest-version",
      reason: `Manifest version "${manifestVersion ?? "missing"}" does not match expected "2". Run npm run generate:blogs.`,
    });
  }
  if (Object.prototype.hasOwnProperty.call(parsed, "timestamp")) {
    failures.push({
      check: "manifest-volatile-timestamp",
      reason: 'Manifest should not contain volatile "timestamp". Regenerate with deterministic manifest format.',
    });
  }
  if (manifestFingerprint !== CLUSTER_CONFIG_FINGERPRINT) {
    failures.push({
      check: "manifest-config-fingerprint",
      reason: `Manifest config fingerprint "${manifestFingerprint || "missing"}" does not match expected "${CLUSTER_CONFIG_FINGERPRINT}". Run npm run generate:blogs.`,
    });
  }
  if (!manifestChecksums) {
    failures.push({
      check: "manifest-checksum-map",
      reason: "Manifest is missing generatedFileChecksums map. Run npm run generate:blogs.",
    });
  }
  if (manifestChecksums) {
    const checksumKeys = Object.keys(manifestChecksums)
      .map((entry) => normalizeManifestEntry(entry))
      .filter(Boolean);
    const checksumKeySet = new Set(checksumKeys);
    const entrySet = new Set(entries);

    if (checksumKeySet.size !== checksumKeys.length) {
      failures.push({
        check: "manifest-checksum-duplicate-keys",
        reason: "Manifest checksum map contains duplicate/normalized-colliding keys.",
      });
    }

    const missingChecksumEntries = entries.filter((entry) => !checksumKeySet.has(entry));
    if (missingChecksumEntries.length > 0) {
      failures.push({
        check: "manifest-checksum-missing-entries",
        reason: `Manifest checksum map is missing generated entries: ${missingChecksumEntries
          .slice(0, 5)
          .join(", ")}`,
      });
    }

    const extraChecksumEntries = checksumKeys.filter((entry) => !entrySet.has(entry));
    if (extraChecksumEntries.length > 0) {
      failures.push({
        check: "manifest-checksum-extra-entries",
        reason: `Manifest checksum map has unexpected entries: ${extraChecksumEntries
          .slice(0, 5)
          .join(", ")}`,
      });
    }
  }

  if (entries.length !== EXPECTED_GENERATED_TOTAL) {
    failures.push({
      check: "generated-total",
      reason: `Manifest entries count ${entries.length} does not match expected ${EXPECTED_GENERATED_TOTAL}.`,
    });
  }

  const manifestCount =
    typeof parsed?.generatedFileCount === "number" ? parsed.generatedFileCount : null;
  if (manifestCount !== null && manifestCount !== entries.length) {
    failures.push({
      check: "manifest-count-match",
      reason: `manifest generatedFileCount ${manifestCount} does not equal entries length ${entries.length}.`,
    });
  }

  const distribution = {
    locations: Object.fromEntries(LOCATION_CLUSTER_KEYS.map((key) => [key, 0])),
    guides: 0,
    spiritual: 0,
    events: 0,
  };
  let frontmatterCheckCount = 0;
  let checksumValidatedCount = 0;
  const allowedNamespacePattern = new RegExp(
    `^(locations\\/(?:${LOCATION_CLUSTER_KEYS.map((key) => escapeRegexToken(key)).join("|")})\\/${GENERATED_SLUG_SEGMENT_PATTERN}\\.md|guides\\/${GENERATED_SLUG_SEGMENT_PATTERN}\\.md|spiritual\\/${GENERATED_SLUG_SEGMENT_PATTERN}\\.md|events\\/${GENERATED_SLUG_SEGMENT_PATTERN}\\.md)$`
  );
  const manualSeedPathSet = new Set(MANUAL_SEED_POST_PATHS.map((entry) => normalizeManifestEntry(entry)));

  const managedNamespaceFiles = getMarkdownFiles(BLOG_ROOT)
    .map((absolutePath) => normalizeManifestEntry(path.relative(BLOG_ROOT, absolutePath)))
    .filter((relativePath) => allowedNamespacePattern.test(relativePath));
  const unmanagedNamespaceFiles = managedNamespaceFiles.filter(
    (relativePath) => !entries.includes(relativePath) && !manualSeedPathSet.has(relativePath)
  );
  if (unmanagedNamespaceFiles.length > 0) {
    failures.push({
      check: "managed-namespace-untracked-files",
      reason: `Managed namespace has untracked markdown files outside manifest/manual seed list: ${unmanagedNamespaceFiles
        .slice(0, 5)
        .join(", ")}`,
    });
  }

  const missingManualSeeds = [...manualSeedPathSet].filter(
    (relativePath) => !fs.existsSync(path.join(BLOG_ROOT, relativePath))
  );
  if (missingManualSeeds.length > 0) {
    failures.push({
      check: "manual-seed-post-exists",
      reason: `Expected manual seed posts are missing: ${missingManualSeeds
        .slice(0, 5)
        .join(", ")}`,
    });
  }

  for (const entry of entries) {
    if (!allowedNamespacePattern.test(entry)) {
      failures.push({
        check: "generated-entry-path-policy",
        reason: `Generated manifest entry violates path policy: ${entry}`,
      });
      continue;
    }

    const absolutePath = path.join(BLOG_ROOT, entry);
    if (!fs.existsSync(absolutePath)) {
      failures.push({
        check: "manifest-file-exists",
        reason: `Manifest entry missing on disk: ${entry}`,
      });
      continue;
    }

    const expectedCategory = getExpectedCategory(entry);
    const expectedSlug = path.basename(entry, ".md");
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const currentChecksum = getChecksum(fileContent);
    const expectedChecksum =
      manifestChecksums && typeof manifestChecksums[entry] === "string"
        ? manifestChecksums[entry]
        : null;
    const { data } = matter(fileContent);
    const slug = typeof data.slug === "string" ? data.slug.trim() : "";
    const category = typeof data.category === "string" ? data.category.trim() : "";
    const relatedSlugs = toStringArray(data.relatedSlugs);
    const locationIds = toStringArray(data.locationIds);
    const keywords = toStringArray(data.keywords).map((keyword) => keyword.toLowerCase());
    const hasSansthanFragment = keywords.some(
      (keyword) => keyword.includes("sansthan") || keyword.includes("sanstan")
    );

    if (!slug || slug !== expectedSlug) {
      failures.push({
        check: "generated-frontmatter-slug",
        reason: `Generated entry ${entry} has slug "${slug}" but expected "${expectedSlug}".`,
      });
    }

    if (!category || category !== expectedCategory) {
      failures.push({
        check: "generated-frontmatter-category",
        reason: `Generated entry ${entry} has category "${category}" but expected "${expectedCategory}".`,
      });
    }

    if (relatedSlugs.length < 3) {
      failures.push({
        check: "generated-related-slugs-minimum",
        reason: `Generated entry ${entry} has only ${relatedSlugs.length} relatedSlugs; minimum expected is 3.`,
      });
    }

    if (!hasSansthanFragment) {
      failures.push({
        check: "generated-keyword-brand-fragment",
        reason: `Generated entry ${entry} is missing sansthan/sanstan keyword fragments.`,
      });
    }
    if (!expectedChecksum) {
      failures.push({
        check: "generated-file-checksum-missing",
        reason: `Manifest checksum is missing for generated entry: ${entry}`,
      });
    } else if (!/^[a-f0-9]{64}$/i.test(expectedChecksum)) {
      failures.push({
        check: "generated-file-checksum-format",
        reason: `Manifest checksum for ${entry} is not a valid SHA-256 hex digest.`,
      });
    } else if (expectedChecksum !== currentChecksum) {
      failures.push({
        check: "generated-file-checksum-mismatch",
        reason: `Checksum mismatch for generated entry ${entry}. Regenerate cluster to realign deterministic output.`,
      });
    } else {
      checksumValidatedCount += 1;
    }

    if (expectedCategory === "locations") {
      const locationKey = entry.split("/")[1];
      if (slug && !slug.startsWith(`${locationKey}-`)) {
        failures.push({
          check: "generated-location-slug-prefix",
          reason: `Location entry ${entry} slug "${slug}" does not start with "${locationKey}-".`,
        });
      }

      if (locationIds.length === 0) {
        failures.push({
          check: "generated-location-ids",
          reason: `Location entry ${entry} is missing locationIds.`,
        });
      }
    }

    frontmatterCheckCount += 1;

    if (entry.startsWith("locations/")) {
      for (const key of LOCATION_CLUSTER_KEYS) {
        if (entry.startsWith(`locations/${key}/`)) {
          distribution.locations[key] += 1;
        }
      }
      continue;
    }

    if (entry.startsWith("guides/")) {
      distribution.guides += 1;
      continue;
    }

    if (entry.startsWith("spiritual/")) {
      distribution.spiritual += 1;
      continue;
    }

    if (entry.startsWith("events/")) {
      distribution.events += 1;
      continue;
    }

    failures.push({
      check: "manifest-namespace",
      reason: `Unexpected manifest namespace for entry: ${entry}`,
    });
  }

  for (const [locationKey, expected] of Object.entries(LOCATION_CLUSTER_TARGETS)) {
    if (distribution.locations[locationKey] !== expected) {
      failures.push({
        check: "location-cluster-target",
        reason: `Location cluster "${locationKey}" count ${distribution.locations[locationKey]} does not match expected ${expected}.`,
      });
    }
  }

  for (const [key, expected] of Object.entries(NON_LOCATION_CLUSTER_TARGETS)) {
    if (distribution[key] !== expected) {
      failures.push({
        check: "non-location-cluster-target",
        reason: `Cluster "${key}" count ${distribution[key]} does not match expected ${expected}.`,
      });
    }
  }

  if (failures.length > 0) {
    for (const failure of failures.slice(0, 20)) {
      console.error("generator-manifest-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }
    console.error("generator-manifest-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("generator-manifest-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    expectedTotal: EXPECTED_GENERATED_TOTAL,
    configFingerprint: CLUSTER_CONFIG_FINGERPRINT,
    manifestVersion,
    frontmatterCheckCount,
    checksumValidatedCount,
    observedDistribution: distribution,
  });
}

try {
  main();
} catch (error) {
  console.error("generator-manifest-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
