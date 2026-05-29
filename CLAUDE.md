# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Official website for Shri Gajanan Maharaj Sansthan (temple at Shegaon, Maharashtra). Built with Astro 5 + React 19 + Tailwind CSS 4. Deployed on Vercel with `@astrojs/vercel` adapter. Branch: `astro`.

**Do not read or modify files in `content/blog/`** — there are hundreds of markdown posts; treat that directory as off-limits unless a task explicitly targets blog content.

## Commands

```bash
npm run dev          # dev server at http://localhost:4321
npm run build        # production build (output: dist/client/)
npm run preview      # serve dist/ locally
npm run lint         # eslint

# SEO CI gate (runs after build)
npm run seo:ci      # lint + build + blog validation + sitemap + rss + robots

# Individual SEO checks (run after build)
npm run verify:sitemap
npm run verify:rss
npm run verify:robots
npm run verify:blog-content
npm run verify:blog-content:report   # detailed SEO surface report

# Live redirect check (opt-in)
SEO_VERIFY_LIVE_REDIRECTS=true npm run verify:live-redirects
```

## Environment Setup

```bash
cp .env.example .env
```

Key variables:
- `PUBLIC_SITE_URL` — canonical origin (`https://www.gajananmaharajsanstan.com`). Drives sitemap, robots, RSS, OG/canonical URLs. Must match your Vercel deployment domain.
- `PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement ID (`G-XXXXXXXXXX`).
- `SEO_ENABLE_APP_HOST_REDIRECTS` — set `true` only when Vercel is NOT handling apex→www redirect itself (avoids redirect loops).
- `PUBLIC_DEBUG_SEO=false` — set to `true` for verbose SEO runtime logs.

## Architecture

### Path aliases
`@/*` maps to `src/*` (configured in `tsconfig.json`).

### Page rendering model
Astro hybrid output: marketing pages prerender at build time; image endpoints and API routes are dynamic Vercel serverless functions.

### Directory structure

```
src/
  pages/              # File-based routing
    index.astro       # Homepage
    blog/             # [slug].astro, category/, tag/, page/
    locations/        # [id].astro — one page per temple location
    booking/          # Booking flow pages
    *.ts              # Dynamic endpoints: sitemap.xml, feed.xml, robots.txt, OG images
  layouts/
    Layout.astro      # Root shell wrapping every page with Navbar, Footer, HeadTags, GA
  components/
    layout/           # Navbar.tsx, Footer.tsx
    seo/              # HeadTags.astro — all <head> meta/OG/Twitter/canonical tags
    analytics/        # GoogleAnalytics.tsx
    ui/               # Shared Radix/Tailwind UI primitives + WhatsAppButton
  features/           # Domain-sliced modules
    info/             # Homepage sections: Hero, ImpactStats, Features, Testimonials
    booking/          # BookingCheckoutWidget, BookingLandingForm, BookingPageBody
    locations/        # Location detail UI
    blog/             # Blog-specific components
    contact/          # Contact form components
  lib/
    seo/              # SEO engine (see below)
    blog/             # Blog ingestion using gray-matter
    og/               # Open Graph image generation (@vercel/og)
    utils.ts          # Shared utilities
  data/               # Static domain data: sansthan-data.ts, rooms.ts, festivals.ts, testimonials.ts
  design-system/      # Design tokens (tokens.json)
  styles/             # globals.css (Tailwind base)
  middleware.ts       # Canonical host redirect

content/
  blog/               # Markdown posts — DO NOT TOUCH
  events/             # Event markdown
  guides/             # Guide markdown
  locations/          # Location markdown
```

### SEO system — architecture

Every page follows this flow:
1. Page calls `generatePageMetadata()` from `src/lib/seo/metadata.ts`
2. Result passed to `<Layout meta={meta}>`
3. `Layout.astro` passes meta to `<HeadTags.astro>`
4. `HeadTags` renders canonical, OG, Twitter, robots, geo tags

JSON-LD structured data (30+ schema types) injected per-page via `src/lib/seo/structured-data.ts`:
- `getOrganizationSchema()` / `getEnhancedPersonSchema()` — homepage entity establishment
- `getHinduTempleSchema()` / `getPlaceOfWorshipSchema()` — location pages
- `getLodgingBusinessSchema()` — accommodation pages
- `getArticleSchema()` — blog posts
- `getFAQSchema()` / `getServiceSchema()` — booking pages

`src/lib/seo/constants.ts` holds keyword clusters and all brand name variants (Shri/Shree/Sri + Sansthan/Sanstan permutations).

### Blog ingestion

`src/lib/blog/` reads `content/blog/**/*.md` at build time using `gray-matter`. Exposes:
- `getBlogPosts()` / `getBlogPost(slug)` — post retrieval
- Taxonomy helpers — category, tag, pagination
- `getRelatedPosts()` — for "You might also like" sections

Blog pages use these for static path generation (prerendered at build time).

### Middleware

`src/middleware.ts` handles canonical host redirects (apex → www). Controlled by `SEO_ENABLE_APP_HOST_REDIRECTS` env var — no-ops locally and when disabled.

### Static data layer

`src/data/` contains typed domain objects used throughout the site:
- `sansthan-data.ts` — locations, facilities, amenities, contact info
- `rooms.ts` — Bhakta Niwas room types with pricing
- `festivals.ts` — annual festival calendar
- `testimonials.ts` — devotee testimonials for rating schemas
- `faq.ts` — frequently asked questions for FAQ schema
