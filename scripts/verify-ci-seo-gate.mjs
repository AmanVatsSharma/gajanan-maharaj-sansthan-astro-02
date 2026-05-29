/**
 * File: scripts/verify-ci-seo-gate.mjs
 * Module: scripts
 * Purpose: Verify GitHub Actions SEO quality-gate workflow invariants.
 * Notes:
 * - Ensures CI keeps running strict SEO gate command.
 * - Detects workflow drift that could weaken regression protection.
 */

import fs from "node:fs";
import path from "node:path";

const WORKFLOW_PATH = path.join(process.cwd(), ".github/workflows/seo-quality-gate.yml");

const REQUIRED_SNIPPETS = [
  "name: SEO Quality Gate",
  "pull_request:",
  "push:",
  "cursor/**",
  "timeout-minutes: 20",
  "uses: actions/setup-node@v4",
  'node-version: "20"',
  "run: npm run seo:check:strict",
];

function main() {
  console.info("ci-seo-gate-verify-start", {
    timestamp: Date.now(),
    workflowPath: WORKFLOW_PATH,
  });

  if (!fs.existsSync(WORKFLOW_PATH)) {
    console.error("ci-seo-gate-verify-failure", {
      timestamp: Date.now(),
      check: "workflow-exists",
      reason: "SEO quality gate workflow file is missing.",
    });
    process.exit(1);
  }

  const content = fs.readFileSync(WORKFLOW_PATH, "utf-8");
  const failures = [];

  for (const snippet of REQUIRED_SNIPPETS) {
    if (!content.includes(snippet)) {
      failures.push({
        check: "workflow-snippet",
        reason: `Missing required workflow snippet: "${snippet}"`,
      });
    }
  }

  const strictGateRunMatches =
    content.match(/run:\s*npm run seo:check:strict/g)?.length || 0;
  if (strictGateRunMatches !== 1) {
    failures.push({
      check: "strict-gate-run-count",
      reason: `Expected exactly one strict gate run command, found ${strictGateRunMatches}.`,
    });
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error("ci-seo-gate-verify-failure", {
        timestamp: Date.now(),
        ...failure,
      });
    }

    console.error("ci-seo-gate-verify-summary", {
      timestamp: Date.now(),
      status: "failed",
      failureCount: failures.length,
    });
    process.exit(1);
  }

  console.info("ci-seo-gate-verify-summary", {
    timestamp: Date.now(),
    status: "passed",
    strictGateRunMatches,
    checkedSnippetCount: REQUIRED_SNIPPETS.length,
  });
}

try {
  main();
} catch (error) {
  console.error("ci-seo-gate-verify-failure", {
    timestamp: Date.now(),
    check: "unhandled-runtime-error",
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
