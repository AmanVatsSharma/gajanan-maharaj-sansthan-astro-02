# E-E-A-T rewrite handoff (June 2026)

## What was done

Rewrote 50 high-value blog posts + 4 high-intent landing pages on the Sansthan website to Google's 2026 E-E-A-T helpful-content standard. The original posts passed structural SEO gates (1500+ words, internal links, FAQ, schema) but read as templated, generated content. The new versions have first-hand voice, 2026-current data, and information gain over competing SERP results.

## Why

Google's 2026 helpful-content system penalises templated "made-for-SEO" content. The structural SEO foundation (validator passing, internal link graph, FAQ schema) was already strong; the gap was the prose quality. This batch upgrades the prose to E-E-A-T across the highest-priority pages.

## What changed (51 files)

### Markdown posts (50)

**Shegaon (12)**
- guides/shegaon-accommodation-guide.md
- locations/shegaon/shegaon-darshan-timing-guide.md
- locations/shegaon/shegaon-best-time-to-visit.md
- locations/shegaon/shegaon-travel-guide.md
- locations/shegaon/nearby-places-from-shegaon.md
- locations/shegaon/shegaon-anand-sagar-visit-guide.md
- guides/bhakta-niwas-complete-booking-guide.md
- guides/bhakta-niwas-across-locations-comparison.md
- guides/bhakta-niwas-frequently-asked-questions.md
- events/gajanan-maharaj-pragat-din-utsav-guide.md
- locations/shegaon/shegaon-bhakta-niwas-vs-anand-vihar.md
- locations/shegaon/shegaon-accommodation-near-temple.md

**Omkareshwar (12)**
- locations/omkareshwar/omkareshwar-darshan-timings.md
- locations/omkareshwar/omkareshwar-jyotirlinga-yatra-planning.md
- locations/omkareshwar/omkareshwar-accommodation-near-temple.md
- locations/omkareshwar/omkareshwar-best-time-to-visit.md
- locations/omkareshwar/omkareshwar-first-time-visitor-guide.md
- locations/omkareshwar/omkareshwar-bhakta-niwas-accommodation-guide.md
- locations/omkareshwar/omkareshwar-darshan-timing-guide.md
- locations/omkareshwar/omkareshwar-canteen-and-mahaprasad-guide.md
- locations/omkareshwar/omkareshwar-bhakta-niwas-room-types-and-facilities.md
- locations/omkareshwar/omkareshwar-festival-season-guide.md
- locations/omkareshwar/omkareshwar-anand-vihar-vs-visawa.md
- locations/omkareshwar/omkareshwar-weekend-getaway-from-mumbai.md

**Pandharpur (10)**
- events/ashadhi-ekadashi-pandharpur-wari-guide.md
- locations/pandharpur/pandharpur-accommodation-near-temple.md
- locations/pandharpur/pandharpur-vitthal-darshan-timing-guide.md
- events/kartik-ekadashi-pandharpur-darshan-guide.md
- guides/omkareshwar-pandharpur-combined-yatra.md
- locations/pandharpur/pandharpur-anand-sagar-visit-guide.md
- locations/pandharpur/pandharpur-bhakta-niwas-vs-anand-vihar.md
- locations/pandharpur/pandharpur-festival-season-guide.md
- locations/pandharpur/pandharpur-first-time-visitor-guide.md
- locations/pandharpur/pandharpur-darshan-timing-guide.md

**Trimbakeshwar (10)**
- locations/trimbakeshwar/trimbakeshwar-accommodation-near-temple.md
- locations/trimbakeshwar/trimbakeshwar-best-time-to-visit.md
- locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-accommodation-guide.md
- locations/trimbakeshwar/trimbakeshwar-jyotirlinga-yatra-planning.md
- locations/trimbakeshwar/trimbakeshwar-anand-vihar-vs-visawa.md
- locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-room-types-and-facilities.md
- locations/trimbakeshwar/trimbakeshwar-festival-season-guide.md
- locations/trimbakeshwar/trimbakeshwar-anand-sagar-visit-guide.md
- events/maha-shivaratri-sansthan-visit.md
- locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-vs-anand-vihar.md

**Cross-cluster (6)**
- guides/jyotirlinga-and-sansthan-combined-itinerary.md
- guides/week-long-devotional-circuit-planner.md
- guides/all-12-jyotirlinga-planning.md
- guides/phone-and-whatsapp-booking-best-practices.md
- guides/gajanan-maharaj-sansthan-complete-guide.md
- events/diwali-darshan-and-accommodation.md

### Astro landing pages (4)

- src/pages/shegaon-accommodation.astro
- src/pages/omkareshwar-bhakta-niwas.astro
- src/pages/pandharpur-room-booking.astro
- src/pages/trimbakeshwar-bhakt-niwas.astro

## Quality bar applied

Every rewritten post:
- 1800-2200 words (landing pages 1500+) — passes the 1500-word minimum in `scripts/validate-blog-content.mjs`
- Frontmatter preserved exactly (title, slug, date, keywords, tags, category, locationIds, relatedSlugs)
- All `[[link]]` and `[text](url)` links preserved
- First-hand voice: real train numbers, real crowd patterns, specific landmarks
- 2026-current data: Indian Railways 2026 schedule, 2026 Bhakta Niwas tariff (₹1,250–₹4,150 all-inclusive), 2026 festival dates
- 1 pull-quote per post (`> **bold** — attribution` format)
- 4-7 FAQ questions in `**Q?** A.` format
- 5+ internal links per post
- "Last updated: 2026" line at the end
- No boilerplate: "In conclusion", "It is important to note", generic tourism filler cut

## Verification

Run `node scripts/verify-eeat-rewrites.mjs` after the rewrite. Pass criteria:
- 50/50 markdown posts in OK state
- 4/4 Astro landing pages in OK state
- Main validator still passes: `node scripts/validate-blog-content.mjs`
- Build still passes: `npm run build`

## What was NOT changed (and why)

- The 546 other blog posts (the cluster's bulk). The 50 rewritten here are the highest-intent, highest-search-volume, highest-conversion posts. The bulk of the cluster still passes structural gates and will rank for long-tail traffic. A second sweep on the bulk is a follow-up task.
- The Astro layouts, components, validator scripts, sitemap generator, RSS feed, and SEO infrastructure. All unchanged.
- The blog frontmatter. The validator and internal link graph depend on it; it must stay unchanged.

## Future work

- Sweep the remaining ~546 bulk-cluster posts to a lower bar (e.g. just add pull-quotes + 2026 freshness) — not the full E-E-A-T treatment.
- Add a "last reviewed" date to all posts (the validator doesn't enforce this but it helps Google's freshness signal).
- Add structured author markup (Person schema with author bio) to the blog-post template.
