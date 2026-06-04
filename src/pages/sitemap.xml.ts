/**
 * File:        src/pages/sitemap.xml.ts
 * Module:      SEO · Sitemap Index
 * Purpose:     Sitemap index pointing to sitemap-core.xml (static pages) and sitemap-blog.xml (posts).
 *              Listing core sitemap first signals to Google to prioritise those URLs in its crawl queue.
 *
 * Exports:
 *   - GET() → Response   — serves the sitemap index XML
 *
 * Depends on:
 *   - @/lib/seo/site-url — canonical origin
 *
 * Side-effects:
 *   - none
 *
 * Key invariants:
 *   - prerender = true so the file is emitted at build time, not on every request
 *   - sitemap-core.xml must be listed first so Google prioritises core pages
 *
 * Read order:
 *   1. GET — the only export
 *
 * Author:      Aman Sharma
 * Last-updated: 2026-05-03
 */

import type { APIRoute } from "astro";
import { getSiteUrl } from "@/lib/seo/site-url";

export const prerender = true;

export const GET: APIRoute = () => {
  const siteUrl = getSiteUrl();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${siteUrl}/sitemap-core.xml</loc></sitemap>
  <sitemap><loc>${siteUrl}/sitemap-blog.xml</loc></sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
