# Daily SEO Agents — Operator Guide

Two scheduled Claude Code sessions keep the SEO posture of this site improving every day without human intervention. Each session runs with a **fresh, empty context** — the only input is the prompt file, which is stable and identical across runs.

## Schedule

| Time (local) | Model | Prompt file | Scope |
|---|---|---|---|
| **09:00** | Claude Sonnet 4.6 | [`DAILY_AGENT_MORNING_SONNET.md`](./DAILY_AGENT_MORNING_SONNET.md) | Everything *except* `content/blog/` — metadata, schema, alt text, internal links, structured data, data-layer enrichment |
| **18:00** | Claude Haiku 4.5 | [`DAILY_AGENT_EVENING_HAIKU.md`](./DAILY_AGENT_EVENING_HAIKU.md) | *Only* `content/blog/**/*.md` — frontmatter polish, body internal links, broken-link repair |

## How the rotation works without memory

Each prompt uses a **priority-ladder survey**: the fresh agent scans the codebase, finds the highest-priority gap that still exists today, fixes exactly one target, and ships a PR. Because every fix reduces the surface of that rung, the ladder naturally advances day-by-day. No persistent state is required.

Idempotency is enforced by:
- `grep`-before-edit checks for every addition
- Hard rules on what files each agent may touch
- `npm run seo:ci` as a mandatory pre-commit gate
- One-atomic-change-per-PR discipline

## Operator checklist (one-time setup)

1. Configure two scheduled Claude Code sessions against this repository on branch `astro` (or let the agent fetch from it).
2. Morning session system prompt = contents of `DAILY_AGENT_MORNING_SONNET.md` (section under "PROMPT (copy from here to end-of-file)").
3. Evening session system prompt = contents of `DAILY_AGENT_EVENING_HAIKU.md` (same section).
4. Ensure both sessions have: write access to create branches, push to origin, and open PRs via the GitHub MCP.
5. Both agents open PRs as **ready-for-review** targeting `astro`. A human (or existing CI + auto-merge policy) decides when to land them.

## What the operator does each day

- **Nothing** on ordinary days — PRs accumulate, CI runs, you merge whichever look good.
- **Occasionally** sanity-check that the agents aren't fighting each other over the same file (by design they shouldn't — strict path boundaries).
- If `npm run seo:ci` starts failing on `astro` for an unrelated reason, both agents will refuse to push — investigate and unblock the trunk first.

## Expected cadence

- 1 PR per agent per day → **~60 PRs/month** of compounding SEO improvements.
- Morning PRs are structural (metadata, schema, components). Evening PRs are content-layer (blog frontmatter).
- Most PRs are small (one file, one concept). That is intentional — small diffs are easy to review, revert, and bisect.

## When to tune the prompts

Edit the prompt files when:
- A new schema type or keyword cluster is added to `src/lib/seo/` that should be in rotation.
- A new content directory appears (e.g., `content/events/`) that needs an explicit boundary rule.
- You want to reprioritize the ladder (e.g., push Core Web Vitals work higher after a Google update).

Do **not** edit the prompts to add memory or cross-session state. The statelessness is the design — it is why the same prompt survives indefinitely.
