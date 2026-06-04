# Post-Deploy Indexing Runbook — Gajanan Maharaj Sansthan

This is the one-time setup you need to do right after the 596-post blog cluster lands in production. The cluster is live, sitemaps are served, RSS is live — but Google will not index the new pages until you do the steps below.

Time required: ~30 minutes, then wait 7–14 days for Google to crawl.

---

## Step 0 — Fix the canonical domain in Vercel (BLOCKER, do first)

Right now the sitemap is being served with `*.vercel.app` hostnames inside `<loc>` tags because `PUBLIC_SITE_URL` is not set in Vercel. This splits SEO signals across two hostnames and will hurt ranking. Fix it:

1. Open https://vercel.com/dashboard → your project → **Settings** → **Environment Variables**.
2. Add:
   - **Name**: `PUBLIC_SITE_URL`
   - **Value**: `https://www.srigajananmaharajsanstan.com`
   - **Environments**: check **Production** (and Preview if you want previews to use the real domain).
3. **Redeploy** the latest production deployment (Deployments tab → ⋯ → Redeploy). It will rebuild with the correct canonical domain.
4. Verify: `curl -s https://www.srigajananmaharajsanstan.com/sitemap-core.xml | head -10` should now show `<loc>https://www.srigajananmaharajsanstan.com/...</loc>` not `<loc>https://...vercel.app/...</loc>`.

Do not proceed to Step 1 until this is verified — submitting a sitemap with `*.vercel.app` hostnames to Google will confuse the index.

---

## Step 1 — Verify all sitemaps are reachable

```bash
curl -sI https://www.srigajananmaharajsanstan.com/sitemap.xml          # 200, sitemap-index
curl -sI https://www.srigajananmaharajsanstan.com/sitemap-core.xml     # 200
curl -sI https://www.srigajananmaharajsanstan.com/sitemap-blog.xml     # 200
curl -sI https://www.srigajananmaharajsanstan.com/feed.xml             # 200
curl -sI https://www.srigajananmaharajsanstan.com/robots.txt           # 200
```

Expected counts after Step 0:
- `sitemap.xml` = 2 child sitemap `<sitemap>` entries
- `sitemap-core.xml` = ~22 URLs (12 static + 4 landing + 6 location)
- `sitemap-blog.xml` = ~657 URLs (596 posts + 24 paginated + 33 tags + 4 categories)
- `feed.xml` = 596 `<item>` entries
- `robots.txt` = `Sitemap: https://www.srigajananmaharajsanstan.com/sitemap.xml` line

---

## Step 2 — Google Search Console (GSC) — REQUIRED

URL: https://search.google.com/search-console

### 2a. Add/verify property
- Property type: **Domain** (preferred, covers both apex and www) → `srigajananmaharajsanstan.com`
- Verification: DNS TXT record (recommended, survives all deploys). Add the TXT record Vercel shows you at your DNS provider.

### 2b. Submit both sitemaps
- Left menu → **Sitemaps** → Add:
  - `sitemap.xml` (the index — Google will follow it to both children automatically)
  - `sitemap-core.xml` (optional but harmless)
  - `sitemap-blog.xml` (optional but harmless)
- Wait 24–48 hours. Status should show "Success" with the discovered URL count climbing to ~679.

### 2c. Request indexing for the 6 highest-priority URLs (the "Indexing API" path)
These are the URLs you most want to rank fast:

1. `https://www.srigajananmaharajsanstan.com/` (homepage)
2. `https://www.srigajananmaharajsanstan.com/shegaon-accommodation`
3. `https://www.srigajananmaharajsanstan.com/omkareshwar-bhakta-niwas`
4. `https://www.srigajananmaharajsanstan.com/pandharpur-room-booking`
5. `https://www.srigajananmaharajsanstan.com/trimbakeshwar-bhakt-niwas`
6. `https://www.srigajananmaharajsanstan.com/bhakta-niwas`

GSC → top search bar → paste URL → Enter → **Request indexing**. This is the *fastest* legitimate way to get Google to crawl a specific URL — typically 1–3 days.

### 2d. Inspect a sample blog post
- GSC → top search bar → paste a blog URL like `https://www.srigajananmaharajsanstan.com/blog/shegaon-darshan-timing-guide`
- Click **Request indexing**.
- Verify "Page is indexed: Yes" within 3 days. If "Crawled, not indexed", check **Coverage → Excluded** for the specific reason.

### 2e. Check Coverage report daily for the first week
GSC → **Pages** (or "Coverage" in the legacy UI) → look for:
- **Discovered – currently not indexed**: normal for the first few days, should drain to 0.
- **Crawled – currently not indexed**: investigate — usually thin content or duplicate. Sample a few.
- **Excluded by `noindex`**: should be empty. If non-empty, a page is accidentally tagged.

---

## Step 3 — Bing Webmaster Tools (free, indexes fast)

URL: https://www.bing.com/webmasters

- Add site (verify via DNS CNAME or by uploading `BingSiteAuth.xml` to `public/`)
- Submit `https://www.srigajananmaharajsanstan.com/sitemap.xml`
- Submit the top 6 priority URLs via "Submit URLs" tool
- Enable "IndexNow" (Bing's instant-indexing API — see Step 4)

---

## Step 4 — IndexNow (free, instant push for Bing + Yandex + Seznam)

IndexNow tells search engines the moment a URL is live. Free, no quota issues, supported by Bing, Yandex, Seznam, and increasingly Google (Google is integrating it).

### Setup (one-time, 5 min)
1. Generate an API key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Save the key in your password manager.
3. Create `public/{your-key}.txt` containing the key (e.g. `public/a1b2c3d4....txt`). This proves you own the site.
4. Set env var `INDEXNOW_KEY={your-key}` in Vercel (you'll use it in API calls; the txt file is the proof).

### Submit URLs
For each new URL you want indexed, POST to:
```
POST https://api.indexnow.org/indexnow
Content-Type: application/json

{
  "host": "www.srigajananmaharajsanstan.com",
  "key": "{your-key}",
  "keyLocation": "https://www.srigajananmaharajsanstan.com/{your-key}.txt",
  "urlList": [
    "https://www.srigajananmaharajsanstan.com/blog/shegaon-darshan-timing-guide",
    "https://www.srigajananmaharajsanstan.com/shegaon-accommodation",
    "..."
  ]
}
```

You can submit up to 10,000 URLs per call. The 596 blog posts can be split into one batch of 596. Or do it in two batches of ~300 to be safe.

If you want a turnkey script, ask Claude to write `scripts/submit-indexnow.mjs` that reads `content/blog/**/*.md` and posts them all in batches.

---

## Step 5 — Backlinks + social signals (the long game)

Indexing is step one. Ranking for "Shegaon accommodation" / "Trimbakeshwar Bhakta Niwas" / "Omkareshwar room booking" requires backlinks from authoritative sites. Priority targets:

| Source | Why | How |
|---|---|---|
| Google Business Profile (GBP) | Local pack for "near me" searches | Set up GBP for the Sansthan; link to `/shegaon-accommodation` in the website field. Repeat for each location. |
| Justdial / Sulekha / IndiaMART | High-authority Indian directories | Submit site + 4 landing URLs |
| Temples of India directories | Niche relevance | templepurohit.com, templedetails.com, bharattemples.com |
| Reddit r/hinduism, r/India, r/pilgrimage | Engagement + long-tail traffic | Share 2–3 well-written blog posts (don't spam) |
| YouTube | Big traffic source for pilgrimage | Record 1–2 min videos of the darshan/Bhakta Niwas walkthrough; embed in landing pages |
| Hindu pilgrimage Facebook groups | Targeted audience | Share "complete guide" posts with link |

---

## Step 6 — Track progress

Create a simple spreadsheet with these columns and update weekly:

| URL | Target keyword | Submitted date | Indexed date | Position (GSC) |
|---|---|---|---|---|
| /shegaon-accommodation | shegaon accommodation | 2026-06-04 | (pending) | – |
| /omkareshwar-bhakta-niwas | omkareshwar bhakta niwas | 2026-06-04 | (pending) | – |
| ... | ... | ... | ... | ... |

In GSC → **Performance** → filter by page → you'll see impressions, clicks, average position. Update the spreadsheet from there.

---

## Expected timeline

- **Day 1–3**: Sitemap processed, top 6 priority URLs crawled (because of Step 2c).
- **Day 4–7**: ~50–100 blog posts discovered and crawled.
- **Week 2**: ~300–500 posts indexed.
- **Week 3–4**: 596 posts fully indexed, ranking signals accumulating.
- **Month 2–3**: Long-tail traffic starts appearing. Trimbakeshwar/Omkareshwar landing pages should be ranking for branded queries.
- **Month 3–6**: Stable rankings; continue backlinks + content updates.

---

## If something is broken

- **Sitemap showing `*.vercel.app`** → go back to Step 0.
- **GSC shows "Couldn't fetch"** → check Vercel access logs; the deployment may have failed.
- **Posts are "Discovered, not indexed"** → usually fine for 7–14 days. If still not indexed after 30 days, request indexing manually for a few sample posts and see if Google reports a specific issue.
- **Redirects / 404s** → the `src/middleware.ts` canonical host redirect (apex → www) handles 99% of cases. If you see traffic to the wrong host, enable `SEO_ENABLE_APP_HOST_REDIRECTS=true`.

For deeper issues, ask Claude to read `src/lib/seo/` and `scripts/verify-*.mjs` for the full audit surface.
