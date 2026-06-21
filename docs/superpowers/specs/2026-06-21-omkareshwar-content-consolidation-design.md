# Omkareshwar Content Consolidation — Design Spec

**Date:** 2026-06-21
**Status:** Approved by user
**Scope:** Omkareshwar blog cluster under `content/blog/locations/omkareshwar/` (131 posts) + Omkareshwar routes in `content/blog/guides/` (8 posts).

## Problem

Google is not indexing the Omkareshwar blog cluster. The user's hypothesis was "content was copied from another site." Diagnostic findings:

- Content is NOT copied from another site. It IS auto-generated from a single shared template.
- 119 of 131 Omkareshwar posts (91%) share an identical skeleton: same opening paragraph, same "When devotees search for terms like..." SEO filler, same 3-part "Darshan checklist", same 5-part "Location-specific tips", same boilerplate "Senior citizens / children should carry..." paragraphs, same 4-question FAQ, same closing signoff.
- All 131 posts use the same cover image (`/images/omkareshwar.svg`) — strongest auto-gen signal.
- All 131 posts have identical frontmatter description template.
- Author is "Sansthan" (a brand) — no E-E-A-T byline.
- 5-10 posts are genuinely excellent hand-written articles (best-time-to-visit, bhakta-niwas-accommodation-guide, darshan-timing-guide, festival-season-guide, room-types-and-facilities, etc.) — these are being dragged down by the templated mass.

**Mechanism:** Google helpful-content classifier works site-wide. The templated 119 trigger the "scaled content abuse" pattern from the March 2024 update, which downgrades the entire cluster's site-wide quality signal. The 10 good posts are pulled down with the 119 bad ones.

**Confirmed not a problem:** Sitemap host is correct (live fetch of `https://www.srigajananmaharajsanstan.com/sitemap.xml` returns proper canonical URLs). `PUBLIC_SITE_URL` is set on Vercel. Canonical tags, noindex, and robots are clean.

## Solution

**Consolidate 131 posts into 15 high-quality, unique articles** with proper E-E-A-T, unique cover images, and 301 redirects from the 116 redundant slugs.

### The 15 Canonical Articles

1. **omkareshwar-best-time-to-visit.md** — KEEP (already high-quality, 2026 calendar, climate-first view)
2. **omkareshwar-bhakta-niwas-accommodation-guide.md** — KEEP + ENRICH (full inventory table, tariffs, contact)
3. **omkareshwar-darshan-timing-guide.md** — KEEP + MERGE `omkareshwar-darshan-timings.md` into it
4. **omkareshwar-festival-season-guide.md** — KEEP + MERGE 5 seasonal guides
5. **omkareshwar-first-time-visitor-guide.md** — KEEP
6. **omkareshwar-route-and-transport-options.md** — REWRITE (consolidate 6 city routes)
7. **omkareshwar-three-day-itinerary.md** — REWRITE (consolidate 1/2/3/4/5-day itineraries)
8. **omkareshwar-bhakta-niwas-booking-process.md** — REWRITE (consolidate 8 booking/payment/cancellation/checkin posts)
9. **omkareshwar-canteen-and-mahaprasad-guide.md** — KEEP + ENRICH
10. **omkareshwar-weekend-getaway-from-mumbai.md** — KEEP
11. **omkareshwar-jyotirlinga-yatra-planning.md** — KEEP (Pandharpur/Trimbakeshwar combo)
12. **omkareshwar-senior-citizen-and-accessibility-guide.md** — REWRITE (consolidate 3 senior/wheelchair posts)
13. **omkareshwar-festival-advance-booking-guide.md** — REWRITE (crowd + booking window + peak season strategy)
14. **omkareshwar-prasad-and-darshan-etiquette.md** — REWRITE (prasad + etiquette + photography rules)
15. **omkareshwar-contact-and-emergency-support.md** — REWRITE (consolidate 4 contact/emergency/helpline posts)

### Redirect Mapping

For each of the 116 redundant slugs, add a 301 redirect to its canonical URL via `vercel.json`. Mapping rules:

- `omkareshwar-darshan-timings.md` → `omkareshwar-darshan-timing-guide`
- `omkareshwar-spring-visit-guide.md`, `omkareshwar-summer-visit-guide.md`, `omkareshwar-monsoon-visit-guide.md`, `omkareshwar-winter-visit-guide.md`, `omkareshwar-rainy-season-visit-guide.md`, `omkareshwar-post-monsoon-visit-guide.md` → `omkareshwar-festival-season-guide`
- `omkareshwar-akola-to-shegaon-route.md`, `omkareshwar-amravati-to-shegaon-route.md`, `omkareshwar-nagpur-to-shegaon-route.md`, `omkareshwar-pune-to-shegaon-route.md`, `omkareshwar-buldhana-district-guide.md`, `omkareshwar-jalgaon-pilgrimage-route.md` → `omkareshwar-route-and-transport-options`
- All other 100+ redundant slugs → their best-fit canonical article (full mapping in implementation plan)

### E-E-A-T improvements

- Add author byline "Sansthan Communications Team, reviewed by [Real Name, Office Manager]" with bio, photo, contact email on the rendered blog post template.
- Update frontmatter `author` field from `"Sansthan"` to a real name.
- Add `authorBio`, `authorRole`, `lastReviewedAt` fields to blog frontmatter schema.

### Cover images

- Replace single shared `/images/omkareshwar.svg` with unique per-post hero images (procedurally generated SVG variants, or a small set of 5-6 well-chosen Sansthan-provided photos).
- For 15 canonical posts, ship 15 unique hero images.

### Sitemap & Search Console

- `npm run seo:ci` must pass green after rewrites.
- Regenerate sitemap → confirm all URLs on `https://www.srigajananmaharajsanstan.com`.
- Provide user with Search Console resubmit list of 15 canonical URLs.

## Out of Scope

- Shegaon, Pandharpur, Trimbakeshwar blog clusters — separate project, same template pattern likely exists. To be addressed in a follow-up spec.
- src/lib/seo/site-url.ts runtime guard — separate small P0.5 task.
- New design / UI changes.
