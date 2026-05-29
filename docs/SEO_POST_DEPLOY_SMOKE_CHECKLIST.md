# SEO Post-Deploy Smoke Checklist

Run this checklist immediately after every production deployment.

---

## 1) Canonical host and redirect safety

```bash
SEO_VERIFY_LIVE_REDIRECTS=true \
SEO_LIVE_SITE_URL=https://www.gajananmaharajsanstan.com \
npm run verify:live-redirects
```

Expected:
- canonical host resolves without loop
- alternate host converges to canonical host

---

## 2) Core crawl surfaces

Check in browser/curl:

- `https://www.gajananmaharajsanstan.com/robots.txt`
- `https://www.gajananmaharajsanstan.com/sitemap.xml`
- `https://www.gajananmaharajsanstan.com/feed.xml`

Expected:
- HTTP 200
- robots has Host + Sitemap directives
- sitemap includes latest URL inventory

---

## 3) Critical route spot checks

Open and inspect:

- `/`
- `/booking`
- `/locations`
- `/locations/shegaon-bhakt-niwas`
- `/blog`
- one recent blog post

Expected:
- no broken hero/location images
- canonical tag present
- page title/description look correct

---

## 4) Structured data spot checks

Use Google's Rich Results Test on:

- homepage (Organization, WebSite)
- booking page (FAQ)
- location page (PlaceOfWorship, LocalBusiness, LodgingBusiness)

---

## 5) Search Console quick checks

- request indexing for homepage + one location + one blog post if major changes shipped
- ensure no new coverage errors
- confirm sitemap fetch success

---

## 6) Rollback criteria

Consider urgent rollback if:

- redirect loop detected
- robots/sitemap endpoint broken
- major routes return server errors
- canonical points to wrong host or environment
