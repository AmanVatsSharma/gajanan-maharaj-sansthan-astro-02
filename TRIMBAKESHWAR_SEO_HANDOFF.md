# Trimbakeshwar SEO Handoff — Search Console Resubmission

**Date:** 2026-06-21
**Cluster:** Trimbakeshwar (Jyotirlinga at Nashik, Maharashtra)
**Cluster commit:** `2c70b75` — feat(seo): consolidate Trimbakeshwar cluster to 19 canonical E-E-A-T articles + 101 301 redirects
**Follow-up commit:** vercel.json cleanup (removed self-redirect for `trimbakeshwar-first-time-visitor-guide`, repointed `trimbakeshwar-contact-and-support-guide` to a real canonical)

## Outcome

- **19 canonical high-E-E-A-T articles** retained on the live site and registered in `MANUAL_SEED_POST_PATHS`.
- **102 templated filler / duplicate posts** consolidated via 301 redirects in `vercel.json` (1 self-redirect was removed; the previously self-redirecting `trimbakeshwar-contact-and-support-guide` now points to a real canonical).
- **`npm run seo:ci` is fully green**: lint, build, blog-validate (0 errors), sitemap (748 URLs), rss (passed), robots (passed).

## Sitemap index

Submit the sitemap index URL first. It points at the sub-sitemaps the build emits:

```
https://www.srigajananmaharajsanstan.com/sitemap.xml
```

That index references (3 sub-sitemaps, ~748 URLs total).

## 19 canonical URLs to resubmit in Search Console (URL Inspection → Request Indexing)

All URLs use the production origin (`https://www.srigajananmaharajsanstan.com`) and lastmod = `2026-06-21`. These are the only Trimbakeshwar URLs that should be indexed going forward.

1. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-best-time-to-visit
2. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-bhakta-niwas-accommodation-guide
3. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-bhakta-niwas-booking-process
4. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-bhakta-niwas-refund-and-cancellation-guide
5. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-bhakta-niwas-whatsapp-message-template
6. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-brahmagiri-trek-guide
7. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-budget-pilgrimage-guide
8. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-canteen-and-mahaprasad-guide
9. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-darshan-timing-guide
10. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-family-yatra-planning
11. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-festival-advance-booking-window
12. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-first-time-visitor-guide
13. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-mahashivratri-booking-guide
14. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-nashik-trimbakeshwar-combo-guide
15. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-route-and-transport-options
16. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-sawan-monday-booking-strategy
17. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-senior-citizen-travel-tips
18. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-temple-complex-map-and-directions
19. https://www.srigajananmaharajsanstan.com/blog/trimbakeshwar-three-day-itinerary

> Verify the canonical origin in Search Console — the production site is `https://www.srigajananmaharajsanstan.com`. The earlier handoff draft had a `mharaj` typo; the verified spelling is `maharaj`.

## Search Console action plan (in order)

1. **Sitemaps → Add new sitemap** → `https://www.srigajananmaharajsanstan.com/sitemap.xml`
   - Google will re-crawl the index and pick up all 19 canonical URLs.
2. **URL Inspection → Request Indexing** for each of the 19 canonical URLs (10/day to stay under quota).
3. **Removals → Outdated content** → submit the 102 redirect-source URLs for temporary removal (Tools → Removals → "Remove this URL from search results and cache"). Pick "Temporarily remove" with a 6-month hold; this clears the old templated snippets while the 301s permanently redirect link equity. Full list below.
4. **Coverage → Excluded → "Crawled, currently not indexed"** should drop over the next 7–14 days as the redirects settle.

## The 102 redirect source URLs (for the Outdated Content removal request)

These are the old templated URLs that now 301 to a canonical destination. The full redirect map lives in `vercel.json` under `redirects`. Grouped by destination:

### → `/blog/trimbakeshwar-bhakta-niwas-accommodation-guide` (21 sources)

- /blog/trimbakeshwar-accommodation-near-temple
- /blog/trimbakeshwar-anand-sagar-visit-guide
- /blog/trimbakeshwar-anand-vihar-vs-visawa
- /blog/trimbakeshwar-bhakta-niwas-amenities-hot-water-and-services
- /blog/trimbakeshwar-bhakta-niwas-dormitory-vs-family-rooms
- /blog/trimbakeshwar-bhakta-niwas-facilities-and-amenities
- /blog/trimbakeshwar-bhakta-niwas-room-types-and-facilities
- /blog/trimbakeshwar-bhakta-niwas-vs-anand-vihar
- /blog/trimbakeshwar-buldhana-district-guide
- /blog/trimbakeshwar-buldhana-temple-stays
- /blog/trimbakeshwar-family-accommodation-checklist
- /blog/trimbakeshwar-five-day-extended-stay
- /blog/trimbakeshwar-math-stay-booking-tips
- /blog/trimbakeshwar-night-stay-checklist-for-devotees
- /blog/trimbakeshwar-omkareshwar-bhakt-niwas-guide
- /blog/trimbakeshwar-omkareshwar-temple-stay-tips
- /blog/trimbakeshwar-sheogaon-accommodation-guide
- /blog/trimbakeshwar-sheogaon-bhakta-niwas-facilities
- /blog/trimbakeshwar-triambakeshwar-jyotirlinga-stay
- /blog/trimbakeshwar-visawa-accommodation-tips
- /blog/trimbakeshwar-week-long-stay-planning

### → `/blog/trimbakeshwar-three-day-itinerary` (16 sources)

- /blog/trimbakeshwar-corporate-yatra-planning
- /blog/trimbakeshwar-four-day-itinerary
- /blog/trimbakeshwar-jyotirlinga-yatra-planning
- /blog/trimbakeshwar-local-markets-and-shopping
- /blog/trimbakeshwar-local-travel-checklist
- /blog/trimbakeshwar-maharashtra-temple-circuit
- /blog/trimbakeshwar-mobile-photography-tips
- /blog/trimbakeshwar-one-day-itinerary
- /blog/trimbakeshwar-pandharpur-wari-planning
- /blog/trimbakeshwar-photo-and-memory-planning
- /blog/trimbakeshwar-photography-tips-for-devotees
- /blog/trimbakeshwar-solo-traveler-guide
- /blog/trimbakeshwar-temple-circuit-extension-guide
- /blog/trimbakeshwar-two-day-itinerary
- /blog/trimbakeshwar-vidarbha-pilgrimage-planning
- /blog/trimbakeshwar-weekend-planning-guide

### → `/blog/trimbakeshwar-route-and-transport-options` (10 sources)

- /blog/trimbakeshwar-akola-to-shegaon-route
- /blog/trimbakeshwar-amravati-to-shegaon-route
- /blog/trimbakeshwar-jalgaon-pilgrimage-route
- /blog/trimbakeshwar-local-bus-and-auto-guide
- /blog/trimbakeshwar-nagpur-to-shegaon-route
- /blog/trimbakeshwar-parking-and-local-transport
- /blog/trimbakeshwar-pune-to-shegaon-route
- /blog/trimbakeshwar-sheogaon-travel-tips
- /blog/trimbakeshwar-train-and-bus-arrival-planning
- /blog/trimbakeshwar-weekend-getaway-from-mumbai

### → `/blog/trimbakeshwar-darshan-timing-guide` (8 sources)

- /blog/trimbakeshwar-darshan-queue-time-optimization
- /blog/trimbakeshwar-early-morning-darshan-tips
- /blog/trimbakeshwar-evening-aarti-timing-guide
- /blog/trimbakeshwar-evening-darshan-planning
- /blog/trimbakeshwar-late-evening-darshan-tips
- /blog/trimbakeshwar-morning-darshan-planning
- /blog/trimbakeshwar-triambakeshwar-darshan-tips
- /blog/trimbakeshwar-vitthal-darshan-timing-guide

### → `/blog/trimbakeshwar-best-time-to-visit` (8 sources)

- /blog/trimbakeshwar-monsoon-visit-guide
- /blog/trimbakeshwar-off-peak-visit-benefits
- /blog/trimbakeshwar-post-monsoon-visit-guide
- /blog/trimbakeshwar-rainy-season-visit-guide
- /blog/trimbakeshwar-seasonal-pilgrimage-calendar
- /blog/trimbakeshwar-spring-visit-guide
- /blog/trimbakeshwar-summer-visit-guide
- /blog/trimbakeshwar-winter-visit-guide

### → `/blog/trimbakeshwar-bhakta-niwas-booking-process` (7 sources)

- /blog/trimbakeshwar-bhakta-niwas-check-in-check-out-timings
- /blog/trimbakeshwar-bhakta-niwas-rules-and-conduct
- /blog/trimbakeshwar-bhakta-niwas-safety-and-security-guide
- /blog/trimbakeshwar-devotee-id-and-document-guide
- /blog/trimbakeshwar-group-darshan-booking
- /blog/trimbakeshwar-how-to-book-bhakta-niwas
- /blog/trimbakeshwar-temple-stay-rules-and-etiquette

### → `/blog/trimbakeshwar-senior-citizen-travel-tips` (5 sources — was 3, plus 2 added in cleanup)

- /blog/trimbakeshwar-contact-and-support-guide
- /blog/trimbakeshwar-devotee-faqs
- /blog/trimbakeshwar-emergency-contact-and-support
- /blog/trimbakeshwar-first-aid-and-safety
- /blog/trimbakeshwar-local-communication-and-helpline-tips

### → `/blog/trimbakeshwar-family-yatra-planning` (4 sources)

- /blog/trimbakeshwar-family-safety-and-comfort-tips
- /blog/trimbakeshwar-group-yatra-planning
- /blog/trimbakeshwar-kids-friendly-yatra-guide
- /blog/trimbakeshwar-multi-generation-family-yatra

### → `/blog/trimbakeshwar-festival-advance-booking-window` (5 sources)

- /blog/trimbakeshwar-festival-crowd-management-guide
- /blog/trimbakeshwar-festival-season-guide
- /blog/trimbakeshwar-holiday-rush-planning
- /blog/trimbakeshwar-new-year-darshan-planning
- /blog/trimbakeshwar-solar-eclipse-visit-guide

### → `/blog/trimbakeshwar-canteen-and-mahaprasad-guide` (4 sources)

- /blog/trimbakeshwar-bhakta-niwas-food-canteen-and-mahaprasad
- /blog/trimbakeshwar-flower-offering-guide
- /blog/trimbakeshwar-prasad-and-offerings-guide
- /blog/trimbakeshwar-temple-area-food-and-facilities

### → `/blog/trimbakeshwar-temple-complex-map-and-directions` (4 sources)

- /blog/trimbakeshwar-prayer-and-darshan-etiquette
- /blog/trimbakeshwar-sheogaon-temple-darshan-guide
- /blog/trimbakeshwar-temple-museum-and-heritage
- /blog/trimbakeshwar-bhakta-niwas-sheogaon-contact

### → `/blog/trimbakeshwar-budget-pilgrimage-guide` (2 sources)

- /blog/trimbakeshwar-packing-checklist
- /blog/trimbakeshwar-travel-insurance-for-pilgrimage

### → `/blog/trimbakeshwar-bhakta-niwas-whatsapp-message-template` (2 sources)

- /blog/trimbakeshwar-bhakta-niwas-online-booking-vs-whatsapp
- /blog/trimbakeshwar-booking-follow-up-and-confirmation-tips

### → `/blog/trimbakeshwar-mahashivratri-booking-guide` (1 source)

- /blog/trimbakeshwar-lunar-eclipse-darshan-tips

### → `/blog/trimbakeshwar-brahmagiri-trek-guide` (1 source)

- /blog/trimbakeshwar-nearby-attractions-day-trip

## Verification

After deployment to Vercel:

```bash
# Confirm 301 redirects
SEO_VERIFY_LIVE_REDIRECTS=true npm run verify:live-redirects

# Confirm sitemap still serves all 19 canonical URLs
npm run verify:sitemap

# Confirm CI gate is green
npm run seo:ci
```

Expected: 19 canonical URLs present in `dist/client/sitemap-blog.xml` with `<lastmod>2026-06-21</lastmod>`; 102 sources redirect with status `301` to a real destination (no self-redirects).

## Cluster commits

```
2c70b75 feat(seo): consolidate Trimbakeshwar cluster to 19 canonical E-E-A-T articles + 101 301 redirects
<follow-up>  fix(seo): remove first-time-visitor-guide self-redirect; repoint contact-and-support-guide
```

Co-Authored-By: Claude <noreply@anthropic.com>
