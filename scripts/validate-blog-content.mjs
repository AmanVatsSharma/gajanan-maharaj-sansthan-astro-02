/**
 * File: scripts/validate-blog-content.mjs
 * Module: scripts
 * Purpose: Validate SEO markdown blog quality before deployment.
 * Notes:
 * - Fast-fails on critical issues (duplicate slugs, invalid frontmatter, missing internal linking).
 * - Emits detailed console diagnostics for easier debugging and editorial fixes.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import {
  CLUSTER_CONFIG_FINGERPRINT,
  LOCATION_CLUSTER_KEYS,
  LOCATION_CLUSTER_TARGETS,
  MANUAL_SEED_POST_PATHS,
} from "./seo-cluster-config.mjs";

const BLOG_ROOT = path.join(process.cwd(), "content/blog");
const GENERATED_MANIFEST_PATH = path.join(
  BLOG_ROOT,
  "_ops/generated-seo-cluster-manifest.json"
);
const MIN_REQUIRED_POSTS = 100;
const STRICT_WARNINGS_MODE =
  process.env.BLOG_VALIDATE_STRICT_WARNINGS === "true" ||
  process.argv.includes("--strict-warnings");
const SEO_GUARDRAIL_REPORT_MODE =
  process.env.BLOG_VALIDATE_SEO_GUARDRAIL_REPORT === "true" ||
  process.argv.includes("--seo-guardrail-report");
const MIN_WORD_COUNT = 1500;
const KNOWN_LOCATION_IDS = new Set([
  "shegaon-bhakt-niwas",
  "shegaon-anand-vihar",
  "shegaon-visawa",
  "pandharpur-math",
  "trimbakeshwar",
  "omkareshwar",
]);
const VALID_CATEGORIES = new Set(["locations", "guides", "spiritual", "events"]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUIRED_LOCATION_COVERAGE = [...LOCATION_CLUSTER_KEYS];
const LOCATION_CLUSTER_MINIMUMS = LOCATION_CLUSTER_TARGETS;
const REQUIRED_BRAND_VARIANT_FRAGMENTS = [
  "shri gajanan",
  "shree gajanan",
  "sri gajanan",
  "sansthan",
  "sanstan",
];
const MAX_ALLOWED_ORPHAN_POSTS = 0;
const EXEMPT_ORPHAN_SLUGS = new Set(["welcome-to-sansthan"]);
const MIN_GENERATED_OUTBOUND_BLOG_LINKS = 5;
const GENERATED_SLUG_SEGMENT_PATTERN = "[a-z0-9]+(?:-[a-z0-9]+)*";

/**
 * Crawl markdown files recursively.
 * Ignores underscore-prefixed folders/files and README docs.
 */
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

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function isSafeBlogChildPath(candidatePath) {
  const resolvedRoot = path.resolve(BLOG_ROOT);
  const resolvedPath = path.resolve(candidatePath);
  return resolvedPath === resolvedRoot || resolvedPath.startsWith(`${resolvedRoot}${path.sep}`);
}

function normalizeManifestEntry(entry) {
  if (typeof entry !== "string") {
    return "";
  }

  return entry.trim().replace(/\\/g, "/");
}

function escapeRegexToken(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getChecksum(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Validate generated cluster manifest integrity.
 * This ensures generator-managed posts stay deterministic and traceable.
 */
function validateGeneratedManifest(failures) {
  const manifestState = {
    isAvailable: false,
    generatedRelativePaths: new Set(),
  };

  if (!fs.existsSync(GENERATED_MANIFEST_PATH)) {
    console.warn("blog-validation-warning", {
      timestamp: Date.now(),
      file: path.relative(BLOG_ROOT, GENERATED_MANIFEST_PATH),
      slug: "generated-seo-cluster-manifest",
      warnings: [
        "Generated cluster manifest not found. Run npm run generate:blogs to re-create deterministic manifest.",
      ],
    });
    return manifestState;
  }

  let parsedManifest;
  try {
    parsedManifest = JSON.parse(fs.readFileSync(GENERATED_MANIFEST_PATH, "utf-8"));
  } catch (error) {
    failures.push({
      routeId: "generated-manifest",
      filePath: path.relative(BLOG_ROOT, GENERATED_MANIFEST_PATH),
      check: "manifest-json-parse",
      reason: `Unable to parse generator manifest JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
    return manifestState;
  }

  const manifestFilePath = path.relative(BLOG_ROOT, GENERATED_MANIFEST_PATH);
  const generatedFilesRaw = Array.isArray(parsedManifest?.generatedFiles)
    ? parsedManifest.generatedFiles
    : null;
  const hasVolatileTimestamp = Object.prototype.hasOwnProperty.call(
    parsedManifest,
    "timestamp"
  );
  const manifestVersion =
    typeof parsedManifest?.manifestVersion === "number"
      ? parsedManifest.manifestVersion
      : null;
  const manifestConfigFingerprint =
    typeof parsedManifest?.configFingerprint === "string"
      ? parsedManifest.configFingerprint
      : null;
  const generatedFileChecksums =
    parsedManifest?.generatedFileChecksums &&
    typeof parsedManifest.generatedFileChecksums === "object" &&
    !Array.isArray(parsedManifest.generatedFileChecksums)
      ? parsedManifest.generatedFileChecksums
      : null;

  if (!generatedFilesRaw) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-generated-files-array",
      reason: "Manifest is missing generatedFiles[] array.",
    });
    return manifestState;
  }

  if (manifestConfigFingerprint !== CLUSTER_CONFIG_FINGERPRINT) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-config-fingerprint",
      reason: `Manifest config fingerprint "${
        manifestConfigFingerprint || "missing"
      }" does not match expected "${CLUSTER_CONFIG_FINGERPRINT}". Run npm run generate:blogs.`,
    });
  }
  if (manifestVersion !== 2) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-version",
      reason: `Manifest version "${manifestVersion ?? "missing"}" does not match expected "2". Run npm run generate:blogs.`,
    });
  }
  if (!generatedFileChecksums) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-checksum-map",
      reason: "Manifest is missing generatedFileChecksums map. Run npm run generate:blogs.",
    });
  }
  if (hasVolatileTimestamp) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-volatile-timestamp",
      reason: 'Manifest should not contain volatile "timestamp". Run npm run generate:blogs to re-create deterministic manifest.',
    });
  }

  const normalizedEntries = generatedFilesRaw.map((entry) => normalizeManifestEntry(entry));
  const invalidEntries = normalizedEntries.filter(
    (entry) => !entry || entry.startsWith("../") || entry.includes("/../")
  );
  if (invalidEntries.length > 0) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-entry-safety",
      reason: `Manifest contains unsafe generated file entries: ${invalidEntries
        .slice(0, 5)
        .join(", ")}`,
    });
  }

  const uniqueEntries = [...new Set(normalizedEntries)];
  const sortedUniqueEntries = [...uniqueEntries].sort();
  if (JSON.stringify(uniqueEntries) !== JSON.stringify(sortedUniqueEntries)) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-generated-files-sorted",
      reason: "generatedFiles[] should be lexicographically sorted for deterministic diffs.",
    });
  }

  const allowedGeneratedPathPattern = new RegExp(
    `^(locations\\/(?:${LOCATION_CLUSTER_KEYS.map((key) => escapeRegexToken(key)).join("|")})\\/${GENERATED_SLUG_SEGMENT_PATTERN}\\.md|guides\\/${GENERATED_SLUG_SEGMENT_PATTERN}\\.md|spiritual\\/${GENERATED_SLUG_SEGMENT_PATTERN}\\.md|events\\/${GENERATED_SLUG_SEGMENT_PATTERN}\\.md)$`
  );
  const invalidPathEntries = uniqueEntries.filter(
    (entry) => !allowedGeneratedPathPattern.test(entry)
  );
  if (invalidPathEntries.length > 0) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-generated-path-policy",
      reason: `generatedFiles[] contains invalid managed paths: ${invalidPathEntries
        .slice(0, 5)
        .join(", ")}`,
    });
  }
  const manualSeedPathSet = new Set(
    MANUAL_SEED_POST_PATHS.map((entry) => normalizeManifestEntry(entry))
  );
  const managedNamespaceFiles = getMarkdownFiles(BLOG_ROOT)
    .map((absolutePath) => normalizeManifestEntry(path.relative(BLOG_ROOT, absolutePath)))
    .filter((relativePath) => allowedGeneratedPathPattern.test(relativePath));
  const unmanagedNamespaceFiles = managedNamespaceFiles.filter(
    (relativePath) => !uniqueEntries.includes(relativePath) && !manualSeedPathSet.has(relativePath)
  );
  if (unmanagedNamespaceFiles.length > 0) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
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
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manual-seed-post-exists",
      reason: `Expected manual seed posts are missing: ${missingManualSeeds
        .slice(0, 5)
        .join(", ")}`,
    });
  }
  manifestState.isAvailable = true;
  manifestState.generatedRelativePaths = new Set(uniqueEntries);
  if (uniqueEntries.length !== normalizedEntries.length) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-duplicate-entries",
      reason: "Manifest generatedFiles[] contains duplicate entries.",
    });
  }

  const expectedCountFromManifest =
    typeof parsedManifest?.generatedFileCount === "number"
      ? parsedManifest.generatedFileCount
      : null;
  if (
    expectedCountFromManifest !== null &&
    expectedCountFromManifest !== uniqueEntries.length
  ) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-count-match",
      reason: `Manifest generatedFileCount (${expectedCountFromManifest}) does not match generatedFiles[] length (${uniqueEntries.length}).`,
    });
  }
  if (generatedFileChecksums && Object.keys(generatedFileChecksums).length !== uniqueEntries.length) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-checksum-count",
      reason: `generatedFileChecksums count (${Object.keys(generatedFileChecksums).length}) does not match generated files count (${uniqueEntries.length}).`,
    });
  }
  if (generatedFileChecksums) {
    const checksumKeys = Object.keys(generatedFileChecksums)
      .map((entry) => normalizeManifestEntry(entry))
      .filter(Boolean);
    const checksumKeySet = new Set(checksumKeys);
    const uniqueEntrySet = new Set(uniqueEntries);

    const missingChecksumEntries = uniqueEntries.filter((entry) => !checksumKeySet.has(entry));
    if (missingChecksumEntries.length > 0) {
      failures.push({
        routeId: "generated-manifest",
        filePath: manifestFilePath,
        check: "manifest-checksum-missing-entries",
        reason: `generatedFileChecksums is missing generated entries: ${missingChecksumEntries
          .slice(0, 5)
          .join(", ")}`,
      });
    }

    const extraChecksumEntries = checksumKeys.filter((entry) => !uniqueEntrySet.has(entry));
    if (extraChecksumEntries.length > 0) {
      failures.push({
        routeId: "generated-manifest",
        filePath: manifestFilePath,
        check: "manifest-checksum-extra-entries",
        reason: `generatedFileChecksums contains unexpected entries: ${extraChecksumEntries
          .slice(0, 5)
          .join(", ")}`,
      });
    }
  }

  const missingFiles = [];
  let checksumValidatedCount = 0;
  for (const relativeEntry of uniqueEntries) {
    const absolutePath = path.join(BLOG_ROOT, relativeEntry);
    if (!isSafeBlogChildPath(absolutePath)) {
      failures.push({
        routeId: "generated-manifest",
        filePath: manifestFilePath,
        check: "manifest-entry-safe-root",
        reason: `Manifest entry resolves outside content/blog: ${relativeEntry}`,
      });
      continue;
    }

    if (!relativeEntry.toLowerCase().endsWith(".md")) {
      failures.push({
        routeId: "generated-manifest",
        filePath: manifestFilePath,
        check: "manifest-entry-markdown",
        reason: `Manifest entry is not a markdown file: ${relativeEntry}`,
      });
      continue;
    }

    if (!fs.existsSync(absolutePath)) {
      missingFiles.push(relativeEntry);
      continue;
    }

    if (generatedFileChecksums) {
      const expectedChecksum =
        typeof generatedFileChecksums[relativeEntry] === "string"
          ? generatedFileChecksums[relativeEntry]
          : null;

      if (!expectedChecksum) {
        failures.push({
          routeId: "generated-manifest",
          filePath: manifestFilePath,
          check: "manifest-checksum-missing-entry",
          reason: `generatedFileChecksums is missing checksum for generated file: ${relativeEntry}`,
        });
      } else if (!/^[a-f0-9]{64}$/i.test(expectedChecksum)) {
        failures.push({
          routeId: "generated-manifest",
          filePath: manifestFilePath,
          check: "manifest-checksum-format",
          reason: `generatedFileChecksums entry for ${relativeEntry} is not a valid SHA-256 digest.`,
        });
      } else {
        const currentChecksum = getChecksum(fs.readFileSync(absolutePath, "utf-8"));
        if (expectedChecksum !== currentChecksum) {
          failures.push({
            routeId: "generated-manifest",
            filePath: manifestFilePath,
            check: "manifest-checksum-mismatch",
            reason: `generatedFileChecksums mismatch for ${relativeEntry}. Run npm run generate:blogs to realign deterministic content.`,
          });
        } else {
          checksumValidatedCount += 1;
        }
      }
    }
  }

  if (missingFiles.length > 0) {
    failures.push({
      routeId: "generated-manifest",
      filePath: manifestFilePath,
      check: "manifest-file-exists",
      reason: `Manifest references missing generated markdown files: ${missingFiles
        .slice(0, 5)
        .join(", ")}`,
    });
  }

  console.info("blog-validation-generator-manifest", {
    timestamp: Date.now(),
    manifestPath: manifestFilePath,
    manifestVersion,
    configFingerprint: manifestConfigFingerprint,
    expectedConfigFingerprint: CLUSTER_CONFIG_FINGERPRINT,
    generatedFileCount: uniqueEntries.length,
    checksumCount: generatedFileChecksums ? Object.keys(generatedFileChecksums).length : 0,
    checksumValidatedCount,
    missingFileCount: missingFiles.length,
  });

  return manifestState;
}

/**
 * Extract markdown internal links like `/blog/...`, `/locations/...`.
 */
function extractInternalLinks(content) {
  const links = [];
  const regex = /\[[^\]]+\]\((\/[^)]+)\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function stripMarkdownForWordCount(content) {
  return content
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~#>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWordCount(content) {
  const normalized = stripMarkdownForWordCount(content);
  if (!normalized) {
    return 0;
  }

  return normalized.split(/\s+/).length;
}

function collectSeoGuardrailData(result) {
  const dateValue = result.date || "";
  const parsedDateMs = Date.parse(dateValue);
  const isFutureDate =
    Number.isFinite(parsedDateMs) && parsedDateMs > Date.now();

  return {
    slug: result.slug || result.relativeFilePath,
    file: result.relativeFilePath,
    date: dateValue,
    dateMs: Number.isFinite(parsedDateMs) ? parsedDateMs : null,
    isFutureDate,
    wordCount: result.wordCount,
    threshold: MIN_WORD_COUNT,
  };
}

function printSeoGuardrailReport(results) {
  if (!SEO_GUARDRAIL_REPORT_MODE) {
    return;
  }

  const seoRows = results.map(collectSeoGuardrailData);
  const futureDateRows = seoRows
    .filter((row) => row.isFutureDate)
    .sort((a, b) => (b.dateMs || 0) - (a.dateMs || 0));
  const thinContentRows = seoRows
    .filter((row) => row.wordCount < MIN_WORD_COUNT)
    .sort((a, b) => a.wordCount - b.wordCount);

  console.info("blog-validation-seo-guardrail-report", {
    timestamp: Date.now(),
    futureDateViolations: futureDateRows.length,
    thinContentViolations: thinContentRows.length,
    minWordCount: MIN_WORD_COUNT,
    futureDatePosts: futureDateRows.map((row) => ({
      slug: row.slug,
      file: row.file,
      date: row.date,
    })),
    thinContentPosts: thinContentRows.map((row) => ({
      slug: row.slug,
      file: row.file,
      wordCount: row.wordCount,
      threshold: row.threshold,
    })),
  });
}

function validatePost(filePath, slugRegistry) {
  const relativeFilePath = path.relative(BLOG_ROOT, filePath);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const errors = [];
  const warnings = [];

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const slug = typeof data.slug === "string" ? data.slug.trim() : "";
  const date = typeof data.date === "string" ? data.date.trim() : "";
  const category = typeof data.category === "string" ? data.category.trim() : "";
  const keywords = toArray(data.keywords);
  const tags = toArray(data.tags);
  const locationIds = toArray(data.locationIds);
  const relatedSlugs = toArray(data.relatedSlugs);
  const internalLinks = extractInternalLinks(content);
  const wordCount = getWordCount(content);

  if (!title) errors.push("Missing frontmatter.title");
  if (!description) errors.push("Missing frontmatter.description");
  if (!slug) errors.push("Missing frontmatter.slug");
  if (!date) errors.push("Missing frontmatter.date");
  if (!category) errors.push("Missing frontmatter.category");

  if (slug && !SLUG_PATTERN.test(slug)) {
    errors.push(`Invalid slug format "${slug}" (use lowercase kebab-case only)`);
  }

  if (slug) {
    const existing = slugRegistry.get(slug);
    if (existing) {
      errors.push(`Duplicate slug "${slug}" also used in ${existing}`);
    } else {
      slugRegistry.set(slug, relativeFilePath);
    }
  }

  if (date && Number.isNaN(Date.parse(date))) {
    errors.push(`Invalid date format "${date}"`);
  }
  if (!Number.isNaN(Date.parse(date)) && Date.parse(date) > Date.now()) {
    warnings.push(`date is in the future (${date}); verify publish date`);
  }

  if (keywords.length < 3) {
    warnings.push("keywords should include at least 3 phrases");
  }

  if (tags.length < 2) {
    warnings.push("tags should include at least 2 entries");
  }

  if (category && !VALID_CATEGORIES.has(category)) {
    warnings.push(`category "${category}" not in recommended set`);
  }

  if (locationIds.length === 0) {
    warnings.push("locationIds missing (recommended for location-intent SEO)");
  }

  for (const locationId of locationIds) {
    if (!KNOWN_LOCATION_IDS.has(locationId)) {
      errors.push(`Unknown locationId "${locationId}"`);
    }
  }

  if (relatedSlugs.length < 2) {
    warnings.push("relatedSlugs should include at least 2 internal post slugs");
  }

  if (content.trim().length < 900) {
    warnings.push("content appears thin (<900 chars). Consider richer details.");
  }
  if (wordCount < MIN_WORD_COUNT) {
    warnings.push(
      `word count below ${MIN_WORD_COUNT} words (${wordCount}); expand article depth`
    );
  }

  if (internalLinks.length < 3) {
    errors.push("At least 3 internal links are required");
  }

  const hasLocationLink = internalLinks.some((link) => link.startsWith("/locations/"));
  const hasIntentLink = internalLinks.some(
    (link) => link.startsWith("/booking") || link.startsWith("/contact")
  );
  const hasBlogLink = internalLinks.some((link) => link.startsWith("/blog/"));

  if (!hasLocationLink) {
    errors.push("Missing required link to a /locations/* page");
  }

  if (!hasIntentLink) {
    errors.push("Missing required booking/contact intent link");
  }

  if (!hasBlogLink) {
    errors.push("Missing required internal link to another /blog/* post");
  }

  return {
    relativeFilePath,
    slug,
    category,
    keywords,
    locationIds,
    relatedSlugs,
    internalLinks,
    date,
    wordCount,
    errors,
    warnings,
  };
}

function printResultSummary(results) {
  const totalPosts = results.length;
  const totalWarnings = results.reduce((sum, item) => sum + item.warnings.length, 0);
  const totalErrors = results.reduce((sum, item) => sum + item.errors.length, 0);

  const categoryCounts = results.reduce((acc, item) => {
    const key = item.category || "uncategorized";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  console.info("blog-validation-summary", {
    timestamp: Date.now(),
    totalPosts,
    totalWarnings,
    totalErrors,
    categoryCounts,
  });
}

function detectLocationClusterCoverage(results) {
  const coverage = {
    shegaon: 0,
    omkareshwar: 0,
    pandharpur: 0,
    trimbakeshwar: 0,
  };

  for (const result of results) {
    for (const locationId of result.locationIds || []) {
      if (locationId.includes("shegaon")) coverage.shegaon += 1;
      if (locationId.includes("omkareshwar")) coverage.omkareshwar += 1;
      if (locationId.includes("pandharpur")) coverage.pandharpur += 1;
      if (locationId.includes("trimbakeshwar")) coverage.trimbakeshwar += 1;
    }
  }

  return coverage;
}

/**
 * Count how many posts are explicitly owned by each location cluster.
 * Ownership heuristic uses slug prefixes so legacy location files are included too.
 */
function detectLocationClusterDistribution(results) {
  const distribution = {
    shegaon: 0,
    omkareshwar: 0,
    pandharpur: 0,
    trimbakeshwar: 0,
  };

  for (const result of results) {
    const normalizedSlug = (result.slug || "").toLowerCase();
    for (const locationKey of Object.keys(distribution)) {
      if (normalizedSlug.startsWith(`${locationKey}-`)) {
        distribution[locationKey] += 1;
      }
    }
  }

  return distribution;
}

/**
 * Ensure core brand variants remain present somewhere in blog metadata corpus.
 */
function detectBrandVariantCoverage(results) {
  const coverage = Object.fromEntries(
    REQUIRED_BRAND_VARIANT_FRAGMENTS.map((fragment) => [fragment, 0])
  );

  for (const result of results) {
    for (const keyword of result.keywords || []) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      for (const fragment of REQUIRED_BRAND_VARIANT_FRAGMENTS) {
        if (normalizedKeyword.includes(fragment)) {
          coverage[fragment] += 1;
        }
      }
    }
  }

  return coverage;
}

function runCrossPostChecks(results, failures, warnings, manifestState) {
  const knownSlugs = new Set(results.map((result) => result.slug).filter(Boolean));
  const knownLocationPaths = new Set(
    [...KNOWN_LOCATION_IDS].map((locationId) => `/locations/${locationId}`)
  );
  const inboundBlogLinkCount = new Map(
    [...knownSlugs].map((slug) => [slug, 0])
  );

  for (const result of results) {
    const outboundBlogTargets = new Set();

    for (const relatedSlug of result.relatedSlugs || []) {
      if (!knownSlugs.has(relatedSlug)) {
        failures.push({
          routeId: result.slug || result.relativeFilePath,
          filePath: result.relativeFilePath,
          check: "related-slug-exists",
          reason: `relatedSlug "${relatedSlug}" does not exist in content/blog`,
        });
      }
    }

    for (const internalLink of result.internalLinks || []) {
      if (internalLink.startsWith("/blog/")) {
        const blogSlug = internalLink.replace(/^\/blog\//, "").split("/")[0];
        if (!blogSlug) {
          continue;
        }

        // Ignore non-post blog route namespaces.
        const isNamespaceLink = ["tag", "category", "page"].some(
          (namespace) => blogSlug === namespace
        );
        if (!isNamespaceLink && !knownSlugs.has(blogSlug)) {
          failures.push({
            routeId: result.slug || result.relativeFilePath,
            filePath: result.relativeFilePath,
            check: "blog-link-target-exists",
            reason: `Internal blog link "${internalLink}" points to unknown slug "${blogSlug}"`,
          });
        }

        if (
          !isNamespaceLink &&
          knownSlugs.has(blogSlug) &&
          result.slug &&
          blogSlug !== result.slug
        ) {
          outboundBlogTargets.add(blogSlug);
          inboundBlogLinkCount.set(
            blogSlug,
            (inboundBlogLinkCount.get(blogSlug) || 0) + 1
          );
        }
      }

      if (internalLink.startsWith("/locations/")) {
        const locationPath = internalLink.split(/[?#]/)[0];
        if (!knownLocationPaths.has(locationPath)) {
          failures.push({
            routeId: result.slug || result.relativeFilePath,
            filePath: result.relativeFilePath,
            check: "location-link-target-exists",
            reason: `Internal location link "${internalLink}" points to unknown location path`,
          });
        }
      }
    }

    if (manifestState?.isAvailable) {
      const normalizedFilePath = result.relativeFilePath.replace(/\\/g, "/");
      const isGeneratedPost = manifestState.generatedRelativePaths.has(normalizedFilePath);
      if (isGeneratedPost && outboundBlogTargets.size < MIN_GENERATED_OUTBOUND_BLOG_LINKS) {
        failures.push({
          routeId: result.slug || result.relativeFilePath,
          filePath: result.relativeFilePath,
          check: "generated-outbound-blog-links",
          reason: `Generated post has only ${outboundBlogTargets.size} outbound blog links; minimum required is ${MIN_GENERATED_OUTBOUND_BLOG_LINKS}.`,
        });
      }
    }
  }

  if (results.length < MIN_REQUIRED_POSTS) {
    failures.push({
      routeId: "blog-inventory",
      filePath: "content/blog",
      check: "minimum-post-count",
      reason: `Publishable markdown post count (${results.length}) is below minimum required (${MIN_REQUIRED_POSTS})`,
    });
  }

  const locationCoverage = detectLocationClusterCoverage(results);
  for (const locationKey of REQUIRED_LOCATION_COVERAGE) {
    if (locationCoverage[locationKey] === 0) {
      failures.push({
        routeId: `location-coverage-${locationKey}`,
        filePath: "content/blog/locations",
        check: "location-cluster-coverage",
        reason: `No location-intent posts detected for ${locationKey}`,
      });
    }
  }

  const locationDistribution = detectLocationClusterDistribution(results);
  console.info("blog-validation-location-distribution", {
    timestamp: Date.now(),
    minimums: LOCATION_CLUSTER_MINIMUMS,
    observed: locationDistribution,
  });

  for (const [locationKey, minimumCount] of Object.entries(LOCATION_CLUSTER_MINIMUMS)) {
    if ((locationDistribution[locationKey] || 0) < minimumCount) {
      failures.push({
        routeId: `location-minimum-${locationKey}`,
        filePath: "content/blog/locations",
        check: "location-cluster-minimum",
        reason: `Location cluster "${locationKey}" has ${locationDistribution[locationKey] || 0} posts, below minimum ${minimumCount}`,
      });
    }
  }

  const brandVariantCoverage = detectBrandVariantCoverage(results);
  console.info("blog-validation-brand-coverage", {
    timestamp: Date.now(),
    requiredFragments: REQUIRED_BRAND_VARIANT_FRAGMENTS,
    observed: brandVariantCoverage,
  });

  for (const [fragment, hitCount] of Object.entries(brandVariantCoverage)) {
    if (hitCount === 0) {
      failures.push({
        routeId: `brand-coverage-${fragment}`,
        filePath: "content/blog",
        check: "brand-variant-coverage",
        reason: `No keyword metadata includes required fragment "${fragment}"`,
      });
    }
  }

  const orphanPostSlugs = results
    .filter((result) => result.slug)
    .filter((result) => !EXEMPT_ORPHAN_SLUGS.has(result.slug))
    .filter((result) => (inboundBlogLinkCount.get(result.slug) || 0) === 0)
    .map((result) => result.slug);

  console.info("blog-validation-link-graph", {
    timestamp: Date.now(),
    totalPosts: knownSlugs.size,
    orphanPostCount: orphanPostSlugs.length,
    exemptOrphanSlugs: [...EXEMPT_ORPHAN_SLUGS],
    maxAllowedOrphanPosts: MAX_ALLOWED_ORPHAN_POSTS,
    minGeneratedOutboundBlogLinks: MIN_GENERATED_OUTBOUND_BLOG_LINKS,
  });

  if (orphanPostSlugs.length > MAX_ALLOWED_ORPHAN_POSTS) {
    failures.push({
      routeId: "blog-link-graph",
      filePath: "content/blog",
      check: "orphan-post-links",
      reason: `Detected ${orphanPostSlugs.length} orphan blog posts without inbound /blog links. Sample: ${orphanPostSlugs
        .slice(0, 5)
        .join(", ")}`,
    });
  }

  const primaryKeywordMap = new Map();
  const duplicateKeywordMap = new Map();
  for (const result of results) {
    const primaryKeyword = result.keywords?.[0];
    if (!primaryKeyword) {
      continue;
    }

    const normalizedKeyword = primaryKeyword.toLowerCase().trim();
    const existing = primaryKeywordMap.get(normalizedKeyword);
    if (existing) {
      const existingList = duplicateKeywordMap.get(normalizedKeyword) || [existing];
      existingList.push(result.relativeFilePath);
      duplicateKeywordMap.set(normalizedKeyword, existingList);
      continue;
    }

    primaryKeywordMap.set(normalizedKeyword, result.relativeFilePath);
  }

  for (const [keyword, files] of duplicateKeywordMap.entries()) {
    const uniqueFiles = [...new Set(files)];
    const sampleFiles = uniqueFiles.slice(0, 5);
    const warningPayload = {
      timestamp: Date.now(),
      keyword,
      duplicatePostCount: uniqueFiles.length,
      sampleFiles,
      message:
        "Primary keyword is reused across multiple posts. Review cannibalization risk.",
    };
    warnings.push(warningPayload);
    console.warn("blog-validation-warning", warningPayload);
  }

  return duplicateKeywordMap.size;
}

function main() {
  const markdownFiles = getMarkdownFiles(BLOG_ROOT);
  console.info("blog-validation-start", {
    timestamp: Date.now(),
    blogRoot: BLOG_ROOT,
    markdownFileCount: markdownFiles.length,
  });

  if (markdownFiles.length === 0) {
    console.error("blog-validation-error", {
      timestamp: Date.now(),
      message: "No markdown files found under content/blog",
    });
    process.exit(1);
  }

  const slugRegistry = new Map();
  const results = markdownFiles.map((filePath) => validatePost(filePath, slugRegistry));
  const crossPostFailures = [];
  const crossPostWarningsPayload = [];
  const manifestState = validateGeneratedManifest(crossPostFailures);
  const crossPostWarnings = runCrossPostChecks(
    results,
    crossPostFailures,
    crossPostWarningsPayload,
    manifestState
  );

  for (const result of results) {
    if (result.warnings.length > 0) {
      console.warn("blog-validation-warning", {
        timestamp: Date.now(),
        file: result.relativeFilePath,
        slug: result.slug,
        warnings: result.warnings,
      });
    }

    if (result.errors.length > 0) {
      console.error("blog-validation-error", {
        timestamp: Date.now(),
        file: result.relativeFilePath,
        slug: result.slug,
        errors: result.errors,
      });
    }
  }

  printResultSummary(
    results.map((item) => ({
      ...item,
      warnings: item.warnings,
    }))
  );
  console.info("blog-validation-warning-summary", {
    timestamp: Date.now(),
    crossPostWarningCount: crossPostWarnings,
  });
  printSeoGuardrailReport(results);

  for (const failure of crossPostFailures) {
    console.error("blog-validation-error", {
      timestamp: Date.now(),
      file: failure.filePath,
      slug: failure.routeId,
      errors: [failure.reason],
    });
  }

  const totalErrors =
    results.reduce((sum, item) => sum + item.errors.length, 0) + crossPostFailures.length;
  const totalWarnings =
    results.reduce((sum, item) => sum + item.warnings.length, 0) + crossPostWarnings;
  if (totalErrors > 0) {
    process.exit(1);
  }

  if (STRICT_WARNINGS_MODE && totalWarnings > 0) {
    console.error("blog-validation-error", {
      timestamp: Date.now(),
      message:
        "Strict warning mode enabled and warnings were detected. Resolve warnings or disable strict mode.",
      totalWarnings,
    });
    process.exit(1);
  }

  console.info("blog-validation-success", {
    timestamp: Date.now(),
    message: "All blog posts passed critical SEO/content validation checks.",
    strictWarningsMode: STRICT_WARNINGS_MODE,
  });
}

try {
  main();
} catch (error) {
  console.error("blog-validation-error", {
    timestamp: Date.now(),
    message: "Unhandled validator failure while processing markdown content.",
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
