/**
 * File:        src/pages/sitemap-blog.xml.ts
 * Module:      SEO · Blog Sitemap
 * Purpose:     Sitemap covering blog content surfaces:
 *                - individual post URLs (`/blog/<slug>`)
 *                - category landing pages (`/blog/category/<slug>`)
 *                - tag landing pages (`/blog/tag/<slug>`)
 *                - paginated index pages 2..N (`/blog/page/<n>`)
 *              Lastmod for taxonomy pages is the most-recent post date
 *              in that taxonomy, so crawlers re-fetch them when content
 *              actually changes.
 *
 * Exports:
 *   - GET() → Response   — serves application/xml
 *
 * Depends on:
 *   - @/lib/blog        — getBlogPosts / getCategories / getTags / paginate / BLOG_PAGE_SIZE
 *   - @/lib/seo/site-url — canonical origin
 *
 * Side-effects:
 *   - none
 *
 * Key invariants:
 *   - prerender = true so the sitemap is emitted at build time
 *   - paginated index page 1 is omitted (it duplicates /blog, which lives in sitemap-core)
 *
 * Read order:
 *   1. collectTaxonomyLastmod — picks the latest post date per taxonomy slug
 *   2. GET                    — assembles the <urlset> and returns
 *
 * Author:      Aman Sharma
 * Last-updated: 2026-06-04
 */

import type { APIRoute } from "astro";
import {
  BLOG_PAGE_SIZE,
  getBlogPosts,
  getCategories,
  getTags,
  paginate,
  toTaxonomySlug,
} from "@/lib/blog";
import { getSiteUrl } from "@/lib/seo/site-url";

export const prerender = true;

function urlEntry(loc: string, lastmod: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

function collectTaxonomyLastmod(): {
  byCategory: Map<string, string>;
  byTag: Map<string, string>;
} {
  const byCategory = new Map<string, string>();
  const byTag = new Map<string, string>();

  for (const post of getBlogPosts()) {
    const postDate = post.date;

    const catSlug = toTaxonomySlug(post.category);
    const existingCat = byCategory.get(catSlug);
    if (!existingCat || postDate > existingCat) {
      byCategory.set(catSlug, postDate);
    }

    for (const tag of post.tags) {
      const tagSlug = toTaxonomySlug(tag);
      const existingTag = byTag.get(tagSlug);
      if (!existingTag || postDate > existingTag) {
        byTag.set(tagSlug, postDate);
      }
    }
  }

  return { byCategory, byTag };
}

export const GET: APIRoute = () => {
  const siteUrl = getSiteUrl();
  const posts = getBlogPosts();
  const { byCategory, byTag } = collectTaxonomyLastmod();

  const chunks: string[] = [];

  // 1. Individual post URLs
  for (const post of posts) {
    chunks.push(urlEntry(`${siteUrl}/blog/${post.slug}`, post.date));
  }

  // 2. Category pages
  for (const cat of getCategories()) {
    const lastmod = byCategory.get(cat.slug) ?? "2026-01-01";
    chunks.push(urlEntry(`${siteUrl}/blog/category/${cat.slug}`, lastmod));
  }

  // 3. Tag pages
  for (const tag of getTags()) {
    const lastmod = byTag.get(tag.slug) ?? "2026-01-01";
    chunks.push(urlEntry(`${siteUrl}/blog/tag/${tag.slug}`, lastmod));
  }

  // 4. Paginated index pages 2..N (page 1 lives at /blog, listed in sitemap-core)
  const { totalPages } = paginate(posts, 1, BLOG_PAGE_SIZE);
  const newestDate = posts[0]?.date ?? "2026-01-01";
  for (let page = 2; page <= totalPages; page += 1) {
    chunks.push(urlEntry(`${siteUrl}/blog/page/${page}`, newestDate));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
