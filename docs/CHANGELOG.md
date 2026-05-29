# Changelog

## 2026-02-18 — SEO Plan 4: +100 Blogs + Stronger Topic Authority (Generator-only)

### Summary

- **Content**: 496 total posts (491 generated), +100 generated posts added via deterministic cluster expansion
- **Topic authority**: Pillar guide injection into `relatedSlugs` + inline contextual link for every generated post
- **Taxonomy hubs**: Category/tag pages now surface a small featured-pillars block for stronger hub-to-article discovery
- **Keywords**: Expanded Bhakta/Bhakt Niwas booking + contact + refund/cancellation + check-in/out + route long-tails

### Changes

1. **Cluster config** (`scripts/seo-cluster-config.mjs`)
   - Shegaon: 100 → 135, Omkareshwar: 75 → 87, Pandharpur: 55 → 65, Trimbakeshwar: 55 → 63
   - Guides: 58 → 78, Spiritual: 24 → 32, Events: 24 → 31

2. **Generator** (`scripts/generate-seo-blog-cluster.mjs`)
   - LOCATION_TOPIC_VARIANTS: 100 → 135 (Bhakta Niwas room types, check-in/out, refunds, WhatsApp templates, additional routes)
   - CROSS_LOCATION_GUIDE_VARIANTS: 58 → 78 (Bhakta Niwas pillars + Sheogaon/Triambakeshwar spelling-intent guides)
   - SPIRITUAL_POST_VARIANTS: 24 → 32, EVENT_POST_VARIANTS: 24 → 31
   - Added `PILLAR_GUIDE_SLUGS` and ensured every generated post includes pillar slugs in `relatedSlugs` plus an inline contextual pillar link

3. **SEO constants** (`src/lib/seo/constants.ts`)
   - Added exact-match long-tail keywords: Bhakta/Bhakt Niwas online booking, WhatsApp/phone variants, refund/cancellation, check-in/out, room types
   - Added additional route keywords (Mumbai/Pune/Nagpur corridors + MP connectors)

4. **Taxonomy hub UX** (`src/app/blog/category/[category]/page.tsx`, `src/app/blog/tag/[tag]/page.tsx`)
   - Added “Featured planning guides” block using `getPostsBySlugs` for curated pillar discovery

## 2026-02-18 — SEO Plan 3: 100 More Blogs and Enhanced Interlinking

### Summary

- **Content**: 396 total posts (391 generated), 100 new posts across all clusters
- **Interlinking**: 9-10 relatedSlugs per post, 3rd inline link, tag/category footer, About/Contact/Locations/Footer blog sections, 5 related posts per blog
- **Keywords**: Buldhana, Maharashtra pilgrimage, Anand Vihar, Visawa, regional routes, contact numbers
- **Technical**: HowTo schema for guides, Article speakable for voice search

### Changes

1. **Cluster config** (`scripts/seo-cluster-config.mjs`)
   - Shegaon: 72 → 100, Omkareshwar: 53 → 75, Pandharpur: 40 → 55, Trimbakeshwar: 40 → 55
   - Guides: 46 → 58, Spiritual: 19 → 24, Events: 21 → 24

2. **Constants** (`src/lib/seo/constants.ts`)
   - Added Buldhana, Maharashtra pilgrimage, Vidarbha, Akola/Jalgaon routes, Anand Vihar, Visawa keywords
   - Added long-tail: contact number, phone number, bhakta niwas online booking

3. **Generator** (`scripts/generate-seo-blog-cluster.mjs`)
   - 28 new LOCATION_TOPIC_VARIANTS (100 Shegaon), 12 CROSS_LOCATION_GUIDE_VARIANTS, 5 SPIRITUAL, 3 EVENT
   - TERTIARY_PILLAR_SLUGS for guides/spiritual/events
   - relatedSlugs: 7 → 9-10, 3rd inline link, tag/category footer in each post

4. **Page interlinking**
   - About: "Explore Our Guides" section with getPostsBySlugs
   - Contact: "Planning Guides" section with 4 high-intent links
   - Locations: "Popular Guides by Location" with BlogCards
   - Footer: "Popular Guides" column with 5 links

5. **Blog post page** (`src/app/blog/[slug]/page.tsx`)
   - getRelatedPosts(post, 3) → getRelatedPosts(post, 5)
   - "Browse by Category" links when post has category

6. **Structured data** (`src/lib/seo/structured-data.ts`)
   - getHowToSchema(title, description, steps) for guide posts
   - Article schema: speakable (SpeakableSpecification) for voice search

---

## 2026-02-18 — SEO Plan 2: Robust Interlinking and Content Upgrade

### Summary

- **Interlinking**: Cross-cluster pillars, inline contextual links, 6-7 relatedSlugs per post, MIN 5 outbound blog links
- **Location pages**: Related Guides section with getPostsByLocationId
- **Homepage**: FeaturedGuides section (Popular Pilgrimage Guides)
- **Booking page**: Planning Resources subsection with high-intent blog links
- **Content**: 296 total posts (291 generated), deeper templates with FAQ sections, 80 new topic variants
- **Technical**: WebSite SearchAction schema for blog discovery

### Changes

1. **Generator** (`scripts/generate-seo-blog-cluster.mjs`)
   - CROSS_CLUSTER_PILLAR_MAP for Shegaon, Omkareshwar, Pandharpur, Trimbakeshwar
   - getExtendedNeighborSlugs (index ± 2) for denser graphs
   - Inline contextual links in location post body
   - 15 new LOCATION_TOPIC_VARIANTS, 15 CROSS_LOCATION_GUIDE_VARIANTS, 8 SPIRITUAL, 10 EVENT
   - Deeper content: FAQ subsection, location-specific tips, cross-location travel tips

2. **Cluster config** (`scripts/seo-cluster-config.mjs`)
   - Shegaon: 57 → 72, Omkareshwar: 41 → 53, Pandharpur: 30 → 40, Trimbakeshwar: 30 → 40
   - Guides: 31 → 46, Spiritual: 11 → 19, Events: 11 → 21

3. **Blog lib** (`src/lib/blog/posts.ts`)
   - getPostsByLocationId(locationId, limit)
   - getPostsBySlugs(slugs)

4. **Location pages** (`src/app/locations/[id]/page.tsx`)
   - Related Guides section with 4-6 BlogCards

5. **Homepage** (`src/app/page.tsx`)
   - FeaturedGuides component with 8 curated guide links

6. **Booking page** (`src/app/booking/page.tsx`)
   - Planning Resources section with 4 high-intent blog links

7. **Validator** (`scripts/validate-blog-content.mjs`)
   - MIN_GENERATED_OUTBOUND_BLOG_LINKS: 3 → 5

8. **Structured data** (`src/lib/seo/structured-data.ts`)
   - WebSite schema: potentialAction SearchAction for /blog discovery

---

## 2026-02-18 — SEO Audit and 100-Blog Expansion

### Summary

- **SEO Score**: 78/100 (Technical 22/25, Content 18/25, Local 14/15, UX 14/15, Volume 10/20)
- **Blog expansion**: Added 100+ new posts (total 216 publishable)
- **Keyword variants**: Sheogaon, Triambakeshwar, Bhakta Niwas coverage expanded

### Changes

1. **SEO constants** (`src/lib/seo/constants.ts`)
   - Added Sheogaon spelling variant keywords (sheogaon temple, sheogaon accommodation, sheogaon bhakta niwas)
   - Added Triambakeshwar spelling variant (triambakeshwar accommodation, triambakeshwar jyotirlinga)
   - Expanded Bhakta Niwas keywords (bhakta niwas shegaon, bhakta niwas booking, bhakt niwas accommodation)
   - Added long-tail variants for bhakta niwas contact, omkareshwar bhakt niwas

2. **Blog cluster config** (`scripts/seo-cluster-config.mjs`)
   - Shegaon: 30 → 57
   - Omkareshwar: 20 → 41
   - Pandharpur: 15 → 30
   - Trimbakeshwar: 15 → 30
   - Guides: 15 → 31
   - Spiritual: 5 → 11
   - Events: 5 → 11

3. **Blog generator** (`scripts/generate-seo-blog-cluster.mjs`)
   - Added 29 new LOCATION_TOPIC_VARIANTS (Bhakta Niwas, Sheogaon, Triambakeshwar, Omkareshwar Bhakt Niwas focus)
   - Added 16 new CROSS_LOCATION_GUIDE_VARIANTS
   - Added 6 new SPIRITUAL_POST_VARIANTS
   - Added 6 new EVENT_POST_VARIANTS
   - Updated keyword seeds for Shegaon, Omkareshwar, Trimbakeshwar

4. **Generated content**
   - 211 new/regenerated blog posts
   - 5 manual seed posts retained (shegaon-travel-guide, nearby-places-from-shegaon, shegaon-accommodation-guide, omkareshwar-darshan-timings, welcome-to-sansthan)

### Target keywords now covered

- bhakta niwas shegaon, bhakta niwas booking, bhakt niwas accommodation
- gajanan maharaj sansthan shegaon, gajanan maharaj sansthan booking
- shegaon temple, sheogaon temple, sheogaon accommodation
- omkareshwar bhakt niwas, omkareshwar temple stay
- trimbakeshwar accommodation, triambakeshwar jyotirlinga
- pandharpur temple stay, pandharpur wari planning
