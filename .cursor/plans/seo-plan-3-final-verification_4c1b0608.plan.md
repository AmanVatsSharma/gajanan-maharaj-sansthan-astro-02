---
name: seo-plan-3-final-verification
overview: Do a final, strict SEO verification pass for Plan 3, fix any remaining gaps, and provide a post-deploy Google Search Console checklist so the site has the strongest possible technical/on-page SEO foundation for ranking.
todos:
  - id: strict-seo-gate
    content: Run `npm run seo:check:strict`, fix failures, rerun until green.
    status: completed
  - id: ui-spot-checks
    content: Spot-check internal-link sections and taxonomy surfaces in UI for SEO + UX correctness.
    status: completed
  - id: schema-spot-checks
    content: Validate Article/HowTo/Breadcrumb structured data on representative pages via Rich Results Test.
    status: completed
  - id: post-deploy-gsc
    content: Complete GSC sitemap submission + indexing + monitoring checklist.
    status: completed
isProject: false
---

# SEO Plan 3 Closeout: Final Verification & Best-SEO Hardening

### Current assessment (from code + docs inspection)

- Plan 3 deliverables are present: 396 total posts (391 generated), denser interlinking, About/Contact/Locations/Footer guide sections, 5 related posts on `/blog/[slug]`, HowTo + speakable structured data, sitemap/robots/taxonomy coverage.
- TypeScript/lint checks for touched files show **no errors**.

### What we’ll do next (strict, final gate)

- Run the project’s strict SEO gate (`npm run seo:check:strict`) and fix anything that fails.
  - This covers: generator determinism, blog validation, canonical/robots/sitemap/taxonomy/blog-surface verifiers, docs-sync, build.
- Re-run `npm run generate:blogs` and `npm run validate:blog:strict` at the end to ensure content + linking remain compliant.

### Manual spot-checks (to ensure “best SEO” in the UI)

- Verify visible internal-link surfaces (desktop + mobile):
  - `/about` “Explore Our Guides” section (`[src/app/about/page.tsx](/home/amansharma/Desktop/DevOPS/Gajanan%20Maharaj%20Sansthan/src/app/about/page.tsx)`)
  - `/contact` “Planning Guides” section (`[src/app/contact/page.tsx](/home/amansharma/Desktop/DevOPS/Gajanan%20Maharaj%20Sansthan/src/app/contact/page.tsx)`)
  - `/locations` “Popular Guides by Location” section (`[src/app/locations/page.tsx](/home/amansharma/Desktop/DevOPS/Gajanan%20Maharaj%20Sansthan/src/app/locations/page.tsx)`)
  - Footer “Popular Guides” column (`[src/components/layout/Footer.tsx](/home/amansharma/Desktop/DevOPS/Gajanan%20Maharaj%20Sansthan/src/components/layout/Footer.tsx)`)
  - `/blog/[slug]` “Related Articles (5)” + “Browse by Category” (`[src/app/blog/[slug]/page.tsx](/home/amansharma/Desktop/DevOPS/Gajanan%20Maharaj%20Sansthan/src/app/blog/[slug]/page.tsx)`)
  - `/blog` category strip is above the fold via `[src/features/blog/components/BlogListingLayout.tsx](/home/amansharma/Desktop/DevOPS/Gajanan%20Maharaj%20Sansthan/src/features/blog/components/BlogListingLayout.tsx)`
- Validate structured data visually on a few representative pages using Google’s Rich Results Test (Article + HowTo + BreadcrumbList).

### If anything is not “best SEO”, the fixes will follow these principles

- Prefer **small, safe, verifiable** changes that improve crawlability, internal linking, and schema correctness.
- Avoid changes that could reduce quality (e.g., over-aggressive schema spam or making pages feel templated).

### Post-deploy checklist (non-code, required for ranking outcomes)

- Submit `sitemap.xml` in Google Search Console.
- Inspect a few key URLs (`/`, `/booking`, `/locations`, `/blog`, a few high-intent blog slugs) and request indexing.
- Monitor Coverage, Page indexing, and Enhancements reports for 7–14 days.
- Track queries/pages in GSC; iterate content/anchors on the pages that get impressions but low CTR.

