# Blog Content Guide

This directory contains markdown content used to generate `/blog` pages and SEO archive routes (`/blog/tag/*`, `/blog/category/*`).

## Current cluster status

- Total publishable posts: **496**
- Cluster categories:
  - `locations` (Shegaon 135 / Omkareshwar 87 / Pandharpur 65 / Trimbakeshwar 63 intent pages)
  - `guides` (78 cross-location planning pages)
  - `spiritual` (32 devotional planning context)
  - `events` (31 festival and crowd-planning support)

## Directory structure

- `content/blog/locations/` - city and place-focused SEO pages (`shegaon`, `omkareshwar`, `pandharpur`, `trimbakeshwar`)
- `content/blog/guides/` - practical planning and booking guides
- `content/blog/spiritual/` - teachings, devotion, and spiritual context
- `content/blog/events/` - festival and event updates
- `content/blog/_templates/` - authoring templates (ignored by the blog loader)
- `content/blog/_ops/` - SEO operating docs + generator manifest (ignored by the blog loader)

## Required frontmatter

```yaml
---
title: "Page title with main keyword"
description: "Meta description with location and intent"
date: "2026-02-15"
slug: "kebab-case-slug"
image: "/images/shegaon-temple.svg"
keywords:
  - "primary keyword"
  - "secondary keyword"
author: "Sansthan"
tags:
  - "shegaon"
  - "travel-guide"
category: "locations"
locationIds:
  - "shegaon-bhakt-niwas"
relatedSlugs:
  - "shegaon-accommodation-guide"
---
```

## URL and slug rules

- Keep `slug` unique across all files.
- Use only lowercase letters, numbers, and hyphens.
- Keep URL intent clear: location + purpose (for example `shegaon-travel-guide`).

## Internal linking rules (mandatory)

Every post should include links to:

1. At least one location detail page (`/locations/<id>`).
2. Booking or contact intent pages (`/booking` or `/contact`).
3. One pillar post and two related cluster posts (`/blog/<slug>`).

## Keyword placement checklist

- Include primary keyword in title, description, first paragraph, and one heading.
- Include search variants naturally (Shri/Shree/Sri + Sansthan/Sanstan + location).
- Add FAQ-style or checklist sections for long-tail queries.
- Avoid keyword stuffing; keep content natural and devotional.

## Editorial quality guardrails

- Prefer practical, family-friendly pilgrimage guidance.
- Keep timing-sensitive statements flexible (“may vary by day/festival”).
- Use official-page internal links rather than external speculative sources.

## Validation & generation commands

```bash
# Generate deterministic SEO post clusters
npm run generate:blogs

# Validate all markdown SEO requirements
npm run validate:blog

# Fail the run on any warning (strict mode)
npm run validate:blog:strict

# Verify generated cluster manifest distribution and integrity
npm run verify:generator

# Verify manual seed post integrity and ownership boundaries
npm run verify:manual-seeds

# Verify generator determinism against temp regeneration
npm run verify:generator:determinism

# Verify SEO gate command-chain ordering
npm run verify:seo-chain

# Verify CI workflow strict-gate invariants
npm run verify:ci-gate

# Verify SEO docs stay synced with inventory claims
npm run verify:docs-sync

# Verify every blog post page in build has canonical/meta/schema signals
npm run verify:blog-surfaces
```

Validation now includes cross-post integrity checks for:
- minimum publishable post count (`>= 100`)
- `relatedSlugs` existence
- internal `/blog/<slug>` and `/locations/<id>` link-target existence
- generated cluster manifest integrity (`_ops/generated-seo-cluster-manifest.json`)
- inbound blog-link graph health (orphan-post prevention with controlled exemptions)
- generated-post outbound blog-link minimum enforcement (`>=5` links per generated post)
- location cluster coverage for Shegaon/Omkareshwar/Pandharpur/Trimbakeshwar
- location cluster minimum ownership thresholds (`shegaon>=135`, `omkareshwar>=87`, `pandharpur>=65`, `trimbakeshwar>=63`)
- keyword-fragment brand coverage for Shri/Shree/Sri + Sansthan/Sanstan variants
- duplicate primary keyword cannibalization warnings

Generator note: `npm run generate:blogs` now assigns topic-specific primary keywords per post so cross-post cannibalization warnings remain near zero.
Generator determinism note: generation now tracks managed files in `content/blog/_ops/generated-seo-cluster-manifest.json` and cleans stale generated files on the next run before recreating the cluster.
Cluster sizing source of truth: `scripts/seo-cluster-config.mjs` controls expected generated distribution.
Manifest drift guard: validator/verifier checks enforce `configFingerprint` alignment between manifest and shared cluster config.
Generator verifier guard: `verify:generator` now asserts generated-file frontmatter integrity (slug/category/relatedSlugs/location namespace rules).
Manifest integrity guard: generated manifest includes `manifestVersion` and per-file SHA-256 checksums to detect manual drift in managed posts.
Manifest determinism guard: volatile manifest timestamps are disallowed so repeated generation does not create timestamp-only drift.
Managed namespace guard: location/guides/spiritual/events markdown files must be either generator-owned (manifest) or listed manual seed anchors.
Internal-linking note: generated clusters now add deterministic sibling links (previous/next within each cluster) to improve crawl continuity and reduce orphaned pages.

## Content pipeline flowchart

```mermaid
flowchart TD
  author[Content Author / Script] --> md[Markdown in content/blog]
  md --> validator[npm run validate:blog]
  validator -->|pass| parser[src/lib/blog/posts.ts]
  parser --> taxonomy[Tag + Category archives]
  parser --> blogPages[/blog and /blog/[slug]/]
  taxonomy --> sitemap[src/app/sitemap.ts]
  blogPages --> sitemap
  sitemap --> google[Search Engine Discovery]
```
