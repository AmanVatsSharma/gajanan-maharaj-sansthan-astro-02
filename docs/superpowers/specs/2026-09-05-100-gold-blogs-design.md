# Design: 100 Gold-Standard SEO Blog Posts — Gajanan Maharaj Sansthan

**Date:** 2026-09-05
**Status:** Approved (user selections: hand-crafted gold standard; booking-intent weighted; English; 1,800–2,500 words)
**Goal:** Rank top on Google for `gajanan maharaj sansthan` brand queries across Shegaon, Pandharpur, Omkareshwar, Trimbakeshwar, and online room booking intents.

---

## 1. Background & Gap Analysis

The blog currently holds **661 posts**: 591 template-generated (programmatic, tracked in `content/blog/_ops/generated-seo-cluster-manifest.json`) plus ~70 manual seed posts. Audit findings:

1. **The exact money keyword** — *"gajanan maharaj sansthan online room booking"* — has **no dedicated article**. The closest (`guides/how-to-book-bhakta-niwas-online.md`) is 1,121 words with content mismatched to its title.
2. **Shegaon and Pandharpur booking-topic gaps**: Omkareshwar and Trimbakeshwar clusters include check-in/check-out timings, refund/cancellation, dormitory-vs-family, online-vs-whatsapp, room types & facilities, common booking mistakes — **Shegaon and Pandharpur lack nearly all of these** despite Shegaon being the brand home.
3. **Scaled-content risk**: 591 structurally identical posts. Adding more templated content increases helpful-content-system risk; 100 genuinely unique articles raises domain-wide quality signal.

**Decision (user-selected):** all 100 posts hand-crafted gold standard, individually written, no template spinning.

## 2. Distribution (100 posts)

| Bucket | Directory | Count | Focus |
|---|---|---|---|
| Brand + Booking Hub | `content/blog/guides/` | 28 | Brand + money keywords: online room booking, phone/WhatsApp booking, payment, confirmation, availability, room types |
| Shegaon | `content/blog/locations/shegaon/` | 18 | Booking gap-fills + brand-home temple content |
| Pandharpur | `content/blog/locations/pandharpur/` | 14 | Booking gap-fills + wari/Vitthal stay planning |
| Omkareshwar | `content/blog/locations/omkareshwar/` | 14 | Booking combos + jyotirlinga stay angles |
| Trimbakeshwar | `content/blog/locations/trimbakeshwar/` | 14 | Pooja-linked stay booking + city-pair travel |
| Brand spiritual authority | `content/blog/spiritual/` | 12 | Gajanan Maharaj brand-term capture (jayanti, miracles, granth, seva) |

Booking-intent total ≈ 38/100. Every post includes a `/booking` (or `/contact`) conversion link.

## 3. Gold-Standard Post Format

### Frontmatter (exact schema, matches validator)

```yaml
---
title: "Keyword-First Title | Shri Gajanan Maharaj Sansthan"   # ≤60 chars ideal
description: "150–160 char meta description with CTA"           # answer + brand
date: "YYYY-MM-DD"                                               # staggered 2026-06-01..2026-09-04, never future
slug: "<matches-filename-exactly>"
image: "/images/<location>.svg"                                  # existing site images only
keywords: [5–7 phrases, primary keyword first, include brand variants]
author: "Sansthan"
tags: [4 tags, incl. location + intent tags]
category: "guides|locations|spiritual|events"                    # must match directory
locationIds: [from known set: shegaon-bhakt-niwas, shegaon-anand-vihar, shegaon-visawa, pandharpur-math, trimbakeshwar, omkareshwar]
relatedSlugs: [8–10 existing post slugs — verified to exist]
---
```

### Body structure (unique per post — no shared skeletons)

1. H1 with primary keyword → **answer-first intro** (query fully answered in ≤100 words)
2. 6–9 H2 sections varying by post: comparison tables, tariff tables, timing tables, step-by-step numbered flows, festival calendars, checklists
3. 4–6 FAQ H3s (real devotee questions, concise answers)
4. Closing CTA block: `/booking` link + related guides
5. ≥5 internal links: ≥1 `/locations/*`, ≥1 `/booking` or `/contact`, ≥3 `/blog/*` (all targets must exist — no 404s)
6. 1,800–2,500 words. Factual anchors from `src/data/sansthan-data.ts`, `rooms.ts`, `festivals.ts`, `faq.ts` and existing posts — **no invented facts, tariffs, or phone numbers**. Contact numbers: use the site-wide configured number only as rendered by existing contact config.

### Validator-verified hard constraints (from `scripts/validate-blog-content.mjs`)

1. **Zero orphan posts allowed** (`MAX_ALLOWED_ORPHAN_POSTS = 0`): every new post must receive ≥1 inbound `/blog/<slug>` link from another post. → Each new post links to ≥2 sibling posts from this batch, and hub posts (`guides/`) link to their location-cluster counterparts. Batch interlinking is designed at batch level before writing.
2. **Primary keyword uniqueness**: `keywords[0]` must be unique across all 761 posts (duplicate = hard failure). → Collision check includes primary keywords of existing posts (normalized lowercase).
3. **Valid `/locations/` link targets — exactly 6 paths**: `/locations/shegaon-bhakt-niwas`, `/locations/shegaon-anand-vihar`, `/locations/shegaon-visawa`, `/locations/pandharpur-math`, `/locations/trimbakeshwar`, `/locations/omkareshwar`. Any other `/locations/*` path is a hard failure.
4. **relatedSlugs and `/blog/*` link targets must exist** as slugs (hard failure otherwise) — build link lists only from verified inventory.
5. Future-dated posts trigger warnings; dates stay ≤ 2026-09-04.
6. `relatedSlugs.length ≥ 2` and `keywords.length ≥ 3` (warnings; treated as failures for this batch).

### Quality bar (E-E-A-T)

- No two posts share opening-paragraph structure verbatim
- Each post = one primary keyword + 2 secondary keyword variants (Shri/Shree/Sri brand permutations per `src/lib/seo/constants.ts`)
- Devotee-service voice ("Sansthan digital desk"), first-person-plural editorial framing
- British-Indian English spelling consistent with existing posts

## 4. Integration Mechanics

1. Files live in managed-namespace directories (`locations/{shegaon,omkareshwar,pandharpur,trimbakeshwar}/`, `guides/`, `spiritual/`, `events/`).
2. **All 100 relative paths must be appended to `MANUAL_SEED_POST_PATHS` in `scripts/seo-cluster-config.mjs`** (commented block "2026-09-05 gold-standard batch") — otherwise `verify-generated-cluster-manifest.mjs` fails with `managed-namespace-untracked-files`.
3. Generator and manifest stay untouched — no regeneration; zero risk to 591 generated posts.
4. Slug collision check (against all 661 existing slugs + within-batch) runs **before** any file is written.
5. Dates: staggered across 2026-06-01 → 2026-09-04 (past-dated, natural cadence, ~1 post/day equivalent).

## 5. Topic Map (single source of truth — 100 posts)

Slugs are kebab-case, directory-prefixed. **Implementation step 1 verifies zero collisions; any collision is renamed before writing.**

### guides/ — Brand + Booking Hub (28)

| # | Slug | Primary keyword / angle |
|---|---|---|
| 1 | gajanan-maharaj-sansthan-online-room-booking | gajanan maharaj sansthan online room booking (exact money keyword) |
| 2 | gajanan-maharaj-sansthan-room-booking-phone-number | gajanan maharaj sansthan room booking number |
| 3 | gajanan-maharaj-sansthan-room-booking-whatsapp-guide | sansthan room booking WhatsApp |
| 4 | bhakta-niwas-room-availability-check-guide | bhakta niwas room availability |
| 5 | bhakta-niwas-booking-payment-methods-guide | bhakta niwas payment UPI/card |
| 6 | bhakta-niwas-booking-confirmation-process | room booking confirmation process |
| 7 | bhakta-niwas-booking-advance-amount-guide | advance payment for room booking |
| 8 | bhakta-niwas-ac-room-booking-guide | AC room in bhakta niwas |
| 9 | bhakta-niwas-family-room-booking-guide | family room booking sansthan |
| 10 | bhakta-niwas-dormitory-booking-guide | dormitory booking cheap stay |
| 11 | bhakta-niwas-room-booking-for-weekend | weekend room booking sansthan |
| 12 | bhakta-niwas-same-day-booking-guide | same day room booking |
| 13 | bhakta-niwas-booking-modification-guide | change booking dates sansthan |
| 14 | bhakta-niwas-booking-rules-and-terms | bhakta niwas rules |
| 15 | bhakta-niwas-vs-hotels-comparison | bhakta niwas vs hotel |
| 16 | bhakta-niwas-vs-ota-direct-booking | direct booking vs MakeMyTrip/OTA |
| 17 | sansthan-room-booking-for-senior-citizens | senior citizen room booking |
| 18 | sansthan-room-booking-id-and-document-requirements | ID proof for temple room booking |
| 19 | sansthan-room-booking-with-darshan-combo | room + darshan combo plan |
| 20 | bhakta-niwas-check-in-process-all-locations | check in process bhakta niwas |
| 21 | bhakta-niwas-room-booking-calendar | month-wise room booking calendar |
| 22 | sansthan-room-booking-mistakes-to-avoid | room booking mistakes |
| 23 | bhakta-niwas-long-stay-room-booking-rules | long stay / extended booking rules |
| 24 | sansthan-canteen-mahaprasad-with-room-booking | room booking with mahaprasad |
| 25 | bhakta-niwas-room-booking-with-elderly-parents | booking rooms for parents |
| 26 | sansthan-room-booking-safety-and-security-guide | safe stay for women & families |
| 27 | bhakta-niwas-booking-customer-support-guide | booking help / support escalation |
| 28 | sansthan-four-location-room-booking-overview | one guide: rooms at all 4 locations |

### locations/shegaon/ — Brand Home (18)

| # | Slug | Angle |
|---|---|---|
| 29 | shegaon-bhakta-niwas-check-in-check-out-timings | gap-fill: check-in/out (Om/Tr have it) |
| 30 | shegaon-bhakta-niwas-online-booking-vs-whatsapp | gap-fill |
| 31 | shegaon-bhakta-niwas-refund-and-cancellation-guide | gap-fill |
| 32 | shegaon-bhakta-niwas-dormitory-vs-family-rooms | gap-fill |
| 33 | shegaon-bhakta-niwas-room-types-and-facilities | gap-fill |
| 34 | shegaon-bhakta-niwas-common-booking-mistakes | gap-fill |
| 35 | shegaon-room-booking-near-samadhi-mandir | room near temple |
| 36 | shegaon-bhakta-niwas-booking-confirmation-timeline | how fast confirmation arrives |
| 37 | shegaon-visawa-room-booking-guide | Visawa location (locationId exists) |
| 38 | shegaon-room-booking-during-ekadashi-and-festivals | ekadashi rush booking |
| 39 | shegaon-bhakta-niwas-advance-payment-guide | gap-fill (Om-only today) |
| 40 | shegaon-same-day-room-booking-options | today/tonight booking |
| 41 | shegaon-gajanan-maharaj-temple-complete-visitor-guide | pillar: brand + temple |
| 42 | shegaon-train-timings-and-stay-planning | arrival times + first-night room |
| 43 | shegaon-one-day-vs-two-day-visit-planning | trip-length decision guide |
| 44 | shegaon-family-trip-itinerary-with-room-booking | family itinerary + stay |
| 45 | shegaon-darshan-and-stay-same-trip-planning | darshan schedule around stay |
| 46 | shegaon-nearby-devasthan-visit-with-overnight-stay | day trips + overnight base |

### locations/pandharpur/ — Wari & Vitthal Stay (14)

| # | Slug | Angle |
|---|---|---|
| 47 | pandharpur-bhakta-niwas-check-in-check-out-timings | gap-fill |
| 48 | pandharpur-bhakta-niwas-online-booking-vs-whatsapp | gap-fill |
| 49 | pandharpur-bhakta-niwas-refund-and-cancellation-guide | gap-fill |
| 50 | pandharpur-bhakta-niwas-dormitory-vs-family-rooms | gap-fill |
| 51 | pandharpur-bhakta-niwas-room-types-and-facilities | gap-fill |
| 52 | pandharpur-bhakta-niwas-common-booking-mistakes | gap-fill |
| 53 | pandharpur-wari-accommodation-booking-guide | wari accommodation |
| 54 | pandharpur-ashadhi-ekadashi-room-booking | Ashadhi Ekadashi rooms (booking focus) |
| 55 | pandharpur-vitthal-rukmini-darshan-and-stay-plan | darshan + stay |
| 56 | pandharpur-chandrabhaga-snana-and-stay-planning | Chandrabhaga ritual + stay |
| 57 | pandharpur-room-booking-near-vitthal-temple | rooms near temple |
| 58 | pandharpur-kartik-ekadashi-stay-booking | Kartik Ekadashi rooms |
| 59 | pandharpur-math-bhakta-niwas-complete-guide | pillar: Pandharpur Math |
| 60 | pandharpur-two-day-itinerary-with-overnight-stay | itinerary + stay |

### locations/omkareshwar/ — Jyotirlinga Stay (14)

| # | Slug | Angle |
|---|---|---|
| 61 | omkareshwar-ac-room-booking-guide | AC rooms |
| 62 | omkareshwar-jyotirlinga-darshan-and-room-booking-combo | darshan + room combo |
| 63 | omkareshwar-room-booking-from-indore | Indore departure planning |
| 64 | omkareshwar-mandhata-island-stay-guide | island stay uniqueness |
| 65 | omkareshwar-family-room-booking-guide | family rooms |
| 66 | omkareshwar-group-room-booking-guide | group stay (distinct from group-darshan) |
| 67 | omkareshwar-winter-devotee-stay-guide | Nov–Feb season |
| 68 | omkareshwar-darshan-queue-and-stay-timing-plan | queue timing vs stay |
| 69 | omkareshwar-one-night-stay-plan | overnight plan |
| 70 | omkareshwar-room-booking-with-elderly-devotees | elderly access |
| 71 | omkareshwar-narmada-parikrama-stay-planning | parikrama (multi-day walk) base |
| 72 | omkareshwar-mahashivratri-room-booking | Shivratri rooms (Om lacks it) |
| 73 | omkareshwar-first-timer-stay-and-darshan-plan | first-timer pillar |
| 74 | omkareshwar-sawan-room-availability-guide | Sawan availability (distinct from strategy post) |

### locations/trimbakeshwar/ — Pooja Stay (14)

| # | Slug | Angle |
|---|---|---|
| 75 | trimbakeshwar-narayan-nagbali-pooja-stay-booking | pooja + stay booking |
| 76 | trimbakeshwar-kaal-sarp-dosh-pooja-and-stay-plan | dosh pooja + stay |
| 77 | trimbakeshwar-kumbh-mela-nashik-stay-guide | Nashik-Trimbak Simhastha (timely) |
| 78 | trimbakeshwar-room-booking-near-temple-walking-distance | walking-distance rooms |
| 79 | trimbakeshwar-monsoon-visit-and-room-booking | monsoon travel |
| 80 | trimbakeshwar-ac-room-booking-guide | AC rooms |
| 81 | trimbakeshwar-family-room-booking-with-kids | kids + family |
| 82 | trimbakeshwar-accessible-room-booking | wheelchair/elder access |
| 83 | trimbakeshwar-darshan-queue-timing-and-stay-plan | queue vs stay timing |
| 84 | trimbakeshwar-one-night-stay-before-pooja | early-morning pooja intent |
| 85 | trimbakeshwar-mumbai-devotees-weekend-stay-plan | Mumbai weekend market |
| 86 | trimbakeshwar-pune-devotees-travel-and-stay-plan | Pune market |
| 87 | trimbakeshwar-diwali-and-winter-stay-guide | Diwali/winter season |
| 88 | trimbakeshwar-bhakta-niwas-devotee-experience-tips | devotee-experience angle |

### spiritual/ — Brand Authority (12)

| # | Slug | Angle |
|---|---|---|
| 89 | gajanan-maharaj-jayanti-celebration-guide | Jayanti (brand event search) |
| 90 | gajanan-maharaj-miracles-stories | miracles (high-volume brand search) |
| 91 | gajanan-maharaj-bhajans-collection | bhajans |
| 92 | gajanan-maharaj-chaturmas-guide | Chaturmas observance |
| 93 | gajanan-maharaj-punyatithi-guide | Punyatithi |
| 94 | shegaon-aarti-timings-daily-schedule | daily aarti timings |
| 95 | gajanan-maharaj-doha-chaupai-meaning | doha/chaupai from Gajanan Vijay |
| 96 | gajanan-maharaj-life-lessons-guide | life lessons (a generated teachings post already exists — link to it) |
| 97 | gajanan-maharaj-and-dattatreya-tradition | Datta-tradition connection |
| 98 | gajanan-maharaj-bhakti-vidarbha-legacy | Vidarbha bhakti legacy |
| 99 | reading-gajanan-vijay-for-beginners | beginner granth guide |
| 100 | gajanan-maharaj-seva-opportunities-guide | seva participation |

## 6. Production Process

1. **Collision check script** (one-off, temp): verify all 100 slugs against existing 661 + within batch, and all 100 primary keywords against existing posts' `keywords[0]` (normalized); abort on collision.
2. **Interlink plan per batch**: each batch of 10 defines ≥2 inbound links for every member (sibling cross-links + hub→location links) before writing, guaranteeing zero orphans.
3. **Topic metadata file** `content/blog/_ops/gold-standard-batch-2026-09.json` (in `_ops`, ignored by inventory): slug, dir, category, locationIds, date, primary keyword, status. Enables batch tracking and resume.
4. **Write in 10 batches × 10 posts.** After each batch: run `node scripts/validate-blog-content.mjs`; fix all errors (and any warnings) before proceeding.
5. Update `MANUAL_SEED_POST_PATHS` incrementally per batch (keeps every intermediate state green).
6. **Final verification (all must pass):**
   - `node scripts/validate-blog-content.mjs` — 761 posts, 0 errors
   - `node scripts/verify-manual-seed-posts.mjs` — all seeds valid
   - `node scripts/verify-generated-cluster-manifest.mjs` — no untracked files
   - `npm run build` — prerender succeeds
   - `npm run verify:sitemap && npm run verify:rss && npm run verify:robots`
   - Spot-check: new posts appear in sitemap.xml; relatedSlugs resolve (no broken internal links)
7. Commit in per-batch commits (`feat(blog): gold-standard batch N/10 — <bucket>`) + final config commit.

## 7. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Slug collision with 661 existing | Automated check before writing; abort on conflict |
| Broken internal links (relatedSlugs/targets don't exist) | Only link to slugs verified from inventory; validator catches <3 links |
| Untracked-file manifest failure | Register each batch in `MANUAL_SEED_POST_PATHS` immediately |
| Duplicate-content perception vs template posts | Unique structure per post; gap-fill slugs may mirror Om/Tr names but bodies are fully original & deeper |
| Factual drift (tariffs, timings) | Anchor to `src/data/*.ts` and existing posts; avoid absolute claims where data absent — use guidance framing |
| Word-count thinness | Target ≥1,800; validator warns <1,500 — treat warnings as failures in this batch |

## 8. Out of Scope

- No changes to generator templates, cluster targets, or manifest
- No Marathi/Hindi content, no hreflang infrastructure
- No UI/layout changes; no new pages outside `/blog/*`
- No modification of the 591 generated posts or existing manual seeds
