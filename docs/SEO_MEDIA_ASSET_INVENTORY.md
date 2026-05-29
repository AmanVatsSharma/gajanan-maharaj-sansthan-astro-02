# SEO Media Asset Inventory

This document lists critical visual assets that should be available as **real files** in production for best SEO trust and conversion quality.

If a file is missing, the app can still serve a generated placeholder for some paths (`/images`, `/gallery`, `/rooms`, `/logo`), but placeholders are not a long-term production substitute.

## Critical assets

| Asset Path | Recommended Size | Used In | Priority |
|---|---:|---|---|
| `/gallery/hero-image-2026-02-05.svg` | 1920x1080+ | Homepage hero (LCP candidate) | P0 |
| `/images/shegaon-temple.svg` | 1200x630+ | Location/blog surfaces | P0 |
| `/images/anand-sagar.svg` | 1200x630+ | Location cards/detail | P1 |
| `/images/pandharpur.svg` | 1200x630+ | Location cards/detail | P1 |
| `/images/trimbakeshwar.svg` | 1200x630+ | Location cards/detail | P1 |
| `/images/omkareshwar.svg` | 1200x630+ | Location cards/detail | P1 |
| `/logo/images-1.svg` | 512x512+ | Navbar branding | P0 |
| `/logo/logo.svg` | 512x512+ | Organization schema logo | P0 |

## Format guidance

- Preferred: WebP or high-quality JPEG for photos.
- Keep original source image optimized before upload.
- Avoid text-heavy hero images; keep clear subject and contrast.

## Delivery guidance

- Place files under `public/` using exact paths.
- Keep consistent naming so canonical metadata URLs remain stable.
- Re-run `npm run seo:check` after asset updates.

## Verification checklist

- [ ] Homepage hero loads a real image (not generated placeholder)
- [ ] Organization logo resolves to real file
- [ ] Location images resolve for all location cards/detail pages
- [ ] Social share previews use meaningful images
- [ ] Lighthouse mobile Performance and SEO scores stay stable after asset update
