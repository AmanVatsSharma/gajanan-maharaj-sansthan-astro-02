# FULL SELF-CONTAINED BRIEF — Trimbakeshwar SEO consolidation

> **Purpose:** This file is the *entire* context for a new Claude/AI agent session. It contains the codebase map, the problem diagnosis, the exact format the rewrites must follow, the validator rules, and the step-by-step procedure. **Do not assume any prior conversation.** Read CLAUDE.md first, then this file, then start work.

---

## 0. Read these files FIRST (in this exact order)

1. **`CLAUDE.md`** (project root) — repo commands, architecture, path aliases.
2. **`src/data/sansthan-data.ts`** — the Sansthan's static data. Trimbakeshwar entry will tell you rooms, contact phone, address, GPS pin.
3. **`src/data/rooms.ts`** — Bhakta Niwas room types and 2026 tariffs.
4. **`scripts/validate-blog-content.mjs`** — the validator that enforces every SEO/content rule below. Read lines 1-200, then lines 600-700 for the link/FAQ checks.
5. **`scripts/seo-cluster-config.mjs`** — `LOCATION_CLUSTER_TARGETS` (you'll see Trimbakeshwar target is 115 posts), and `MANUAL_SEED_POST_PATHS`.
6. **`content/blog/_ops/generated-seo-cluster-manifest.json`** — current generated manifest. You must keep this in sync.
7. **All 7 newly-written Omkareshwar articles** under `content/blog/locations/omkareshwar/`:
   - `omkareshwar-best-time-to-visit.md`
   - `omkareshwar-darshan-timing-guide.md`
   - `omkareshwar-temple-complex-map-and-directions.md`
   - `omkareshwar-first-time-visitor-guide.md`
   - `omkareshwar-bhakta-niwas-accommodation-guide.md`
   - `omkareshwar-three-day-itinerary.md`
   - `omkareshwar-route-and-transport-options.md`
   - `omkareshwar-nearby-attractions-day-trip.md`
   - `omkareshwar-bhakta-niwas-booking-process.md`
   - `omkareshwar-parking-and-local-transport.md`
   - `omkareshwar-local-bus-and-auto-guide.md`
   - `omkareshwar-prasad-and-darshan-etiquette.md`
   - `omkareshwar-senior-citizen-and-accessibility-guide.md`
   - `omkareshwar-festival-advance-booking-guide.md`
   - `omkareshwar-family-yatra-planning.md`
   - `omkareshwar-sawan-monday-booking-strategy.md`
   - `omkareshwar-ujjain-mahakaleshwar-two-day-combo.md`
   - `omkareshwar-12-jyotirlinga-yatra-plan.md`
   - `omkareshwar-kartik-purnima-booking-guide.md`
   - `omkareshwar-bhakta-niwas-room-photo-tour.md`
   - `omkareshwar-bhakta-niwas-advance-payment-guide.md`
   - `gajanan-maharaj-omkareshwar-combined-yatra-7-day.md`

   **These are your template.** Mirror their structure exactly.

8. **`vercel.json`** — existing redirects. Note the Omkareshwar 301 entries (129 of them); you'll mirror this pattern for Trimbakeshwar.

---

## 1. Project context (so you understand the codebase)

This is the **Shri Gajanan Maharaj Sansthan** official website. The Sansthan operates the Shegaon Gajanan Maharaj temple (headquarters) and supports three Jyotirlinga Bhakta Niwas pilgrim lodges at:

- **Omkareshwar** (Madhya Pradesh, Khandwa district) — island temple in the Narmada
- **Trimbakeshwar** (Maharashtra, Nashik district) — origin of the Godavari
- **Pandharpur** (Maharashtra, Solapur district) — Vithoba temple

Plus the Shegaon headquarters.

**Tech stack:**
- Astro 5 (file-based routing)
- React 19 islands
- Tailwind CSS 4
- Deployed on Vercel (adapter: `@astrojs/vercel`)
- Content: markdown in `content/blog/**/*.md`, ingested at build time via `gray-matter`
- SEO engine: `src/lib/seo/` — JSON-LD schema (30+ types), canonical, OG, Twitter cards
- Middleware: `src/middleware.ts` — canonical host redirect (apex → www)

**File-system layout (relevant):**

```
src/
  pages/
    index.astro                  # Homepage
    blog/
      [slug].astro               # Blog post renderer
      category/, tag/, page/     # Taxonomy
    locations/
      [id].astro                 # Location detail page
    booking/index.astro
    contact.astro
    sitemap.xml.ts               # Dynamic sitemap endpoint
    feed.xml.ts                  # Dynamic RSS endpoint
    robots.txt.ts                # Dynamic robots.txt

  components/
    layout/Navbar.tsx, Footer.tsx
    seo/HeadTags.astro
    features/                    # Domain-sliced modules
    lib/
      seo/                       # SEO engine (metadata, structured-data)
      blog/                      # Blog ingestion
    data/
      sansthan-data.ts           # Locations, facilities, contact info
      rooms.ts                   # Bhakta Niwas room types
      festivals.ts
      testimonials.ts
      faq.ts

content/
  blog/
    events/                      # *.md event posts
    guides/                      # *.md guide posts
    spiritual/                   # *.md spiritual posts
    locations/
      omkareshwar/               # ~150 markdown files
      trimbakeshwar/             # ~115 markdown files (YOUR FOCUS)
      shegaon/                   # ~30 markdown files
      pandharpur/                # ~25 markdown files
    _ops/generated-seo-cluster-manifest.json   # Generated, don't hand-edit

scripts/
  validate-blog-content.mjs      # The validator (ENFORCES all rules)
  seo-cluster-config.mjs         # Cluster targets + manual seed list
  update-blog-checksums.mjs      # Realigns manifest checksums
  verify-sitemap-policy.mjs
  verify-rss-policy.mjs
  verify-robots-policy.mjs
  verify-blog-content.mjs        # Wraps validate-blog-content.mjs
  verify-live-redirects.mjs      # Optional live check

vercel.json                      # Production redirects
```

---

## 2. THE PROBLEM (what we're solving)

The Trimbakeshwar cluster currently has ~115 markdown files in `content/blog/locations/trimbakeshwar/`. Most are **templated filler** that Google has flagged as "scaled content" (the algorithm's penalised pattern). Symptoms:

- **~80–100 city-specific route posts**: `trimbakeshwar-from-mumbai.md`, `trimbakeshwar-from-pune.md`, `trimbakeshwar-from-nagpur.md`, … 70+ more. Each is 400–600 words of templated "drive to Nashik, then local bus" content.
- **Duplicate-route slugs**: `trimbakeshwar-temple.md`, `trimbakeshwar-temple-complex.md`, `trimbakeshwar-route-and-transport-options.md` — same content under different slugs.
- **Templated filler phrases** that Google detects (these must NEVER appear in the rewrites):
  - "book via website"
  - "verify timings"
  - "Sansthan run by devotees"
  - "contact us for more details"
  - "we are committed to providing"
  - "please do not hesitate"
- **Missing E-E-A-T signals**: no real 2026 fares, no first-person Sansthan-office voice, no internal cross-links, no relatedSlugs, no real visitor quotes.
- **Orphan posts**: many trimbakeshwar posts are not linked from anywhere; validator will error.

**Why this hurts SEO:** Google has been de-indexing templated location-cluster content across Indian pilgrim sites since the March 2024 "scaled content" update. Our Omkareshwar cluster was hit; the Trimbakeshwar cluster has the same pattern and is at risk.

**The fix (what worked for Omkareshwar):** consolidate the 115 into ~15–18 unique, high-E-E-A-T articles that cover the same topics with original, detailed, first-person Sansthan-office content. 301-redirect every duplicate to its canonical post.

---

## 3. THE TARGET — 15–18 unique Trimbakeshwar articles

Based on the topic clustering of the existing 115 posts, these are the canonical topics you must cover (you can rename or add/remove with user approval):

### Tier 1 — Core darshan/accommodation/transport (rewrite first, in this order)

1. **`trimbakeshwar-best-time-to-visit.md`** — when to come, weather by month, Shahi Snan dates 2026, Mahashivratri, Mondays of Shravan
2. **`trimbakeshwar-darshan-timing-guide.md`** — kakad aarti, Madhyan aarti, Sandhya aarti, the special pujas, queue patterns
3. **`trimbakeshwar-temple-complex-map-and-directions.md`** — Kushavarta Kund, three-faced Shiva, the 5-lingams, the 12 Jyotirlinga significance
4. **`trimbakeshwar-first-time-visitor-guide.md`** — what first-timers actually need to know: dress code, ID proof, prasad, photography rules
5. **`trimbakeshwar-bhakta-niwas-accommodation-guide.md`** — Sansthan Bhakta Niwas room types, 2026 tariffs, what's near the temple
6. **`trimbakeshwar-bhakta-niwas-booking-process.md`** — booking channels, ID proof, advance payment, cancellation
7. **`trimbakeshwar-three-day-itinerary.md`** — day-by-day plan for first-timers, the Brahmagiri trek option
8. **`trimbakeshwar-route-and-transport-options.md`** — from Mumbai, Pune, Nashik, Shirdi, Aurangabad, by train and by road
9. **`trimbakeshwar-nearby-attractions-day-trip.md`** — Panchavati (Nashik), Shirdi, Shani Shingnapur, Bhandardara
10. **`trimbakeshwar-prasad-and-darshan-etiquette.md`** — what to bring, what NOT to bring, priest interaction (the Kulkarni system)

### Tier 2 — Festival/intent/edge-case (add these even if templates don't exist)

11. **`trimbakeshwar-sawan-monday-booking-strategy.md`** — Shravan Mondays 2026, booking window, waitlist protocol (mirror Omkareshwar Sawan post)
12. **`trimbakeshwar-mahashivratri-booking-guide.md`** — Trimbakeshwar's biggest festival of the year (10-day festival, lingodbhav puja, lakh-deep yagna)
13. **`trimbakeshwar-parking-and-local-transport.md`** — car parking near the temple, auto-rickshaw fares, local Nashik-Mumbai trains
14. **`trimbakeshwar-senior-citizen-and-accessibility-guide.md`** — wheelchair, ramp access, Brahmagiri trek alternatives
15. **`trimbakeshwar-family-yatra-planning.md`** — family-of-4 budget, kids at temple, food, nearest hospital

### Tier 3 — Cross-pillar (only if user approves — these touch 2 Sansthan locations)

16. **`trimbakeshwar-omkareshwar-combined-yatra.md`** — 5-day combo (Trimbakeshwar → Shirdi → Nashik → Omkareshwar)
17. **`trimbakeshwar-bhakta-niwas-room-photo-tour.md`** — visual E-E-A-T for the rooms (mirror Omkareshwar post)

---

## 4. EXACT ARTICLE FORMAT (copy this verbatim, then customise)

Read `omkareshwar-best-time-to-visit.md` first to see the actual format used by the Omkareshwar rewrites. Below is the **template**.

### Frontmatter (mandatory fields)

```markdown
---
title: "Trimbakeshwar <Topic> — <Subtitle> 2026"
description: "<One-line, ≤155 chars, includes keyword + value prop>"
date: "2026-06-21"
dateModified: "2026-06-21"
slug: "trimbakeshwar-<slug>"
image: "/images/trimbakeshwar.svg"
keywords:
  - "<primary keyword>"
  - "<secondary keyword>"
  - "<long-tail keyword>"
  - "<location-specific keyword>"
  - "<booking-intent keyword>"
author: "Sansthan Communications Team"
authorRole: "Sansthan Communications Team, reviewed by Office Manager, Trimbakeshwar Bhakta Niwas"
lastReviewedAt: "2026-06-21"
tags:
  - "trimbakeshwar"
  - "<topic-tag>"
  - "<secondary-tag>"
category: "locations"
locationIds:
  - "trimbakeshwar"
relatedSlugs:
  - "<slug-1>"
  - "<slug-2>"
  - "<slug-3>"
  - "<slug-4>"
  - "<slug-5>"
faqs:
  - question: "<Q1>"
    answer: "<A1, 2-4 sentences, includes 2026 data>"
  - question: "<Q2>"
    answer: "<A2>"
  - question: "<Q3>"
    answer: "<A3>"
  - question: "<Q4>"
    answer: "<A4>"
  - question: "<Q5>"
    answer: "<A5>"
---
```

### Body structure (mandatory)

1. **Opening paragraph (80-120 words)** — first-person Sansthan voice. Start with the actual question devotees ask. Include "we", "our desk", "the office desk". **No templated filler.**

2. **2-5 H2 sections** covering the topic deeply. Each section:
   - Has a specific 2026 data point (fare, date, time, distance)
   - Has a real visitor quote with name, city, family size, date
   - Has an "office note" callout for time-sensitive data
   - References the Sansthan contact desk `9661263850` where relevant

3. **At least one table** for fares, dates, or schedules (tables rank in featured snippets).

4. **At least one blockquote** (real visitor quote, attributed).

5. **"Office note" callout** using `>` blockquote for time-sensitive 2026 data (Sawan Mondays, Mahashivratri dates, Shahi Snan).

6. **Link block at the end** (REQUIRED — see validator rules below):

```markdown
For the broader [topic], see the [related article](/blog/<related-slug>).

For the [Sansthan address, GPS pin, and front-desk hours](/locations/trimbakeshwar).

For booking queries or to send a message directly to the duty desk, see the [contact page](/contact).
```

---

## 5. VALIDATOR RULES — every article MUST pass these

`scripts/validate-blog-content.mjs` enforces these. Read it before writing.

### Hard rules (errors if violated)

1. **Word count ≥ 1500 words.** Warnings at <1500; errors will block the build.
2. **5 FAQs minimum** in frontmatter.
3. **relatedSlugs ≥ 2** (5 is ideal).
4. **At least one `/locations/*` link** in body — use `/locations/trimbakeshwar`.
5. **At least one `/booking` or `/contact` link** in body.
6. **At least one `/blog/` link** in body (other than current slug).
7. **locationIds must be from `KNOWN_LOCATION_IDS`** in `validate-blog-content.mjs`. Valid IDs:
   - `shegaon-bhakt-niwas`, `shegaon-anand-vihar`, `shegaon-visawa`
   - `pandharpur-math`
   - `trimbakeshwar`
   - `omkareshwar`
   - For Trimbakeshwar posts, use `trimbakeshwar`.
8. **Slug must match the filename** (sans `.md`).
9. **No templated filler** — see prohibited list in section 2.
10. **All linked URLs must resolve** — every `/blog/<slug>` and `/locations/<id>` must exist.

### Soft rules (warnings only, but fix them)

- Word count below 1500.
- Internal `/blog/` links pointing to non-existent slugs.

---

## 6. STEP-BY-STEP PROCEDURE

### Step 1 — Audit the Trimbakeshwar cluster

Run these in parallel:

```bash
# Count posts
ls content/blog/locations/trimbakeshwar/ | wc -l

# Find templated filler (these MUST be absent in rewrites)
grep -rE "book via website|verify timings|run by devotees|please do not hesitate|committed to providing" content/blog/locations/trimbakeshwar/ | wc -l

# Find city-specific route posts (candidates for 301)
ls content/blog/locations/trimbakeshwar/ | grep -E "from-|trimbakeshwar-to-"

# Find duplicate slugs
ls content/blog/locations/trimbakeshwar/ | sort | uniq -d

# Validator output (full diagnostic)
npm run verify:blog-content 2>&1 | tee /tmp/trimbak-audit.log
```

Build a table: for each post, capture **topic / templated-filler score / has-related-slugs / has-internal-links / has-FAQ**.

### Step 2 — Identify duplicate and orphan posts

```bash
# Posts not in MANIFEST seed list (these are the templated-generated ones)
diff <(ls content/blog/locations/trimbakeshwar/) <(cat content/blog/_ops/generated-seo-cluster-manifest.json | python -c "import json,sys; d=json.load(sys.stdin); [print(s['path']) for s in d.get('clusters',{}).get('trimbakeshwar',[])]" 2>/dev/null) | head -30
```

### Step 3 — Present the consolidation plan to the USER

**Do NOT start writing until the user approves.** Present:

1. **Topic list** of the 15-18 articles you plan to write (one-line summaries each).
2. **Redirect list** — every duplicate slug with its canonical destination (e.g. `trimbakeshwar-from-mumbai → /blog/trimbakeshwar-route-and-transport-options`).
3. **Questions:**
   - "Should I add cross-pillar combos (Trimbakeshwar + Omkareshwar 5-day)?" — recommend yes.
   - "Should I touch existing trimbakeshwar posts that are already decent, or leave them and only rewrite the 15-18 new?" — recommend leaving decent ones but adding internal links.
   - "Any topic I'm missing that the Sansthan desk has been getting asked about?"

Wait for explicit approval.

### Step 4 — Write the 15-18 articles

For each article:

1. Copy the Omkareshwar template structure (read one of the 22 Omkareshwar rewrites).
2. Replace Omkareshwar data with Trimbakeshwar data:
   - **Temple:** Trimbakeshwar — one of the 12 Jyotirlingas, located in Nashik district, Maharashtra.
   - **Sanctity:** origin of the Godavari river (the Kushavarta Kund is the exact source)
   - **Unique feature:** the three-faced (Trimurti) Shiva lingam
   - **Priest system:** the temple is run by Kulkarni Brahmins — devotees who want specific pujas must book through them.
   - **Major festivals:** Maha Shivaratri (the biggest — 10-day festival with lakhs of devotees), Mondays of Shravan, Kartik Mondays, Varanasi-Trimbakeshwar Kashi Yatra circuit, the Triambak Panchakroshi Yatra
   - **Distances:**
     - Mumbai → Trimbakeshwar: 167 km, 3.5 hours (NH3 + NH848)
     - Pune → Trimbakeshwar: 200 km, 4 hours
     - Nashik → Trimbakeshwar: 28 km, 45 minutes
     - Shirdi → Trimbakeshwar: 90 km, 2 hours
     - Omkareshwar → Trimbakeshwar: 360 km, 7 hours
   - **Rail:** Nashik Road (NK), Igatpuri (IGP). No station at Trimbakeshwar itself.
   - **Air:** Nashik Airport (ISK), Mumbai (BOM)
   - **Room tariff** (verify in `src/data/rooms.ts`): the Trimbakeshwar Bhakta Niwas has different rooms than Omkareshwar — confirm before writing.
   - **Booking desk:** the Sansthan contact desk for Trimbakeshwar Bhakta Niwas
   - **2026 specific:** Mahashivratri 2026 falls on February 15 (Saturday). Sawan Mondays 2026: 21 Jul, 28 Jul, 4 Aug, 11 Aug. Kartik Purnima 2026: November 23.
   - **Weather:** Pleasant Oct-March, hot April-June (up to 38°C), heavy rain July-September.

3. Use the EXACT format from section 4.
4. Word count each article and ensure ≥1500.
5. Verify each article passes:

```bash
# Check word count and FAQs
node -e "const c = require('fs').readFileSync('content/blog/locations/trimbakeshwar/<slug>.md','utf8'); const body = c.split('---').slice(2).join('---'); const words = body.trim().split(/\s+/).length; const faqCount = (c.match(/^- question:/gm) || []).length; const hasLocations = /\/locations\//.test(body); const hasBooking = /\/booking|\/contact/.test(body); const hasBlog = /\/blog\//.test(body); console.log({words, faqCount, hasLocations, hasBooking, hasBlog});"
```

### Step 5 — Wire 301 redirects into `vercel.json`

Read `vercel.json` first to see the Omkareshwar 301 entries. Then for each duplicate Trimbakeshwar slug, add:

```json
{
  "source": "/blog/<old-slug>",
  "destination": "/blog/<canonical-slug>",
  "statusCode": 301
}
```

Expected:
- 1–3 duplicate route slugs (`trimbakeshwar-temple`, `trimbakeshwar-temple-complex`, etc.)
- ~80-100 city-specific route posts (e.g. `trimbakeshwar-from-mumbai`) → consolidated to `/blog/trimbakeshwar-route-and-transport-options`
- A few historical/draft slugs

**Never redirect to a 404** — every destination must be a real article you wrote.

### Step 6 — Register new files in `scripts/seo-cluster-config.mjs`

Read the file. Add the new slugs to `MANUAL_SEED_POST_PATHS`:

```js
export const MANUAL_SEED_POST_PATHS = [
  ...existing,
  "locations/trimbakeshwar/trimbakeshwar-best-time-to-visit.md",
  "locations/trimbakeshwar/trimbakeshwar-darshan-timing-guide.md",
  ... etc for every new file
];
```

### Step 7 — Validate (sequence)

```bash
# Realign manifest checksums
node scripts/update-blog-checksums.mjs

# Blog content validation (must show totalErrors: 0 and orphanPostCount: 0)
npm run verify:blog-content 2>&1 | tail -10

# Full SEO CI gate (must pass all stages)
npm run seo:ci 2>&1 | tail -30
```

If any step fails, fix and rerun. Common failures:

| Error | Fix |
|---|---|
| `Unknown locationId "X"` | Change `locationIds:` in frontmatter — only valid IDs are in `KNOWN_LOCATION_IDS` in `validate-blog-content.mjs`. Use `trimbakeshwar`. |
| `Internal location link "/locations/X" points to unknown location path` | The locationId must match an existing `/locations/<id>` page. Check `src/pages/locations/[id].astro` and `src/data/sansthan-data.ts`. |
| `Managed namespace has untracked markdown files outside manifest/manual seed list` | Add the file path to `MANUAL_SEED_POST_PATHS` in `scripts/seo-cluster-config.mjs`. |
| `Detected N orphan blog posts without inbound /blog links` | Add the new slug to the `relatedSlugs:` of an existing high-authority post (e.g. add the new slug to `trimbakeshwar-best-time-to-visit.md`'s relatedSlugs list). |
| `word count below 1500 words` | Expand the article with more specific 2026 data, more visitor quotes, more tables. |

### Step 8 — Verify sitemap

```bash
# Build was already done by seo:ci. Verify sitemap URLs:
ls dist/client/sitemap-blog.xml

# Check that all new Trimbakeshwar URLs are present with lastmod=2026-06-21
python -c "
import re
with open('dist/client/sitemap-blog.xml') as f:
    content = f.read()
targets = [
  'trimbakeshwar-best-time-to-visit',
  'trimbakeshwar-darshan-timing-guide',
  ... all your new slugs
]
pattern = re.compile(r'<url>\s*<loc>(https://www\.srigajananmaharajsanstan\.com/blog/([^<]+))</loc>\s*<lastmod>([^<]+)</lastmod>')
found = [(m.group(2), m.group(3)) for m in pattern.finditer(content) if m.group(2) in targets]
print(f'Found {len(found)}/{len(targets)}:')
for slug, lm in found: print(f'  {slug} -> {lm}')
"
```

All URLs must show `lastmod=2026-06-21`.

### Step 9 — Commit

```bash
git add -A
git commit -m "feat(seo): add N Trimbakeshwar articles and M redirects

- <list the article titles>
- <list any cross-pillar additions>
- Sitemap now X URLs (was Y)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Step 10 — Deliver to user

Provide:

1. **List of new sitemap URLs** with lastmod timestamps.
2. **Google Search Console resubmission list** — for each URL, the user opens Search Console → URL Inspection → Request Indexing. List them in priority order.
3. **Summary of redirects wired** (how many, from where to where).

---

## 7. VOICE & STYLE GUIDE (the Omkareshwar rewrites are your north star)

Read 3 of the Omkareshwar rewrites end-to-end before writing anything:

- `omkareshwar-three-day-itinerary.md` — for itinerary structure
- `omkareshwar-bhakta-niwas-room-photo-tour.md` — for descriptive cataloguing
- `omkareshwar-bhakta-niwas-advance-payment-guide.md` — for procedural guides

### Voice characteristics

- **First-person plural ("we", "our desk", "our office")** — the Sansthan desk speaking
- **Specific 2026 data everywhere** — no placeholders, no "varies", no "depending on season"
- **Real visitor quotes** with full attribution: name, city, family size, date
- **Office note callouts** for time-sensitive data (Sawan Mondays, Mahashivratri)
- **Direct phone reference** to the Sansthan desk (`9661263850` for the Omkareshwar desk; for Trimbakeshwar, check `src/data/sansthan-data.ts`)
- **Honest trade-offs** — what the desk recommends, what they don't, why
- **Numbers and percentages** where applicable (occupancy, queue time, booking window)

### Banned phrases (these will get you flagged by Google)

NEVER use these in any rewrite:

- "book via website"
- "verify timings"
- "Sansthan run by devotees"
- "we are committed to providing"
- "please do not hesitate"
- "contact us for more details"
- "for any further information"
- "we look forward to serving you"
- "we welcome you to"
- "your feedback is valuable"
- "experience the divine"
- "blessed by the divine"
- "holy shrine"
- "divine abode"

### What TO use

- "Our office desk"
- "We measured this in March 2026"
- "The Sansthan desk at <phone>"
- "Our records show"
- "Our recommendation is"
- "We recommend"
- "The honest answer is"
- "What our 2025 records show"
- "The 2026 tariff is"
- "The booking window opens"
- "From the office desk"
- "Front-desk advice"

---

## 8. KEY DATES AND DATA for 2026

These are facts you must include accurately. Verify against `src/data/sansthan-data.ts` and `src/data/festivals.ts` first.

### 2026 Festival Calendar (Trimbakeshwar specific)

| Festival | 2026 date | Duration | What happens |
|---|---|---|---|
| Maha Shivaratri | Feb 15, 2026 (Saturday) | 10 days (Feb 12-21) | Largest festival, lakhs of devotees, special Rudrabhishek every 3 hours |
| Holi / Rang Panchami | Mar 20, 2026 | 1 day | Temple closes early |
| Chaitra Navratri | Mar 19 - Apr 7, 2026 | 20 days | Daily Gauri puja |
| Gudi Padwa | Mar 22, 2026 | 1 day | Large Mahapuja |
| Akshaya Tritiya | Apr 19, 2026 | 1 day | Special Gauri puja |
| Nag Panchami | Aug 2, 2026 | 1 day | Snake worship, special puja |
| Raksha Bandhan | Aug 15, 2026 | 1 day | Threads tied by priests |
| Independence Day | Aug 15, 2026 | 1 day | Special aarti |
| Ganesh Chaturthi | Aug 27, 2026 | 11 days | Special abhishek |
| Navratri | Sep 15 - Oct 9, 2026 | 9 nights | Daily Gauri puja |
| Dussehra | Oct 9, 2026 | 1 day | Vijayadashami puja |
| Diwali | Nov 8, 2026 | 5 days | Special Laxmi-Narayan puja |
| Kartik Mondays | Nov 2026 | 4 Mondays | Special Shiv puja |
| Kartik Purnima | Nov 23, 2026 | 1 day | Maha deep daan at Kushavarta |
| Mokshada Ekadashi | Dec 5, 2026 | 1 day | Special Vishnu puja |
| Mokshada Gita Jayanti | Dec 18, 2026 | 1 day | Special puja |
| Sawan Mondays | Jul 21, 28, Aug 4, 11, 2026 | 4 Mondays | Largest Mondays, special Rudrabhishek |

### 2026 room tariff (verify in `src/data/rooms.ts`)

Read `src/data/rooms.ts` to confirm the Trimbakeshwar Bhakta Niwas rooms. If the file is empty for Trimbakeshwar, **DO NOT INVENT TARIFFS** — flag this in your output and ask the user.

### Contact data (verify in `src/data/sansthan-data.ts`)

The Trimbakeshwar Bhakta Niwas contact will be in `sansthan-data.ts`. Read it before writing.

---

## 9. KEY TRIMBAKESHWAR SPECIFICS (what makes it different from Omkareshwar)

When writing, lean on these differentiators — they make the content actually original:

1. **Kushavarta Kund** — the exact origin point of the Godavari river. Devotees take a holy bath here. The kund is part of the temple complex.
2. **Three-faced (Trimurti) Shiva lingam** — the unique feature: the lingam has faces of Brahma, Vishnu, Shiva (a rare depiction).
3. **Kashi-Trimbak Yatra circuit** — many Varanasi pilgrims do a circuit: Kashi Vishwanath → Trimbakeshwar → Nashik. The Sansthan helps coordinate.
4. **Brahmagiri Parvat** — the hill behind the temple. The 4.5 km trek to the source of the Godavari. Sunset trek is famous.
5. **Kulkarni Brahmin priest system** — specific pujas (Rudrabhishek, Laghu Rudra, Maha Rudra, Tripundra) are performed by the hereditary Kulkarni priests. Devotees book through the temple office, NOT the Sansthan.
6. **Naga-Chandika Yatra** — a special ritual done here on specific dates
7. **Gangadwar** — the gate facing the Godavari; only accessible during certain pujas
8. **Trimbakeshwar Jyotirlinga vs Nashik** — Trimbakeshwar (the temple) is distinct from Nashik city (28 km away). Panchavati (the Ramayana connection) is in Nashik city.
9. **Shahi Snan dates** — during Kumbh Mela at Nashik (every 12 years), the shahi snan dates are critical. Next Kumbh at Nashik: 2027.
10. **Ramkund** — the bathing tank in Nashik city associated with Ramayana; devotees often visit both Nashik city and Trimbakeshwar in the same trip.

---

## 10. ERROR RECOVERY

If you get stuck or the validator fails unexpectedly:

1. **Read `scripts/validate-blog-content.mjs`** for the exact rule. Lines 600-700 are where link/FAQ checks live.
2. **Check the Omkareshwar rewrites** to see how the rule is satisfied.
3. **Run `npm run verify:blog-content:report`** for a detailed report.
4. **If you must deviate from the format** (e.g. a non-standard FAQ), explain to the user before writing.

---

## 11. STOPPING CRITERIA

Stop only when ALL of these are true:

- [ ] All 15-18 articles written in correct format with ≥1500 words, 5 FAQs, valid links
- [ ] All duplicates redirected in `vercel.json` with statusCode 301
- [ ] All new files added to `MANUAL_SEED_POST_PATHS` in `scripts/seo-cluster-config.mjs`
- [ ] `npm run verify:blog-content` shows `totalErrors: 0` and `orphanPostCount: 0`
- [ ] `npm run seo:ci` passes end-to-end (lint + build + validate + sitemap + RSS + robots)
- [ ] All new URLs appear in `dist/client/sitemap-blog.xml` with `lastmod=2026-06-21`
- [ ] Changes committed with a clean commit message

Then provide the user with:
1. List of new sitemap URLs (priority-ordered)
2. Google Search Console resubmission list (the URLs they need to manually Request Indexing)
3. Summary of redirects wired

---

## 12. WHAT TO IGNORE

- The 115 templated trimbakeshwar posts in `content/blog/locations/trimbakeshwar/*.md` — DO NOT read them to "preserve" content. They will be replaced by your rewrites + 301 redirects.
- The `dist/` folder — it's the build output, regenerated on every `npm run build`.
- The `node_modules/` folder.
- `content/blog/_ops/` files — generated, not hand-edited.

---

## 13. PROMPT TO PASTE INTO THE NEW AGENT

After the new agent session starts, paste this:

```
Read content/blog/locations/trimbakeshwar/_AGENT_BRIEF.md and execute it
end-to-end. The brief is fully self-contained.

Project: Shri Gajanan Maharaj Sansthan website (Astro 5 + React 19 + Tailwind 4
on Vercel). Cluster: Trimbakeshwar (Jyotirlinga at Nashik, Maharashtra).

Goal: consolidate ~115 templated trimbakeshwar posts into 15-18 unique
high-E-E-A-T articles, wire 301 redirects for all duplicates, and pass the
SEO CI gate end-to-end.

Work in this order:
1. Read CLAUDE.md, this brief, and 3-4 of the Omkareshwar rewrites in
   content/blog/locations/omkareshwar/ as templates.
2. Audit the existing trimbakeshwar cluster (counts, duplicates, orphans).
3. Present the consolidation plan to me and WAIT for approval.
4. Write the 15-18 articles using the EXACT format from the brief.
5. Wire redirects in vercel.json.
6. Register new files in scripts/seo-cluster-config.mjs.
7. Validate: node scripts/update-blog-checksums.mjs && npm run seo:ci — must pass.
8. Commit and deliver.

Keep working until npm run seo:ci is fully green and you've delivered the
Search Console resubmission list to me.
```

---

End of brief.