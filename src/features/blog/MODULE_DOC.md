# Blog Module Documentation

## Purpose
The Blog module manages SEO-focused content clusters and the presentation of blog content. It serves to inform devotees and visitors about news, events, location guides, spiritual articles, and updates related to the Sansthan.

## Key Components

### BlogCard
- **Path**: `src/features/blog/components/BlogCard.tsx`
- **Purpose**: Displays a summary of a blog post in a grid or list view.
- **Props**: `post: BlogPost`
- **Features**: Displays title, date, reading time, description, tags, and a link to the full article.

### BlogContent
- **Path**: `src/features/blog/components/BlogContent.tsx`
- **Purpose**: Renders the rich text content of a blog post.
- **Features**: Uses Tailwind Typography (`prose`) for styling HTML content derived from Markdown.

## Data Flow
- **Source**: Markdown files in `content/blog/` (recursive folders supported; `_templates` and `README.md` are excluded from publishing).
- **Parsing**: `src/lib/blog` handles parsing of frontmatter and markdown content.
- **Pages**:
  - `/blog`: Lists all posts using `getBlogPosts()`.
  - `/blog/page/[page]`: Static paginated archive pages for large post inventories.
  - `/blog/[slug]`: Displays a single post using `getBlogPost(slug)`.
  - `/blog/tag/[tag]`: Tag archive pages generated from blog frontmatter tags.
  - `/blog/category/[category]`: Category archive pages generated from blog frontmatter category.

## Quality & Validation Workflow

- Content generation script: `npm run generate:blogs` (`scripts/generate-seo-blog-cluster.mjs`)
- Validation script: `npm run validate:blog` (`scripts/validate-blog-content.mjs`)
- Generator manifest verifier: `npm run verify:generator` (`scripts/verify-generated-cluster-manifest.mjs`)
- Pagination navigation verifier: `npm run verify:pagination` (`scripts/verify-blog-pagination-links.mjs`)
- RSS feed verifier: `npm run verify:rss` (`scripts/verify-rss-feed.mjs`)
- Validation enforces:
  - Unique slug format
  - Required metadata fields
  - Required internal linking structure
  - Known location ID references
- Generator cleanup safety:
  - Tracks generated files in `content/blog/_ops/generated-seo-cluster-manifest.json`
  - Removes stale generated files on subsequent runs to keep cluster output deterministic when counts change
  - Uses shared targets from `scripts/seo-cluster-config.mjs` to keep generator and validator sizing in sync
  - Adds deterministic sibling cross-links within generated clusters to improve internal crawl graph continuity
  - Maintains minimum outbound `/blog/*` links per generated post to support crawl depth

## Blog Rendering Flow

```mermaid
flowchart TD
  markdown[content/blog/*.md] --> parse[getBlogPosts]
  parse --> archives[/blog/tag + /blog/category]
  parse --> listing[/blog]
  parse --> detail[/blog/[slug]]
  detail --> related[getRelatedPosts]
  listing --> card[BlogCard]
  detail --> content[BlogContent]
```

## Changelog
- **2026-02-13**: Initial module creation with BlogCard and BlogContent components.
- **2026-02-15**: Added recursive markdown loading, taxonomy helpers (tags/categories), related-post engine, tag/category SEO routes, blog listing JSON-LD schema, and seeded location-intent content cluster posts for Shegaon and Omkareshwar.
- **2026-02-18**: Expanded SEO content space to 496 posts (491 generated + existing), Plan 4 topic authority + interlinking (pillar injection, 9-10 relatedSlugs, About/Contact/Locations/Footer blog sections, 5 related posts, HowTo schema, speakable).
- **2026-02-15**: Expanded SEO content space to 110 posts (105 generated + existing), added deterministic cluster generator script, and introduced strict markdown validation checks for frontmatter/internal-link quality.
- **2026-02-15**: Added static blog pagination route (`/blog/page/[page]`) and sitemap coverage for paginated archives to improve UX at 100+ post scale.
