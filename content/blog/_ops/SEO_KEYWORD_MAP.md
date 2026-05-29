# SEO Keyword-to-Page Map (Cannibalization Guard)

This map defines which page type should own which query family, so cluster growth does not create ranking cannibalization.

## Ownership Rules

| Query Intent Family | Primary Owner | Secondary Support |
|---|---|---|
| Brand + official site (`shri/shree/sri gajanan maharaj sansthan`) | `/` home page | `/about`, `/contact` |
| Booking + accommodation intent | `/booking` | `/locations/*`, relevant location blogs |
| Location core intent (`... shegaon`, `... omkareshwar`, `... pandharpur`, `... trimbakeshwar`) | `/locations/*` detail pages | `content/blog/locations/*` posts |
| Darshan timing informational intent | `content/blog/locations/*-darshan-*` | `/locations/*`, `/blog/tag/darshan` |
| Route/travel/how-to intent | `content/blog/locations/*-route-*`, `content/blog/guides/*` | `/blog`, `/locations` |
| Family checklist/FAQ intent | `content/blog/locations/*-faq*`, `content/blog/guides/*checklist*` | `/booking`, `/contact` |
| Spiritual teaching intent | `content/blog/spiritual/*` | `/about` |
| Festival/event crowd planning intent | `content/blog/events/*` | `/blog/category/events` |

## Slug and Linking Guardrails

1. One post = one dominant keyword intent.
2. Never create two slugs targeting the exact same head keyword phrase.
3. Every post must link:
   - one `/locations/*` page
   - one `/booking` or `/contact`
   - one or more related `/blog/*` pages
4. If a new post collides with an existing head term, update existing content instead of adding a duplicate intent page.

## Cluster Overview (Current)

- Shegaon location cluster: high-priority authority pillar
- Omkareshwar location cluster: jyotirlinga + timing + stay intent
- Pandharpur location cluster: pilgrimage stay + darshan support
- Trimbakeshwar location cluster: jyotirlinga travel + family stay
- Cross-location guides: itinerary, route, and planning consolidation
- Spiritual/events clusters: supportive long-tail topical breadth

## Decision Flow

```mermaid
flowchart TD
  query[New target query] --> intent{Intent type?}
  intent -->|Booking| booking[/booking page optimization]
  intent -->|Location-core| location[/locations/<id>]
  intent -->|Informational| blog[Create/Update blog post]
  intent -->|Brand/entity| home[/ home + about]
  blog --> collision{Existing post with same head term?}
  collision -->|Yes| update[Update existing post and strengthen links]
  collision -->|No| create[Create new markdown post]
```
