/**
 * File:        src/pages/sitemap-core.xml.ts
 * Module:      SEO · Core Sitemap
 * Purpose:     Sitemap for high-priority static pages and location pages.
 *              Uses stable hardcoded lastmod dates so Google doesn't waste crawl budget
 *              re-crawling unchanged pages on every build.
 *
 * Exports:
 *   - GET() → Response   — serves the core sitemap XML
 *
 * Depends on:
 *   - @/data/sansthan-data — location IDs for /locations/* URLs
 *   - @/lib/seo/site-url   — canonical origin
 *
 * Side-effects:
 *   - none
 *
 * Key invariants:
 *   - STATIC_PAGE_LASTMOD dates must be updated manually when a page's content changes
 *
 * Read order:
 *   1. STATIC_PAGE_LASTMOD — lastmod source of truth for static pages
 *   2. GET — builds and returns the XML
 *
 * Author:      Aman Sharma
 * Last-updated: 2026-05-30
 */

import type { APIRoute } from "astro";
import { sansthanLocations } from "@/data/sansthan-data";
import { getSiteUrl } from "@/lib/seo/site-url";

export const prerender = true;

// Update a path's date only when that page's actual content changes.
// Keeping these stable prevents Google from wasting crawl budget re-visiting
// pages that haven't changed just because we deployed.
const STATIC_PAGE_LASTMOD: Record<string, string> = {
  "/":                "2026-07-01",
  "/booking":         "2026-07-01",
  "/bhakta-niwas":    "2026-07-01",
  "/darshan-timings": "2026-07-01",
  "/how-to-reach":    "2026-07-01",
  "/locations":       "2026-07-01",
  "/about":           "2026-07-01",
  "/contact":         "2026-07-01",
  "/privacy-policy":  "2026-01-01",
  "/terms-conditions":"2026-01-01",
  "/refund-policy":   "2026-01-01",
  "/disclaimer":      "2026-01-01",
  "/shegaon-accommodation":       "2026-07-01",
  "/omkareshwar-bhakta-niwas":    "2026-07-01",
  "/pandharpur-room-booking":     "2026-07-01",
  "/trimbakeshwar-bhakt-niwas":   "2026-07-01",
  "/trimbakeshwar-jyotirlinga":   "2026-07-01",
  "/omkareshwar-jyotirlinga":     "2026-07-01",
  // 12 Jyotirlingas Hub
  "/12-jyotirlingas-of-india":    "2026-07-01",
  // Omkareshwar Pages
  "/omkareshwar-temple-history":  "2026-07-01",
  "/omkareshwar-darshan-timings": "2026-07-01",
  "/how-to-reach-omkareshwar":    "2026-07-01",
  "/narmada-parikrama-omkareshwar": "2026-07-01",
  "/omkareshwar-from-bhopal":     "2026-07-01",
  // Trimbakeshwar Pages
  "/trimbakeshwar-temple-history": "2026-07-01",
  "/trimbakeshwar-3-day-itinerary": "2026-07-01",
  "/brahmagiri-trek-guide":       "2026-07-01",
  "/kushavarta-kund-guide":       "2026-07-01",
  // Special Events & Rituals
  "/mahashivratri-omkareshwar":   "2026-07-01",
  "/mahashivratri-trimbakeshwar": "2026-07-01",
  "/narayan-nagbali-trimbakeshwar": "2026-07-01",
  "/rudra-homa-trimbakeshwar":     "2026-07-01",
  "/kumbh-mela-trimbakeshwar":     "2026-07-01",
  // Pilgrimage Info
  "/ganesh-chaturthi-omkareshwar-trimbakeshwar": "2026-07-01",
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

export const GET: APIRoute = async () => {
  const siteUrl = getSiteUrl();
  const chunks: string[] = [];

  const staticPages: Array<{ path: string; changefreq: string; priority: string }> = [
    // Core Pages - Highest Priority
    { path: "/",                       changefreq: "weekly",  priority: "1.0" },
    { path: "/booking",                changefreq: "weekly",  priority: "0.9" },
    { path: "/bhakta-niwas",           changefreq: "weekly",  priority: "0.9" },
    { path: "/locations",              changefreq: "weekly",  priority: "0.9" },

    // Primary Content Hub - 12 Jyotirlingas
    { path: "/12-jyotirlingas-of-india",    changefreq: "weekly",  priority: "0.95" },

    // Omkareshwar Jyotirlinga Hub - Very High Priority
    { path: "/omkareshwar-jyotirlinga",     changefreq: "weekly",  priority: "0.9" },
    { path: "/omkareshwar-temple-history",  changefreq: "monthly", priority: "0.85" },
    { path: "/omkareshwar-darshan-timings", changefreq: "weekly",  priority: "0.8" },
    { path: "/how-to-reach-omkareshwar",    changefreq: "monthly", priority: "0.85" },
    { path: "/narmada-parikrama-omkareshwar", changefreq: "monthly", priority: "0.8" },
    { path: "/omkareshwar-from-bhopal",     changefreq: "monthly", priority: "0.8" },

    // Trimbakeshwar Jyotirlinga Hub - Very High Priority
    { path: "/trimbakeshwar-jyotirlinga",   changefreq: "weekly",  priority: "0.9" },
    { path: "/trimbakeshwar-temple-history", changefreq: "monthly", priority: "0.85" },
    { path: "/trimbakeshwar-3-day-itinerary", changefreq: "weekly",  priority: "0.85" },
    { path: "/brahmagiri-trek-guide",       changefreq: "monthly", priority: "0.8" },
    { path: "/kushavarta-kund-guide",       changefreq: "monthly", priority: "0.8" },

    // Secondary Priority
    { path: "/darshan-timings",        changefreq: "weekly",  priority: "0.85" },
    { path: "/how-to-reach",           changefreq: "monthly", priority: "0.85" },
    { path: "/shegaon-accommodation",      changefreq: "monthly", priority: "0.85" },
    { path: "/omkareshwar-bhakta-niwas",   changefreq: "monthly", priority: "0.85" },
    { path: "/pandharpur-room-booking",    changefreq: "monthly", priority: "0.85" },
    { path: "/trimbakeshwar-bhakt-niwas",  changefreq: "monthly", priority: "0.85" },

    // Special Events & Pilgrimage
    { path: "/mahashivratri-omkareshwar",   changefreq: "yearly",  priority: "0.8" },
    { path: "/mahashivratri-trimbakeshwar", changefreq: "yearly",  priority: "0.8" },
    { path: "/narayan-nagbali-trimbakeshwar", changefreq: "yearly",  priority: "0.75" },
    { path: "/rudra-homa-trimbakeshwar",    changefreq: "yearly",  priority: "0.75" },
    { path: "/kumbh-mela-trimbakeshwar",    changefreq: "yearly",  priority: "0.75" },
    { path: "/ganesh-chaturthi-omkareshwar-trimbakeshwar", changefreq: "yearly", priority: "0.7" },

    // Lower Priority
    { path: "/about",                  changefreq: "monthly", priority: "0.6" },
    { path: "/contact",                changefreq: "monthly", priority: "0.6" },
    { path: "/privacy-policy",         changefreq: "yearly",  priority: "0.3" },
    { path: "/terms-conditions",       changefreq: "yearly",  priority: "0.3" },
    { path: "/refund-policy",          changefreq: "yearly",  priority: "0.3" },
    { path: "/disclaimer",             changefreq: "yearly",  priority: "0.3" },
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
