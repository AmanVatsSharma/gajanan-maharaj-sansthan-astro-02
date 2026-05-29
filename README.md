# Shri Gajanan Maharaj Sansthan Website

Official Astro site for Shri Gajanan Maharaj Sansthan with:

- SEO-first page metadata and structured data
- location + booking conversion flows
- markdown-driven devotional/blog content cluster
- strict automated SEO quality gates (`seo:ci`)

## Quick Start

1. Install dependencies:

```bash
npm ci
```

2. Copy env template and update values:

```bash
cp .env.example .env
```

3. Run local dev server:

```bash
npm run dev
```

Open: `http://localhost:4321`

---

## Environment Variables

Use `.env.example` as the single source template.

Critical variables:

```env
PUBLIC_SITE_URL=https://www.gajananmaharajsanstan.com
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_DEBUG_SEO=false
BUILD_STANDALONE=false
SEO_ENABLE_APP_HOST_REDIRECTS=false
SEO_VERIFY_LIVE_REDIRECTS=false
```

### `PUBLIC_SITE_URL` (production and CI)

Set **`PUBLIC_SITE_URL`** to the exact canonical origin you submit in Google Search Console (for example `https://www.gajananmaharajsanstan.com`, no trailing slash). It drives:

- absolute URLs in `sitemap.xml`, `robots.txt` (`Sitemap:` / `Host:`), and RSS `feed.xml`
- canonical and Open Graph URLs from `src/lib/seo/site-url.ts`

Use the **same** value when running **`npm run build`** and when running **`npm run verify:sitemap`**, **`verify:rss`**, and **`verify:robots`** so dist checks match the built files. If it is unset at build time, production builds fall back to the default in `src/lib/seo/site-url.ts`.

### Canonical-host safety note

`SEO_ENABLE_APP_HOST_REDIRECTS` is disabled by default to avoid host bounce loops when deployment platform redirects are configured separately.  
Enable it only when DNS/platform redirect policy is confirmed to match your canonical host.

---

## SEO Verification Commands

### CI-style gate (lint, build, dist checks)

```bash
npm run seo:ci
```

### Individual checks (after `npm run build`)

```bash
npm run verify:sitemap
npm run verify:rss
npm run verify:robots
```

Optional: override the dist output directory with **`ASTRO_DIST_CLIENT`** if your adapter layout differs (default: `dist/client`).

### Live redirect loop check (opt-in)

```bash
SEO_VERIFY_LIVE_REDIRECTS=true npm run verify:live-redirects
```

---

## SEO/Content pipeline flow

```mermaid
flowchart TD
  content[content/blog/*.md] --> build[astro build]
  build --> verify[npm run seo:ci]
  verify --> deploy[Deploy]
  deploy --> liveCheck[SEO_VERIFY_LIVE_REDIRECTS=true npm run verify:live-redirects]
```

---

## Useful Docs

- `SEO_QUICKSTART.md`
- `SEO_IMPLEMENTATION_COMPLETE.md`
- `docs/SEO_SETUP_GUIDE.md`
- `docs/SEO_TECHNICAL_IMPLEMENTATION.md`
- `docs/SEO_ROLLOUT_VERIFICATION_REPORT.md`
- `docs/SEO_MEDIA_ASSET_INVENTORY.md`
- `docs/SEO_POST_DEPLOY_SMOKE_CHECKLIST.md`
- `docs/SEO_CANONICAL_HOST_DEPLOYMENT_GUIDE.md`

---

## Deployment Reminder

After each deployment:

1. run live host redirect check
2. verify `/robots.txt` and `/sitemap.xml`
3. inspect homepage canonical + OG tags
4. review Google Search Console coverage changes
