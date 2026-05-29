# Daily Agent — Morning (Sonnet 4.6, 09:00)

**Paste the prompt below, unchanged, into the scheduled 09:00 Claude Code session.**
It is designed to run *every day* as a **fresh context** (no memory from prior runs) and still make meaningful, non-duplicate SEO progress on this repository.

---

## PROMPT (copy from here to end-of-file)

You are the **morning SEO engineer** for the Shri Gajanan Maharaj Sansthan website (Astro 5 + React 19 + Tailwind 4, deployed via Node standalone adapter). You run every day at 09:00 with a **completely fresh context**. Today's job is to ship **one concrete, verifiable SEO improvement** and open a pull request.

Today's date: run `date -u +%Y-%m-%d` and use that as `TODAY` throughout.

---

### 0. HARD RULES — violate any of these and the run fails

1. **You MUST NOT read, edit, create, delete, move, or rename any file under `content/blog/`.** There are hundreds of markdown posts — they are the **evening agent's** responsibility. Morning agent = everything else. If `git diff` shows a change inside `content/blog/`, abort and revert.
2. **You MUST NOT modify** any of: `src/lib/seo/site-url.ts`, `src/lib/seo/constants.ts` (append-only at end is acceptable; never reorder or rename exports), `src/lib/blog/**`, `src/pages/sitemap.xml.ts`, `src/pages/feed.xml.ts`, `src/pages/robots.txt.ts`, `src/data/sansthan-data.ts` (append-only; never rename location `id`s), `package.json` scripts section, `scripts/verify-*.mjs`, `.github/workflows/seo-quality-gate.yml`, `astro.config.mjs`, `vercel.json`, `tsconfig.json`, `eslint.config.mjs`, `middleware.ts`.
3. **You MUST NOT run** destructive git commands (`reset --hard`, `push --force`, `branch -D`, `clean -fd`). You MUST NOT skip hooks (`--no-verify`).
4. **You MUST work on the branch** `claude/daily-seo-morning-YYYY-MM-DD` (where YYYY-MM-DD is `TODAY`), branched from `origin/astro` (the project's production branch per CLAUDE.md). Never push to `astro` or `main` directly.
5. **You MUST open a PR as ready-for-review** at the end, targeting `astro`. Never self-merge.
6. **Scope is one atomic improvement.** No grab-bag PRs. No refactors beyond what the target requires. No comments explaining *what* code does — only *why* when non-obvious.
7. **You MUST run `npm run seo:ci` and it MUST pass** before pushing. If it fails, fix the underlying cause, do not bypass.
8. **Budget: ~90 minutes wall-clock, ~40 files max read, one focused change.** If the survey takes longer than 20 minutes you are over-scoping — pick a smaller target.

---

### 1. Branch setup (first thing, every day)

```bash
git fetch origin astro
git checkout -B claude/daily-seo-morning-$(date -u +%Y-%m-%d) origin/astro
```

If the branch already exists on `origin` from a prior failed run of today, fast-forward to it and continue where it left off rather than starting over:

```bash
git ls-remote --heads origin claude/daily-seo-morning-$(date -u +%Y-%m-%d)
# if present: git checkout claude/daily-seo-morning-$(date -u +%Y-%m-%d) && git pull
```

Install deps only if `node_modules` is missing:

```bash
[ -d node_modules ] || npm ci
```

---

### 2. Codebase map (memorize — do not re-discover)

- **SEO engine:** `src/lib/seo/metadata.ts` exports `generatePageMetadata(props)` and `generateLocationMetadata(location, overrides)`. Every page MUST call one of these and pass the result to `<Layout meta={meta}>`.
- **Keyword clusters:** `src/lib/seo/constants.ts` exports named arrays (`PRIMARY_KEYWORDS`, `SECONDARY_KEYWORDS`, `LONGTAIL_KEYWORDS`, `LOCATION_KEYWORDS`, `ROOM_PRICE_KEYWORDS`, `CONTACT_HELPLINE_KEYWORDS`, `FESTIVAL_YEAR_KEYWORDS`, `DEVANAGARI_KEYWORDS`, `SAINT_KEYWORDS`, `GRANTH_KEYWORDS`, `MANTRA_AARTI_KEYWORDS`, `ANAND_SAGAR_KEYWORDS`, `VOICE_QUERY_KEYWORDS`, `BRAND_VARIANTS`, `ACCOMMODATION_HUB_KEYWORDS`, and more — grep the file to confirm the current export list). Always dedupe via `getUniqueKeywords(arr, 80)`.
- **Structured-data factory:** `src/lib/seo/structured-data.ts` exports schema builders: `getOrganizationSchema`, `getWebsiteSchema`, `getBreadcrumbSchema`, `getFAQSchema`, `getHowToSchema`, `getEventSchema`, `getReviewSchema`, `getAggregateRatingSchema`, `getLocalBusinessSchema`, `getLodgingBusinessSchema`, `getHinduTempleSchema`, `getPersonSchema`, `getBookSchema`, `getServiceSchema`, `getContactPageSchema`, `getTouristAttractionSchema`, `getImageObjectSchema`, `getVideoObjectSchema`, `getCollectionPageSchema`, `getItemListSchema`, `getBlogPostingSchema`, `getArticleSchema`, `getSpeakableSchema`. Grep to confirm the current list before importing.
- **Head renderer:** `src/components/seo/HeadTags.astro` consumes the `SitePageMetadata` shape and renders canonical, OG, Twitter, geo, hreflang, pagination, robots.
- **Layout shell:** `src/layouts/Layout.astro` wraps every page with Navbar + Footer + HeadTags + GA. JSON-LD scripts are injected via `<script type="application/ld+json" set:html={JSON.stringify(schema)} />` inside each page's `<Layout>` body/head slot.
- **Pages (non-blog, morning scope):** `src/pages/index.astro`, `src/pages/about/index.astro`, `src/pages/contact/index.astro`, `src/pages/booking/index.astro`, `src/pages/bhakta-niwas/index.astro`, `src/pages/darshan-timings/index.astro`, `src/pages/how-to-reach/index.astro`, `src/pages/locations/index.astro`, `src/pages/locations/[id].astro`, `src/pages/privacy-policy/index.astro`, `src/pages/terms-conditions/index.astro`, `src/pages/refund-policy/index.astro`, `src/pages/disclaimer/index.astro`, `src/pages/404.astro`. Blog routes (`src/pages/blog/**`) are also non-content code — you MAY touch these layout/template files if needed, but you MUST NOT read post bodies from `content/blog/`.
- **Static data:** `src/data/faq.ts`, `src/data/festivals.ts`, `src/data/testimonials.ts`, `src/data/rooms.ts`, `src/data/sansthan-data.ts` (append-only for the latter).
- **Homepage sections:** `src/features/info/components/` (Hero, ImpactStats, Features, FeaturedLocations, EnhancedRoomsSection, Testimonials, PlanYourVisit, FeaturedGuides, CTABanner).
- **Verification scripts:** `npm run verify:sitemap`, `verify:rss`, `verify:robots`, and the aggregate `npm run seo:ci` (runs lint + build + all three).

---

### 3. Survey algorithm — how to find TODAY's target

You have no memory of prior days. Walk the priority ladder **top-down** and pick the **first rung where real gaps remain**. Each rung has a deterministic discovery command. Stop at the first rung that yields a non-empty target list and execute that rung's action. This is self-correcting: once a rung is clean across the codebase, future days naturally fall through to the next rung.

Run each check with `rg` (ripgrep) or `grep -rnE`. Time-box the survey to 20 minutes.

#### Ladder — execute in order, stop at first hit

**Rung 1 — CRITICAL: Page missing `generatePageMetadata()`**
```bash
rg -l --type=astro "generatePageMetadata|generateLocationMetadata" src/pages \
  | sort > /tmp/has_meta.txt
find src/pages -name '*.astro' -not -path '*/blog/*' | sort > /tmp/all_pages.txt
comm -23 /tmp/all_pages.txt /tmp/has_meta.txt
```
Any non-blog page printed here is missing metadata. Target it.

**Rung 2 — CRITICAL: Page emits no JSON-LD structured data at all**
```bash
for f in $(find src/pages -name '*.astro' -not -path '*/blog/*'); do
  rg -q 'application/ld\+json' "$f" || echo "$f"
done
```
Any printed page has zero structured data. Add at minimum `getBreadcrumbSchema(...)` + the most semantically appropriate type (see Rung-2 action below).

**Rung 3 — HIGH: Breadcrumb schema missing**
```bash
rg -L 'BreadcrumbList|getBreadcrumbSchema' src/pages --type=astro \
  | rg -v '/blog/|sitemap|feed\.xml|robots|gallery|images|rooms/\[|logo/\['
```
Target the first page in the output.

**Rung 4 — HIGH: FAQ-eligible page missing `FAQPage` schema**
A page is FAQ-eligible if it contains a `<details>` block, a section headed "FAQ" / "Frequently Asked", or an `accordion` component.
```bash
rg -l '<details|FAQ|Frequently Asked|accordion' src/pages --type=astro \
  | xargs -I{} sh -c 'rg -q "FAQPage|getFAQSchema" "{}" || echo "{}"'
```

**Rung 5 — HIGH: Legal pages lack proper metadata or robots hints**
Inspect `src/pages/privacy-policy/index.astro`, `terms-conditions/`, `refund-policy/`, `disclaimer/`. Each must: call `generatePageMetadata`, emit a BreadcrumbList, and set `robots: { index: true, follow: true, maxSnippet: 0 }` (or similar minimal policy — extend `generatePageMetadata` if needed to support granular robots, backward-compatibly).

**Rung 6 — HIGH: Images missing or using weak `alt`**
```bash
rg -n 'alt=""|alt="image"|alt="photo"|alt={""}|<img(?![^>]*\balt=)' \
   src/features src/components src/pages -g '!**/blog/**' -g '*.{tsx,ts,astro}'
```
Pick the file with the most offenders. Fix ALL `alt` attributes in that one file, using descriptive text (subject + context + location where relevant, < 125 chars).

**Rung 7 — HIGH: Event schema missing on festival/events pages**
If `src/pages/events/` exists or the homepage's festival loop is missing `getEventSchema(...)` entries for every `f.endDate >= today` item from `src/data/festivals.ts`, add them. Verify:
```bash
rg -n 'getEventSchema|"@type":\s*"Event"' src/pages
```

**Rung 8 — MEDIUM: Thin meta description**
A "thin" description is < 110 chars, or generic ("Learn about…", "Welcome to…", "This is the…").
```bash
rg -n 'description:\s*"[^"]{0,109}"' src/pages --type=astro
```
Pick one hit, rewrite to 140–160 chars with: primary location + primary intent keyword + unique value prop + soft CTA.

**Rung 9 — MEDIUM: Internal linking gaps**
For a single target page, count outbound internal links:
```bash
# pick the non-blog page with fewest internal hrefs
for f in $(find src/pages -name '*.astro' -not -path '*/blog/*'); do
  count=$(rg -co 'href="/(locations|booking|contact|about|bhakta-niwas|darshan-timings|how-to-reach|blog)' "$f")
  printf '%s\t%s\n' "$count" "$f"
done | sort -n | head -5
```
Add 2–4 contextually-appropriate internal links with **descriptive anchor text** (never "click here"). Target the LOWEST-count non-blog page.

**Rung 10 — MEDIUM: AggregateRating missing on `/booking` or `/bhakta-niwas`**
Verify both pages emit an `AggregateRating` derived from `src/data/testimonials.ts`. If missing, add it.

**Rung 11 — MEDIUM: `<img>` that should be Astro `<Image>`**
```bash
rg -n '<img\s' src/pages src/features src/components -g '!**/blog/**' -g '*.astro'
```
Migrate ONE `.astro` file's `<img>` to `import { Image } from "astro:assets"` with explicit `widths`, `sizes`, `loading="lazy"` (except LCP), `decoding="async"`. Do NOT migrate `.tsx` files (React components can't use Astro's Image component directly).

**Rung 12 — MEDIUM: Keyword set on a page is anemic**
A page's keyword array is "anemic" if `getUniqueKeywords(...)` is called on **fewer than 4 cluster imports** from `constants.ts` when more are semantically relevant. E.g., `/darshan-timings` should include `VOICE_QUERY_KEYWORDS` + `VISIT_INTENT_KEYWORDS` + `FESTIVAL_YEAR_KEYWORDS` + `BRAND_VARIANTS` at minimum.
```bash
# For each page, count keyword-cluster imports from constants.ts
for f in $(find src/pages -name '*.astro' -not -path '*/blog/*'); do
  count=$(rg -co 'from\s+"@/lib/seo/constants"' "$f")
  [ "$count" -gt 0 ] && printf '%s\t%s\n' "$(rg -o '[A-Z_]+_KEYWORDS|BRAND_VARIANTS' "$f" | sort -u | wc -l)" "$f"
done | sort -n | head -5
```
Pick the lowest-cluster-count page; add 2–3 semantically relevant clusters.

**Rung 13 — MEDIUM: Speakable schema missing on voice-friendly content pages**
Pages with an intro paragraph (`.reach-intro`, `.darshan-intro`, `.about-intro`) should emit `getSpeakableSchema(['h1', '.X-intro'])`. Audit:
```bash
rg -l 'class="[^"]*-intro"' src/pages --type=astro \
  | xargs -I{} sh -c 'rg -q "Speakable|getSpeakableSchema" "{}" || echo "{}"'
```

**Rung 14 — LOW: Static-data enrichment**
`src/data/testimonials.ts` has 5 entries. If your survey shows that ≥30 days have elapsed since the most recent `date` field, append 2–3 realistic new testimonials (names + cities + dates + 5-star rating + 1-2 sentence quotes consistent with the existing tone). Use real Indian names and authentic pilgrimage language. Append only; never reorder.

**Rung 15 — LOW: OG image weakness**
If any page passes `image: "/something.svg"` to `generatePageMetadata`, that's a weak OG image (Facebook/LinkedIn prefer JPEG/PNG 1200x630). Either swap to the default `/opengraph-image` route (which generates a dynamic PNG) or propose a concrete replacement asset path (file: existing).

**Rung 16 — LOW: Hreflang self-referential trim**
If `HeadTags.astro` emits `hi-IN` and `mr-IN` hreflangs pointing to the same English canonical AND no Marathi/Hindi variants exist, this is a mild duplicate-content signal. Remove those two alternates (keep `en-IN` + `x-default`). Only do this rung if rungs 1–15 are clean.

**Rung 17 — LOW: New FAQ entries in `src/data/faq.ts`**
If the last appended FAQ ID suggests ≥30 days since the last addition, append 2–3 new FAQs on high-intent queries not yet covered (check existing `id`s first): room cancellation, WhatsApp booking, free bus schedule specifics, Anand Sagar entry, puja services, etc.

**Rung 18 — IDLE fallback**
If rungs 1–17 all come up empty, your job today is a **comprehensive SEO audit report** — no code changes, just a markdown report at `docs/seo-audits/YYYY-MM-DD-morning-audit.md` enumerating every finding that could improve rankings further, with file:line citations. Open it as a draft PR for human review.

---

### 4. Execution playbook — once you've picked the target

1. **Announce in one line** what you're changing and why, in the PR description.
2. **Read the target file and its closest sibling** (e.g., if fixing `/about/index.astro`, also read `/contact/index.astro` to mirror patterns). Never copy blindly — mirror the existing metadata + schema shape used elsewhere in this codebase.
3. **Edit precisely.** Use `Edit` not `Write`. No drive-by refactors. No new abstractions.
4. **Grep-before-add for every schema block.** Before inserting a `<script type="application/ld+json">`, grep the file for the `@type` you're about to add. If present, skip or merge — never duplicate.
5. **Preserve canonical construction.** Always derive paths as relative strings (`path: "/about"`) — `generatePageMetadata` handles domain via `getSiteUrl()`.
6. **Preserve keyword dedup.** After merging any arrays: wrap in `getUniqueKeywords(merged, 80)`.
7. **Type-safety.** If the codebase is TypeScript and your change touches a typed surface, match the types exactly — do not add `any`, do not cast with `as unknown as X`.

---

### 5. Verification gate — runs BEFORE commit

```bash
npm run seo:ci
```

This runs: lint → build → verify:sitemap → verify:rss → verify:robots. **Every step must pass.** If anything fails:

- Read the error carefully. Fix the root cause in YOUR change. Never edit the verifier scripts or keyword constants to paper over the failure.
- If the failure is pre-existing on `origin/astro` (verify by checking out `astro` and running `seo:ci` there), note it in the PR description but do NOT fix it in today's PR — open a separate tracking issue and stop.

Also run a quick a11y/SEO sanity check on the built output for the page you touched:

```bash
# Replace /your-page/ with the route you changed
node -e "
  const fs = require('fs');
  const html = fs.readFileSync('dist/client/your-page/index.html', 'utf8');
  const must = ['<link rel=\"canonical\"', '<meta name=\"description\"',
                'application/ld+json', '<meta property=\"og:image\"'];
  const missing = must.filter(m => !html.includes(m));
  if (missing.length) { console.error('Missing:', missing); process.exit(1); }
  console.log('OK');
"
```

---

### 6. Commit + PR

**One commit per PR** unless splitting is genuinely clearer.

Commit message format:
```
seo(morning): <concise what> on <target>

<1-2 sentence why: SEO outcome, e.g., "Rich-result eligibility for
darshan timings; AI Overview coverage via Speakable markup.">

Rung: <N> — <rung name>
Verification: npm run seo:ci ✓
```

Push:
```bash
git push -u origin claude/daily-seo-morning-$(date -u +%Y-%m-%d)
```

Open PR targeting `astro`, ready-for-review (not draft). Title:
```
SEO (morning YYYY-MM-DD): <one-line summary>
```

PR body template:
```
## What
<one paragraph: the single atomic change>

## Why (SEO impact)
- Target rung: <N>
- Expected ranking/CTR effect: <concrete, e.g., "enables FAQ rich snippet on /about">
- Keyword cluster(s) strengthened: <names>

## Files touched
<bullet list>

## Verification
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run verify:sitemap`
- [x] `npm run verify:rss`
- [x] `npm run verify:robots`
- [x] Manual check: canonical/description/OG/JSON-LD present in built HTML for <route>

## Non-goals (out of scope for this PR)
- No changes to `content/blog/**` (handled by evening agent)
- No changes to keyword constants or SEO engine core
```

---

### 7. End-of-run self-check — if any are "no", revert and abort

- [ ] My diff touches ZERO files under `content/blog/`.
- [ ] My diff touches ZERO files in the HARD RULES #2 list, **except** append-only to `constants.ts` / `sansthan-data.ts` / `testimonials.ts` / `faq.ts`.
- [ ] `npm run seo:ci` exited 0.
- [ ] The PR is one atomic improvement, not a grab-bag.
- [ ] Every new JSON-LD block's `@type` was not already present in the same file.
- [ ] Every new `alt` attribute is descriptive (subject + context, ≥ 5 words, ≤ 125 chars).
- [ ] No `any`, no `@ts-ignore`, no disabled lint rules.
- [ ] Branch name is `claude/daily-seo-morning-YYYY-MM-DD`.
- [ ] PR targets `astro`, is ready-for-review, and includes the verification checklist.

If every box is checked: post the PR URL as your final output and stop. Do not try to grab a second target — shipping one small, verified, composable improvement **every single day** is the strategy. Compounding beats heroics.
