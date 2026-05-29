---
name: Complete SEO Implementation
overview: Implement comprehensive SEO optimization including structured data, enhanced metadata, Google Analytics integration, image optimization, and technical SEO improvements to rank on Google for accommodation and booking-related searches.
todos:
  - id: structured_data
    content: Create structured data schemas (Organization, LocalBusiness, PlaceOfWorship, LodgingBusiness)
    status: completed
  - id: page_metadata
    content: Add page-specific metadata exports for all routes (home, locations, booking, about, contact)
    status: completed
  - id: enhanced_sitemap
    content: Enhance sitemap with images, lastmod dates, and optimized priorities
    status: completed
  - id: google_analytics
    content: Integrate Google Analytics 4 with event tracking for bookings and interactions
    status: completed
  - id: image_optimization
    content: Convert images to Next.js Image component with proper alt texts and sizing
    status: completed
  - id: technical_seo
    content: Add canonical URLs, meta robots, and improve heading hierarchy
    status: completed
  - id: performance
    content: Optimize Core Web Vitals (LCP, CLS, INP) and update next.config.ts
    status: completed
  - id: local_seo
    content: Enhance location-specific content and ensure NAP consistency
    status: completed
  - id: faq_schema
    content: Create FAQ section with structured data for booking-related questions
    status: completed
  - id: monitoring
    content: Set up Search Console monitoring and submit enhanced sitemap
    status: completed
isProject: false
---

# Complete SEO Implementation Plan

## Current State

- ✅ Basic sitemap exists at `[src/app/sitemap.ts](src/app/sitemap.ts)`
- ✅ Robots.txt exists at `[src/app/robots.ts](src/app/robots.ts)`
- ✅ Global metadata in `[src/app/layout.tsx](src/app/layout.tsx)`
- ❌ No page-specific metadata
- ❌ No structured data (JSON-LD)
- ❌ No Google Analytics integration
- ❌ No image optimization for SEO

## 1. Structured Data (JSON-LD Schemas)

Add JSON-LD structured data to help Google understand your content better:

### Organization Schema

Create `[src/lib/seo/structured-data.ts](src/lib/seo/structured-data.ts)` with schemas for:

- **Organization**: Main Sansthan details, logo, contact info, social profiles
- **Local Business**: Each of the 6 location-specific schemas with address, phone, opening hours
- **Place of Worship**: Hindu temple designation for each location
- **Lodging Business**: Accommodation details with pricing, amenities for booking-focused SEO

### Breadcrumb Schema

Add breadcrumb navigation with structured data for better SERP display

## 2. Page-Specific Metadata Enhancement

Update all pages to export their own metadata:

### Home Page `[src/app/page.tsx](src/app/page.tsx)`

- Title: "Shri Gajanan Maharaj Sansthan | Temple Accommodation & Booking"
- Description: Focus on accommodation + devotee services
- Keywords: gajanan maharaj temple booking, shegaon accommodation, temple stay Maharashtra
- Open Graph image: Hero temple image

### Location Pages `[src/app/locations/[id]/page.tsx](src/app/locations/[id]/page.tsx)`

- Dynamic metadata per location
- City-specific keywords (e.g., "Shegaon temple accommodation", "Pandharpur temple booking")
- Location-specific Open Graph images
- Geo meta tags (latitude, longitude)

### Booking Page `[src/app/booking/page.tsx](src/app/booking/page.tsx)`

- Transactional keywords: "book temple accommodation", "reserve dharamshala"
- Clear CTA in description
- FAQ schema for booking process

### About & Contact Pages

- Entity-building metadata
- Local business information
- Contact structured data

## 3. Enhanced Sitemap

Update `[src/app/sitemap.ts](src/app/sitemap.ts)` to include:

- Image sitemap entries for all location images (27 gallery images + 6 location images)
- `lastmod` timestamps from file system or git history
- Better priority distribution:
  - Home: 1.0
  - Locations (main): 0.9
  - Individual locations: 0.8
  - Booking: 0.9
  - About/Contact: 0.6
- `changefreq` based on content type

## 4. Google Analytics 4 Integration

### Setup GA4

- Create utility component `[src/components/analytics/GoogleAnalytics.tsx](src/components/analytics/GoogleAnalytics.tsx)`
- Add GA4 tracking ID to `.env`
- Integrate in root layout with Next.js Script component (strategy="afterInteractive")

### Event Tracking

- Track booking form submissions
- Track WhatsApp click events
- Track location page views
- Track phone number clicks (conversion events)

### Privacy Compliance

- Add cookie consent banner (optional but recommended)
- Privacy policy page with analytics disclosure

## 5. Image Optimization

### Current State

Images in `/public/gallery/` and `/public/images/` need optimization

### Actions

- Convert all JPEGs to Next.js Image component with proper sizing
- Add descriptive alt texts following pattern: "Shri Gajanan Maharaj Temple [Location] - [Feature/View]"
- Generate multiple sizes for responsive loading
- Add lazy loading for below-the-fold images
- Compress images without quality loss
- Add Open Graph specific images (1200x630px) for social sharing

### Update Components

- `[src/features/locations/LocationCard.tsx](src/features/locations/LocationCard.tsx)`
- `[src/features/locations/LocationGallery.tsx](src/features/locations/LocationGallery.tsx)`
- `[src/features/info/Hero.tsx](src/features/info/Hero.tsx)`

## 6. Technical SEO Improvements

### Canonical URLs

Add canonical links to all pages pointing to [https://www.gajananmaharajsanstan.com/](https://www.gajananmaharajsanstan.com/)

### Meta Robots

Add appropriate robots directives:

- Index, follow for main pages
- Noindex for booking success/error states

### Heading Hierarchy

Audit and fix heading structure (H1 → H2 → H3) across all pages

### Internal Linking

Add contextual internal links between pages for better crawlability

### 404 & Error Pages

Enhance `[src/app/not-found.tsx](src/app/not-found.tsx)` with helpful links and proper status codes

## 7. Performance Optimization (Core Web Vitals)

Google uses Core Web Vitals as ranking factors:

### LCP (Largest Contentful Paint)

- Optimize hero images with priority loading
- Preload critical fonts (Inter, Playfair Display)

### CLS (Cumulative Layout Shift)

- Add explicit width/height to all images
- Reserve space for dynamic content

### FID/INP (Interaction to Next Paint)

- Optimize booking form rendering
- Lazy load non-critical components

### Configuration

Update `[next.config.ts](next.config.ts)`:

- Enable image optimization
- Configure image domains if using external images
- Add compression
- Enable static optimization where possible

## 8. Local SEO Enhancement

Focus on local search optimization:

### Location-Specific Content

- Add detailed area descriptions (Shegaon, Pandharpur, etc.)
- Mention nearby landmarks and transportation
- Add directions from major cities

### NAP Consistency

Ensure Name, Address, Phone is consistent across:

- All pages
- Structured data
- Footer
- Contact page

### Google Business Profile Integration

- Ensure each location is listed on Google Business Profile
- Add photos, hours, booking links
- Encourage devotee reviews

## 9. Content Optimization

### Keyword Integration

Target keywords for accommodation focus:

- Primary: "gajanan maharaj temple booking", "shegaon dharamshala", "temple accommodation Maharashtra"
- Secondary: "devotee stay shegaon", "pandharpur temple rooms", "bhakt niwas booking"
- Long-tail: "how to book accommodation at gajanan maharaj temple"

### Add FAQ Section

Create FAQ component with Schema markup:

- Booking process questions
- Accommodation details
- Visit planning
- Facilities and amenities

### Testimonials Schema

Add Review/Rating schema to testimonials section for star ratings in SERP

## 10. Monitoring & Analytics Setup

### Search Console Integration

- Verify domain property in Google Search Console (already have access)
- Submit sitemap: [https://www.gajananmaharajsanstan.com/sitemap.xml](https://www.gajananmaharajsanstan.com/sitemap.xml)
- Set up email alerts for indexing issues

### Create Monitoring Dashboard

Document key metrics to track:

- Organic traffic growth
- Booking page conversions
- Top performing keywords
- Core Web Vitals scores
- Index coverage status

### robots.txt Enhancement

Update `[src/app/robots.ts](src/app/robots.ts)`:

- Add specific rules for assets
- Reference image sitemap
- Add crawl delay if needed

## 11. Social Media & Open Graph

### Enhanced OG Tags

- Location-specific OG images (temple photos)
- Twitter Card optimization
- WhatsApp preview optimization

### Social Sharing

- Add social share buttons (optional)
- Optimize preview for different platforms

## File Structure After Implementation

```
src/
├── app/
│   ├── layout.tsx (✅ already has global metadata)
│   ├── page.tsx (➕ add metadata export)
│   ├── sitemap.ts (🔧 enhance with images)
│   ├── robots.ts (🔧 enhance)
│   ├── locations/
│   │   ├── page.tsx (➕ add metadata)
│   │   └── [id]/page.tsx (➕ add dynamic metadata)
│   ├── booking/page.tsx (➕ add metadata + FAQ schema)
│   ├── about/page.tsx (➕ add metadata)
│   └── contact/page.tsx (➕ add metadata + contact schema)
├── components/
│   ├── analytics/
│   │   └── GoogleAnalytics.tsx (➕ new)
│   └── seo/
│       ├── StructuredData.tsx (➕ new)
│       ├── Breadcrumbs.tsx (➕ new)
│       └── FAQ.tsx (➕ new)
├── lib/
│   └── seo/
│       ├── structured-data.ts (➕ new - schema generators)
│       ├── metadata.ts (➕ new - metadata helpers)
│       └── constants.ts (➕ new - SEO constants)
└── data/
    └── faq.ts (➕ new - FAQ content)
```

## Implementation Priority

**Phase 1 (Immediate Impact):**

1. Page-specific metadata for all routes
2. Structured data (Organization + Local Business)
3. Google Analytics integration
4. Enhanced sitemap with images

**Phase 2 (Technical Foundation):**
5. Image optimization across site
6. Canonical URLs
7. robots.txt refinement
8. Performance optimization (Core Web Vitals)

**Phase 3 (Content & Local SEO):**
9. FAQ section with schema
10. Local SEO content enhancement
11. Breadcrumbs
12. Internal linking strategy

**Phase 4 (Monitoring):**
13. Search Console setup & sitemap submission
14. Analytics dashboard configuration
15. Regular monitoring and optimization

## Expected Outcomes

- **1-2 weeks**: Site indexed with rich snippets in Google
- **2-4 weeks**: Location pages ranking for local searches
- **1-2 months**: Booking page ranking for accommodation keywords
- **2-3 months**: Top 10 rankings for target keywords with good CTR

## Post-Implementation Checklist

- Submit sitemap to Google Search Console
- Verify all structured data with Google Rich Results Test
- Test Open Graph tags with Facebook/LinkedIn debugger
- Run Lighthouse audit (target: 90+ SEO score)
- Check mobile usability in Search Console
- Set up Google Business Profile for all 6 locations
- Monitor Core Web Vitals weekly
- Track booking conversions in GA4
- Request indexing for important pages via Search Console

