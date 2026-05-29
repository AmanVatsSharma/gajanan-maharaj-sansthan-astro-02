/**
 * File: scripts/verify-seo-command-chain.mjs
 * Module: scripts
 * Purpose: Validate SEO gate command composition and execution order in package.json.
 * Notes:
 * - Prevents accidental removal/reordering of critical verification steps.
 * - Keeps `seo:check` and `seo:check:strict` aligned with expected guardrails.
 */

import fs from "node:fs";
import path from "node:path";

const PACKAGE_JSON_PATH = path.join(process.cwd(), "package.json");

const EXPECTED_SEO_CHECK_CHAIN = [
  "npm run lint",
  "npm run verify:seo-chain",
  "npm run verify:ci-gate",
  "npm run verify:generator",
  "npm run verify:manual-seeds",
  "npm run verify:generator:determinism",
  "npm run verify:docs-sync",
  "npm run build",
  "npm run verify:canonical",
  "npm run verify:robots",
  "npm run verify:locations",
  "npm run verify:taxonomy",
  "npm run verify:sitemap",
  "npm run verify:pagination",
  "npm run verify:rss",
  "npm run verify:blog-surfaces",
  "npm run verify:seo-build",
  "npm run verify:live-redirects",
  "npm run validate:blog",
];

const EXPECTED_SEO_STRICT_CHAIN = [
  "npm run lint",
  "npm run verify:seo-chain",
  "npm run verify:ci-gate",
  "npm run verify:generator",
  "npm run verify:manual-seeds",
  "npm run verify:generator:determinism",
  "npm run verify:docs-sync",
  "npm run build",
  "npm run verify:canonical",
  "npm run verify:robots",
  "npm run verify:locations",
  "npm run verify:taxonomy",
  "npm run verify:sitemap",
  "npm run verify:pagination",
  "npm run verify:rss",
  "npm run verify:blog-surfaces",
  "npm run verify:seo-build",
  "npm run verify:live-redirects",
  "npm run validate:blog:strict",
];

function splitChain(command) {
  return command
    .split("&&")
    .map((step) => step.trim())
    .filter(Boolean);
}

function diffChains(actual, expected) {
  const issues = [];
  const maxLen = Math.max(actual.length, expected.length);

  for (let index = 0; index < maxLen; index += 1) {
    if (actual[index] !== expected[index]) {
      issues.push({
        position: index + 1,
        expected: expected[index] || "(none)",
        actual: actual[index] || "(none)",
      });
    }
  }

  return issues;
}

function extractNpmRunScriptName(step) {
  const match = step.match(/^npm run ([a-z0-9:-]+)$/i);
  return match?.[1] || "";
}

function getDuplicateSteps(steps) {
  const stepCounts = new Map();
  for (const step of steps) {
    stepCounts.set(step, (stepCounts.get(step) || 0) + 1);
  }

  return [...stepCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([step, count]) => ({ step, count }));
}

function main() {
  console.info("seo-command-chain-verify-start", {
    timestamp: Date.now(),
    packageJsonPath: PACKAGE_JSON_PATH,
  });

  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    console.error("seo-command-chain-verify-failure", {
      timestamp: Date.now(),
      check: "package-json-exists",
      reason: "package.json not found in workspace root.",
    });
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"));
  const scripts = packageJson?.scripts || {};

  const seoCheck = scripts["seo:check"];
  const seoCheckStrict = scripts["seo:check:strict"];
  const verifySeoChain = scripts["verify:seo-chain"];
  const failures = [];

  if (typeof verifySeoChain !== "string") {
    failures.push({
      check: "verify-seo-chain-script",
      reason: 'Missing "verify:seo-chain" npm script.',
    });
  }

  if (typeof seoCheck !== "string") {
    failures.push({
      check: "seo-check-script",
      reason: 'Missing "seo:check" npm script.',
    });
  }

  if (typeof seoCheckStrict !== "string") {
    failures.push({
      check: "seo-check-strict-script",
      reason: 'Missing "seo:check:strict" npm script.',
    });
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("seo-command-chain-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }
    console.error("seo-command-chain-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  const seoCheckChain = splitChain(seoCheck);
  const seoCheckStrictChain = splitChain(seoCheckStrict);

  const seoCheckDiffs = diffChains(seoCheckChain, EXPECTED_SEO_CHECK_CHAIN);
  const seoStrictDiffs = diffChains(seoCheckStrictChain, EXPECTED_SEO_STRICT_CHAIN);
  const referencedScriptNames = new Set(
    [...seoCheckChain, ...seoCheckStrictChain]
      .map((step) => extractNpmRunScriptName(step))
      .filter(Boolean)
      .filter((name) => !["seo:check", "seo:check:strict"].includes(name))
  );

  if (seoCheckDiffs.length > 0) {
    failures.push({
      check: "seo-check-chain-order",
      reason: "seo:check command chain does not match expected order.",
      differences: seoCheckDiffs,
    });
  }

  if (seoStrictDiffs.length > 0) {
    failures.push({
      check: "seo-check-strict-chain-order",
      reason: "seo:check:strict command chain does not match expected order.",
      differences: seoStrictDiffs,
    });
  }

  const invalidFormattedSteps = [...seoCheckChain, ...seoCheckStrictChain].filter(
    (step) => !step.startsWith("npm run ")
  );
  if (invalidFormattedSteps.length > 0) {
    failures.push({
      check: "command-step-format",
      reason: `All SEO chain steps must start with "npm run". Invalid steps: ${[
        ...new Set(invalidFormattedSteps),
      ]
        .slice(0, 5)
        .join(", ")}`,
    });
  }

  const duplicateSeoCheckSteps = getDuplicateSteps(seoCheckChain);
  if (duplicateSeoCheckSteps.length > 0) {
    failures.push({
      check: "seo-check-duplicate-steps",
      reason: `seo:check contains duplicate steps: ${duplicateSeoCheckSteps
        .map((entry) => `${entry.step} (x${entry.count})`)
        .join(", ")}`,
    });
  }

  const duplicateSeoCheckStrictSteps = getDuplicateSteps(seoCheckStrictChain);
  if (duplicateSeoCheckStrictSteps.length > 0) {
    failures.push({
      check: "seo-check-strict-duplicate-steps",
      reason: `seo:check:strict contains duplicate steps: ${duplicateSeoCheckStrictSteps
        .map((entry) => `${entry.step} (x${entry.count})`)
        .join(", ")}`,
    });
  }

  const nonTerminalDiffs = seoCheckChain
    .slice(0, -1)
    .map((step, index) => ({
      index,
      step,
      strictStep: seoCheckStrictChain[index],
    }))
    .filter((entry) => entry.step !== entry.strictStep);
  if (nonTerminalDiffs.length > 0) {
    failures.push({
      check: "seo-check-strict-parity",
      reason: "seo:check and seo:check:strict should differ only in final validation step.",
      differences: nonTerminalDiffs.slice(0, 5).map((entry) => ({
        position: entry.index + 1,
        seoCheck: entry.step,
        seoCheckStrict: entry.strictStep,
      })),
    });
  }

  for (const scriptName of referencedScriptNames) {
    if (typeof scripts[scriptName] !== "string") {
      failures.push({
        check: "referenced-script-exists",
        reason: `Command chain references missing npm script "${scriptName}".`,
      });
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("seo-command-chain-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("seo-command-chain-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("seo-command-chain-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    seoCheckStepCount: seoCheckChain.length,
    seoCheckStrictStepCount: seoCheckStrictChain.length,
    referencedScriptCount: referencedScriptNames.size,
  });
}

try {
  main();
} catch (error) {
  console.error("seo-command-chain-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
