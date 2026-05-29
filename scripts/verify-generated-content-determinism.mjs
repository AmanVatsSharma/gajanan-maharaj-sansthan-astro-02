/**
 * File: scripts/verify-generated-content-determinism.mjs
 * Module: scripts
 * Purpose: Verify generator determinism by comparing fresh temp output to live manifest.
 * Notes:
 * - Re-runs generator in an isolated temporary root.
 * - Fails if checksums/file inventory differ from live generated manifest.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const WORKSPACE_ROOT = process.cwd();
const LIVE_BLOG_ROOT = path.join(WORKSPACE_ROOT, "content/blog");
const LIVE_MANIFEST_PATH = path.join(
  LIVE_BLOG_ROOT,
  "_ops/generated-seo-cluster-manifest.json"
);
const GENERATOR_SCRIPT_PATH = path.join(
  WORKSPACE_ROOT,
  "scripts/generate-seo-blog-cluster.mjs"
);
const GENERATOR_TIMEOUT_MS = 60000;

function readManifest(manifestPath) {
  const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const generatedFiles = Array.isArray(parsed?.generatedFiles) ? parsed.generatedFiles : [];
  const generatedFileChecksums =
    parsed?.generatedFileChecksums &&
    typeof parsed.generatedFileChecksums === "object" &&
    !Array.isArray(parsed.generatedFileChecksums)
      ? parsed.generatedFileChecksums
      : {};

  return {
    manifestVersion: parsed?.manifestVersion,
    configFingerprint: parsed?.configFingerprint || "",
    generatedFileCount: parsed?.generatedFileCount,
    generatedFiles: generatedFiles.map((entry) => String(entry).replace(/\\/g, "/")).sort(),
    generatedFileChecksums: generatedFileChecksums,
  };
}

function formatOutputSnippet(value) {
  if (!value) {
    return "";
  }

  const normalized = String(value).trim();
  if (normalized.length <= 2000) {
    return normalized;
  }

  return `${normalized.slice(0, 2000)}...(truncated)`;
}

function getMapDiff(actualMap, expectedMap) {
  const actualKeys = new Set(Object.keys(actualMap));
  const expectedKeys = new Set(Object.keys(expectedMap));

  const missingKeys = [...expectedKeys].filter((key) => !actualKeys.has(key));
  const extraKeys = [...actualKeys].filter((key) => !expectedKeys.has(key));
  const checksumMismatches = [];

  for (const key of [...actualKeys].filter((entry) => expectedKeys.has(entry))) {
    if (actualMap[key] !== expectedMap[key]) {
      checksumMismatches.push(key);
    }
  }

  return {
    missingKeys,
    extraKeys,
    checksumMismatches,
  };
}

function main() {
  console.info("generator-determinism-verify-start", {
    timestamp: Date.now(),
    liveManifestPath: LIVE_MANIFEST_PATH,
  });

  if (!fs.existsSync(LIVE_MANIFEST_PATH)) {
    console.error("generator-determinism-verify-failure", {
      timestamp: Date.now(),
      check: "live-manifest-exists",
      reason: "Live generated manifest missing. Run npm run generate:blogs first.",
    });
    process.exit(1);
  }

  const liveManifest = readManifest(LIVE_MANIFEST_PATH);
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "seo-generator-determinism-"));
  const tempBlogRoot = path.join(tempRoot, "content/blog");
  const tempManifestPath = path.join(tempBlogRoot, "_ops/generated-seo-cluster-manifest.json");
  const failures = [];
  let generatorOutput = "";

  try {
    try {
      generatorOutput = execFileSync("node", [GENERATOR_SCRIPT_PATH], {
        cwd: WORKSPACE_ROOT,
        env: {
          ...process.env,
          SEO_BLOG_GENERATOR_ROOT: tempBlogRoot,
        },
        timeout: GENERATOR_TIMEOUT_MS,
        stdio: "pipe",
      }).toString();
    } catch (error) {
      const errorObject = error;
      failures.push({
        check: "temp-generator-execution",
        reason: `Temporary generator execution failed: ${
          errorObject instanceof Error ? errorObject.message : String(errorObject)
        }`,
        outputSnippet: formatOutputSnippet(
          `${errorObject?.stdout?.toString?.() || ""}\n${errorObject?.stderr?.toString?.() || ""}`
        ),
      });
    }

    if (!fs.existsSync(tempManifestPath)) {
      failures.push({
        check: "temp-manifest-exists",
        reason: "Temporary generator run did not produce a manifest.",
      });
    } else {
      const tempManifest = readManifest(tempManifestPath);
      if (tempManifest.manifestVersion !== liveManifest.manifestVersion) {
        failures.push({
          check: "manifest-version",
          reason: `Temporary manifest version ${tempManifest.manifestVersion} does not match live ${liveManifest.manifestVersion}.`,
        });
      }

      if (tempManifest.configFingerprint !== liveManifest.configFingerprint) {
        failures.push({
          check: "config-fingerprint",
          reason: `Temporary fingerprint ${tempManifest.configFingerprint} does not match live ${liveManifest.configFingerprint}.`,
        });
      }

      if (tempManifest.generatedFileCount !== liveManifest.generatedFileCount) {
        failures.push({
          check: "generated-file-count",
          reason: `Temporary generatedFileCount ${tempManifest.generatedFileCount} does not match live ${liveManifest.generatedFileCount}.`,
        });
      }

      if (
        JSON.stringify(tempManifest.generatedFiles) !==
        JSON.stringify(liveManifest.generatedFiles)
      ) {
        failures.push({
          check: "generated-file-list",
          reason: "Temporary generated file inventory differs from live manifest inventory.",
        });
      }

      const checksumDiff = getMapDiff(
        tempManifest.generatedFileChecksums,
        liveManifest.generatedFileChecksums
      );
      if (checksumDiff.missingKeys.length > 0) {
        failures.push({
          check: "checksum-map-missing-keys",
          reason: `Temporary checksum map missing keys: ${checksumDiff.missingKeys
            .slice(0, 5)
            .join(", ")}`,
        });
      }
      if (checksumDiff.extraKeys.length > 0) {
        failures.push({
          check: "checksum-map-extra-keys",
          reason: `Temporary checksum map has unexpected keys: ${checksumDiff.extraKeys
            .slice(0, 5)
            .join(", ")}`,
        });
      }
      if (checksumDiff.checksumMismatches.length > 0) {
        failures.push({
          check: "checksum-map-mismatch",
          reason: `Checksum mismatch for generated entries: ${checksumDiff.checksumMismatches
            .slice(0, 5)
            .join(", ")}`,
        });
      }

      const tempGeneratedFilesOnDisk = tempManifest.generatedFiles.filter((entry) =>
        fs.existsSync(path.join(tempBlogRoot, entry))
      ).length;
      if (tempGeneratedFilesOnDisk !== tempManifest.generatedFileCount) {
        failures.push({
          check: "temp-generated-files-on-disk",
          reason: `Temporary generated files on disk (${tempGeneratedFilesOnDisk}) do not match temp manifest count (${tempManifest.generatedFileCount}).`,
        });
      }
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("generator-determinism-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("generator-determinism-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("generator-determinism-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    comparedGeneratedFiles: liveManifest.generatedFiles.length,
    generatorOutputSnippet: formatOutputSnippet(generatorOutput),
  });
}

try {
  main();
} catch (error) {
  console.error("generator-determinism-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
