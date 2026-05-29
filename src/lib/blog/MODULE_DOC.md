# Module: lib/blog

**Short:** Markdown ingestion, parsing, taxonomy, and related-post intelligence for SEO blog routes.

## Purpose

Load markdown posts from `content/blog`, normalize frontmatter, parse markdown to HTML, and expose APIs used by blog pages, archives, sitemap generation, and RSS feed.

## Public API

- `getBlogPosts()` — returns all posts sorted by latest date.
- `getBlogPost(slug)` — returns a single post.
- `getAllTags()` / `getAllCategories()` — normalized taxonomy slugs for static paths.
- `getPostsByTag(tag)` / `getPostsByCategory(category)` — archive filters.
- `getTagSummaries()` / `getCategorySummaries()` — UI summaries.
- `getRelatedPosts(post)` — explicit + score-based related content.
- `toTaxonomySlug()` / `formatTaxonomyLabel()` — taxonomy normalization.

## Internal safeguards

- Recursively scans markdown folders and ignores `_` prefixed paths + README files.
- Throws hard error on duplicate slugs.
- Emits debug and warning logs for parsing and metadata quality checks.
- Catches per-file parser errors and emits structured diagnostics before failing.
- Validator strict mode available via `npm run validate:blog:strict` to fail on warnings during stricter release checks.
- Generator manifest distribution verifier available via `npm run verify:generator` to enforce deterministic cluster-size output.
- Manual seed verifier available via `npm run verify:manual-seeds` to enforce anchor-post ownership boundaries and quality.
- Validator cross-post checks enforce:
  - minimum post inventory (`>=100`),
  - `relatedSlugs` integrity,
  - internal `/blog/<slug>` and `/locations/<id>` target existence,
  - inbound internal-link graph health (orphan-post prevention with explicit exemptions),
  - generated-post outbound blog-link minimums (>=3 links),
  - generated manifest config-fingerprint consistency with shared cluster config,
  - generated manifest version/checksum count consistency,
  - managed namespace ownership consistency (manifest-owned files + explicit manual seeds),
  - generated cluster manifest integrity for deterministic generator output,
  - location-cluster minimum thresholds (`30/20/15/15` baseline),
  - Shri/Shree/Sri + Sansthan/Sanstan keyword-fragment coverage.
- Prerender integrity checker available via `npm run verify:taxonomy` to ensure all tag/category/paginated archive pages are generated.
- Blog post SEO-surface verifier available via `npm run verify:blog-surfaces` to validate canonical/meta/schema signals on every post route.

## Blog data processing flow

```mermaid
flowchart TD
  files[content/blog/**/*.md] --> matter[gray-matter frontmatter parse]
  matter --> normalize[slug/date/tags/category normalization]
  normalize --> markdown[parseMarkdown to HTML]
  markdown --> postObj[BlogPost object]
  postObj --> sorting[Date sort newest first]
  sorting --> consumers[/blog pages + sitemap + feed]
```

## Changelog

- **2026-02-13**: Initial parser + markdown conversion utilities added.
- **2026-02-15**: Recursive content discovery, taxonomy helpers, and related-post scoring introduced.
- **2026-02-15**: Added runtime debug/error logging and metadata-quality warning instrumentation for SEO-scale content operations.
- **2026-02-15**: Strengthened validator with location-cluster minimum and brand-variant keyword coverage assertions.
