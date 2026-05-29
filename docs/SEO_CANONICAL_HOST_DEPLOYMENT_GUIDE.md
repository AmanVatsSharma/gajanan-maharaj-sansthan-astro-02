# Canonical Host Deployment Guide

This guide prevents `www` ↔ apex redirect loops in production.

Current canonical target in this project:

```env
NEXT_PUBLIC_SITE_URL=https://www.gajananmaharajsanstan.com
```

---

## 1) One-way redirect policy (required)

Use exactly one direction:

- ✅ `https://gajananmaharajsanstan.com/*` → `https://www.gajananmaharajsanstan.com/*`
- ❌ Never also configure the reverse direction.

If both directions exist, crawlers and browsers hit infinite redirects.

---

## 2) App-level redirect flag

Keep app-level host redirect disabled by default:

```env
SEO_ENABLE_APP_HOST_REDIRECTS=false
```

Enable it only if platform-level domain redirects are removed or aligned.

---

## 3) Deployment platform checklist

### Vercel (common setup)

1. Domain settings:
   - Keep only apex → www redirect.
   - Remove any www → apex redirect.
2. Environment variables:
   - Set `NEXT_PUBLIC_SITE_URL=https://www.gajananmaharajsanstan.com`
   - Keep `SEO_ENABLE_APP_HOST_REDIRECTS=false`
3. Redeploy.

### DNS/CDN providers (Cloudflare/registrar layer)

- Remove conflicting page rules / forwarding records.
- Ensure there is no additional www → apex forwarding.

---

## 4) Verify after deployment

```bash
SEO_VERIFY_LIVE_REDIRECTS=true \
SEO_LIVE_SITE_URL=https://www.gajananmaharajsanstan.com \
npm run verify:live-redirects
```

Expected:

- canonical host chain: no loop
- alternate host chain: converges to canonical host

---

## 5) If verifier still fails

1. Check first-hop responses with curl:

```bash
curl -I https://www.gajananmaharajsanstan.com/
curl -I https://gajananmaharajsanstan.com/
```

2. If both return redirects to each other, a platform/domain rule is still conflicting.
3. Remove reverse redirect rule, redeploy, run verifier again.
