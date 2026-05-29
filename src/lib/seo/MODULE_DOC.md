# Module: lib/seo

**Short:** Central SEO engine for metadata, schema, keywords, canonical URL, and geo enrichment.

## Purpose

Provide reusable SEO primitives used across all routes:

- page metadata generation (`metadata.ts`)
- keyword strategy constants (`constants.ts`)
- canonical host/site URL resolution (`site-url.ts`)
- JSON-LD schema generation (`structured-data.ts`)
- geo coordinate helpers (`geo-data.ts`)

## Core files

- `constants.ts` — keyword clusters, brand/location variants, and keyword dedupe helper.
- `metadata.ts` — page metadata builders (including location geo meta support).
- `site-url.ts` — canonical origin resolver.
- `structured-data.ts` — Organization, WebSite, PlaceOfWorship, LocalBusiness, LodgingBusiness, FAQ, Breadcrumb, Article, CollectionPage schemas.
- `geo-data.ts` — location coordinates and geotag helpers.

## Canonical and metadata flow

```mermaid
flowchart TD
  env[NEXT_PUBLIC_SITE_URL / VERCEL_URL] --> siteUrl[getSiteUrl]
  siteUrl --> metadata[generatePageMetadata]
  metadata --> pageRoutes[All app routes]
  siteUrl --> schemas[structured-data generators]
  schemas --> scriptTags[JSON-LD script output]
  pageRoutes --> sitemap[src/app/sitemap.ts]
```

## Logging / diagnostics

- Blog ingestion warns on metadata quality issues through `blog-seo-warning` logs.
- Invalid canonical URL environment values emit `seo-config-warning` at config load time.
- Apex-host canonical inputs are normalized to the project `www` host with `seo-site-url-warning` diagnostics.
- Build-level SEO smoke checks are available via `npm run verify:seo-build` (checks canonical/meta/schema presence on key prerendered routes).
- Canonical consistency checks are available via `npm run verify:canonical` (ensures canonical host/presence across SEO pages).
- Robots policy checks are available via `npm run verify:robots` (ensures required directives, host, and sitemap lines).
- Sitemap integrity checks are available via `npm run verify:sitemap` (checks URL count + blog/taxonomy/pagination coverage).
- Live host redirect-loop checks are available via `SEO_VERIFY_LIVE_REDIRECTS=true npm run verify:live-redirects`.
- CI gate: `.github/workflows/seo-quality-gate.yml` runs `npm run seo:check:strict` on PRs/pushes.

## Changelog

- **2026-02-05**: Initial SEO helper modules and schema generation added.
- **2026-02-15**: Expanded keyword variant coverage for Shri/Shree/Sri + Sansthan/Sanstan permutations and strengthened page metadata keyword mapping.
- **2026-02-15**: Canonical redirect handling hardened to redirect alternate host → configured canonical host.
- **2026-02-18**: Added Sheogaon, Triambakeshwar, and Bhakta Niwas keyword variants to constants for improved search coverage.
