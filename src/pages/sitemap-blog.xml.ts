/**
 * File:        src/pages/sitemap-blog.xml.ts
 * Module:      SEO · Blog Sitemap
 * Purpose:     Sitemap for all blog posts, pagination pages, tag archives, and category archives.
 *              Separated from core sitemap so Google processes high-priority static pages first
 *              before spending crawl budget on the 496-post blog corpus.
 *
 * Exports:
 *   - GET() → Response   — serves the blog sitemap XML
 *
 * Depends on:
 *   - @/lib/blog         — getBlogPosts, getAllTags, getAllCategories, toTaxonomySlug, BLOG_POSTS_PER_PAGE
 *   - @/lib/seo/site-url — canonical origin
 *
 * Side-effects:
 *   - none
 *
 * Key invariants:
 *   - lastmod for blog posts uses file mtime (set during parse in posts.ts), not build time
 *   - noIndex posts are still listed in the sitemap — Google uses sitemap for discovery;
 *     the noindex meta tag on the rendered page is what actually suppresses indexing
 *
 * Read order:
 *   1. getLatestBlogDate — used for pagination + taxonomy lastmod
 *   2. GET — builds and returns the XML
 *
 * Author:      Aman Sharma
 * Last-updated: 2026-05-03
 */

import type { APIRoute } from "astro";
import {
  BLOG_POSTS_PER_PAGE,
  getAllCategories,
  getAllTags,
  getBlogPosts,
  toTaxonomySlug,
} from "@/lib/blog";
import { getSiteUrl } from "@/lib/seo/site-url";

export const prerender = true;

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function isoDate(d: Date): string {
  return d.toISOString().split("T")[0] ?? "";
}

function getLatestBlogDate(
  posts: Array<{ date: string; lastModified?: string }>
): Date | null {
  if (posts.length === 0) return null;
  const timestamps = posts.map((p) => new Date(p.lastModified || p.date).getTime());
  return new Date(Math.max(...timestamps));
}

export const GET: APIRoute = async () => {
  const siteUrl = getSiteUrl();

  const [blogPosts, tags, categories] = await Promise.all([
    getBlogPosts(),
    getAllTags(),
    getAllCategories(),
  ]);

  const now = new Date();
  const latestBlogDate = getLatestBlogDate(blogPosts) ?? now;
  const latestBlogStr = isoDate(latestBlogDate);
  const totalBlogPages = Math.max(1, Math.ceil(blogPosts.length / BLOG_POSTS_PER_PAGE));

  const chunks: string[] = [];

  for (const post of blogPosts) {
    const lm = new Date(post.lastModified || post.date);
    chunks.push(
      urlEntry(`${siteUrl}/blog/${post.slug}`, isoDate(lm), "weekly", "0.75")
    );
  }

  for (let page = 2; page <= totalBlogPages; page++) {
    chunks.push(
      urlEntry(`${siteUrl}/blog/page/${page}`, latestBlogStr, "weekly", "0.6")
    );
  }

  for (const tag of tags) {
    const tagPosts = blogPosts.filter((post) =>
      (post.tags ?? []).some((postTag) => toTaxonomySlug(postTag) === tag)
    );
    const tagLm = getLatestBlogDate(tagPosts) ?? latestBlogDate;
    chunks.push(
      urlEntry(`${siteUrl}/blog/tag/${tag}`, isoDate(tagLm), "weekly", "0.65")
    );
  }

  for (const category of categories) {
    const categoryPosts = blogPosts.filter((post) =>
      post.category ? toTaxonomySlug(post.category) === category : false
    );
    const catLm = getLatestBlogDate(categoryPosts) ?? latestBlogDate;
    chunks.push(
      urlEntry(`${siteUrl}/blog/category/${category}`, isoDate(catLm), "weekly", "0.7")
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
