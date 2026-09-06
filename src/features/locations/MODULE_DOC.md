# Module: locations

**Short:** Locations directory + detail pages for Sansthan accommodations.

**Purpose:** Provide devotees a clear, mobile-friendly directory of Sansthan-managed accommodation locations (facilities, amenities, contacts) with a direct path to the booking request flow.

**Entry points:**
- `src/app/locations/page.tsx`
- `src/app/locations/[id]/page.tsx`

**Files:**
- `components/LocationCard.tsx` — location preview card with “Details” and “Book” CTAs
- `components/AmenityList.tsx` — amenity rendering for detail pages
- `MODULE_DOC.md` — this document

**Data source:**
- `src/data/sansthan-data.ts` — `sansthanLocations` (images, facilities, amenities, contacts)

**Flow diagram:**

```mermaid
flowchart TD
  user[User] --> locationsPage[LocationsPage]
  locationsPage --> card[LocationCard]
  card --> detail[LocationDetailPage]
  detail --> contact[WhatsAppOrCall_BookingHelp]
  detail --> bookingPage[BookingLandingPage_Optional]
```

**Behaviors:**
- **Mobile-first**: grid collapses to one column; room types table scrolls horizontally on small screens.
- **Performance**: uses Next `Image` for cards and the primary detail image to reduce layout shift.
- **Pre-rendered routes**: all known locations are statically generated for better crawlability and faster loads.
- **Booking CTA**: primary CTAs use WhatsApp/Call. The `/booking` landing page supports `?location=<id>` to preselect a location when linking from location pages.
- **Map trust signals**: each location includes a stable `googleMapsLink` for direct navigation from contact/location surfaces.
- **Geo SEO signals**: each location now includes coordinates used to generate geo meta tags on detail pages (`geo.position`, `geo.placename`, `geo.region`, `ICBM`).
- **Verification support**: `npm run verify:locations` validates canonical + geo meta + schema presence on all prerendered location detail pages.

**Dependencies:**
- **Data**: `src/data/sansthan-data.ts`
- **UI primitives**: `src/components/ui/*`
- **Libraries**: `next/image`, `lucide-react`

**Env vars:**
- None required.

**Tests:**
- Not yet added.

**Change-log:**
- 2026-02-05: Upgraded location images to Next `Image`, improved mobile table rendering, and aligned CTAs with booking request flow.
- 2026-02-13: All location contacts now use single number 8796359334 (via `src/data/contact.ts`).
- 2026-02-13: Standardized location names to "Shri Gajanan Maharaj Sansthan" + place (e.g., Shri Gajanan Maharaj Sansthan Shegaon, Shri Gajanan Maharaj Sansthan Pandharpur) across sansthan-data, FeaturedLocations, and Footer.
- 2026-02-13: Pre-rendered all location detail pages (`generateStaticParams` + `dynamicParams=false`) and aligned booking guidance with the lightweight `/booking` landing page.
- 2026-02-15: Added latitude/longitude metadata in `sansthan-data` and wired location geo meta tags through SEO metadata generation for stronger local search relevance.
- 2026-02-15: Location SEO cluster publishing expanded to include Shegaon, Omkareshwar, Pandharpur, and Trimbakeshwar blog guides with mandatory internal links to location detail pages.
- 2026-06-10: Updated location contacts to single number 7521063034 (via `src/data/contact.ts`).
- 2026-07-01: Updated location contacts to single number 9599417591 (via `src/data/contact.ts`).
- 2026-09-06: Updated location contacts to single number 7070604312 (via `src/data/contact.ts`).


