/**
 * File:        src/pages/sitemap-core.xml.ts
 * Module:      SEO · Core Sitemap
 * Purpose:     Sitemap for high-priority static pages and location pages (~25 URLs).
 *              Uses stable hardcoded lastmod dates so Google doesn't waste crawl budget
 *              re-crawling unchanged pages on every build.
 *
 * Exports:
 *   - GET() → Response   — serves the core sitemap XML
 *
 * Depends on:
 *   - @/data/sansthan-data — location IDs for /locations/* URLs
 *   - @/lib/blog           — latest blog date for /blog listing page lastmod
 *   - @/lib/seo/site-url   — canonical origin
 *
 * Side-effects:
 *   - none
 *
 * Key invariants:
 *   - STATIC_PAGE_LASTMOD dates must be updated manually when a page's content changes
 *   - /blog lastmod is dynamic (latest post date) since the listing changes with every new post
 *
 * Read order:
 *   1. STATIC_PAGE_LASTMOD — lastmod source of truth for static pages
 *   2. GET — builds and returns the XML
 *
 * Author:      Aman Sharma
 * Last-updated: 2026-05-03
 */

import type { APIRoute } from "astro";
import { sansthanLocations } from "@/data/sansthan-data";
import { getSiteUrl } from "@/lib/seo/site-url";

export const prerender = true;

// Update a path's date only when that page's actual content changes.
// Keeping these stable prevents Google from wasting crawl budget re-visiting
// pages that haven't changed just because we deployed.
const STATIC_PAGE_LASTMOD: Record<string, string> = {
  "/":                "2026-04-25",
  "/booking":         "2026-04-25",
  "/bhakta-niwas":    "2026-04-25",
  "/darshan-timings": "2026-03-01",
  "/how-to-reach":    "2026-03-01",
  "/locations":       "2026-04-01",
  "/about":           "2026-02-01",
  "/contact":         "2026-02-01",
  "/privacy-policy":  "2026-01-01",
  "/terms-conditions":"2026-01-01",
  "/refund-policy":   "2026-01-01",
  "/disclaimer":      "2026-01-01",
};

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


export const GET: APIRoute = async () => {
  const siteUrl = getSiteUrl();

  
  const chunks: string[] = [];

  const staticPages: Array<{ path: string; changefreq: string; priority: string }> = [
    { path: "/",                 changefreq: "weekly",  priority: "1.0" },
    { path: "/booking",          changefreq: "weekly",  priority: "0.9" },
    { path: "/bhakta-niwas",     changefreq: "weekly",  priority: "0.9" },
    { path: "/locations",        changefreq: "weekly",  priority: "0.9" },
    { path: "/darshan-timings",  changefreq: "monthly", priority: "0.85" },
    { path: "/how-to-reach",     changefreq: "monthly", priority: "0.85" },
        { path: "/about",            changefreq: "monthly", priority: "0.6" },
    { path: "/contact",          changefreq: "monthly", priority: "0.6" },
    { path: "/privacy-policy",   changefreq: "yearly",  priority: "0.3" },
    { path: "/terms-conditions", changefreq: "yearly",  priority: "0.3" },
    { path: "/refund-policy",    changefreq: "yearly",  priority: "0.3" },
    { path: "/disclaimer",       changefreq: "yearly",  priority: "0.3" },
  ];

  for (const p of staticPages) {
    const lastmod = STATIC_PAGE_LASTMOD[p.path] ?? "2026-01-01";
    chunks.push(urlEntry(`${siteUrl}${p.path}`, lastmod, p.changefreq, p.priority));
  }

  // Location pages: use a stable date — update when location data changes
  for (const loc of sansthanLocations) {
    chunks.push(
      urlEntry(`${siteUrl}/locations/${loc.id}`, "2026-04-01", "monthly", "0.85")
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
