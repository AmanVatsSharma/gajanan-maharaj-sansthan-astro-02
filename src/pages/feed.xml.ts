/**
 * File:        src/pages/feed.xml.ts
 * Module:      SEO · RSS 2.0 Feed
 * Purpose:     Serves an RSS 2.0 feed of all blog posts for syndication
 *              (Feedly, Inoreader, etc.). Declares the Dublin Core namespace so
 *              <dc:creator> renders correctly in feed readers.
 *
 * Exports:
 *   - GET() → Response   — serves application/rss+xml
 *
 * Depends on:
 *   - @/lib/blog          — getBlogPosts()
 *   - @/lib/seo/site-url  — canonical origin
 *
 * Side-effects:
 *   - none
 *
 * Key invariants:
 *   - prerender = true so the feed is emitted at build time, not on every request
 *   - description is wrapped in CDATA + escaped so it survives XML parsing
 *   - <dc:creator> uses the post's `author` field (Dublin Core namespace)
 *
 * Read order:
 *   1. escapeXml            — tiny XML-special-character escaper
 *   2. toRfc822             — converts an ISO date string to RFC-822 format
 *   3. buildItem            — renders a single <item> element
 *   4. GET                  — assembles the channel + items and returns
 *
 * Author:      Aman Sharma
 * Last-updated: 2026-06-04
 */

import type { APIRoute } from "astro";
import { getBlogPosts, type BlogPost } from "@/lib/blog";
import { getSiteUrl } from "@/lib/seo/site-url";

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Convert an ISO date string (e.g. "2026-04-25" or "2026-04-25T10:00:00Z")
 * into an RFC-822 string suitable for <pubDate>/<lastBuildDate>.
 * Falls back to the current date if parsing fails.
 */
function toRfc822(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toUTCString();
  }
  return date.toUTCString();
}

function buildItem(post: BlogPost, siteUrl: string): string {
  const link = `${siteUrl}/blog/${post.slug}`;
  const pubDate = toRfc822(post.date);
  const title = escapeXml(post.title);
  const description = escapeXml(post.description);
  const author = escapeXml(post.author);

  const categories: string[] = [];
  if (post.category) {
    categories.push(
      `    <category>${escapeXml(post.category)}</category>`,
    );
  }
  for (const tag of post.tags) {
    categories.push(`    <category>${escapeXml(tag)}</category>`);
  }

  return `  <item>
    <title>${title}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <description><![CDATA[${description}]]></description>
    <dc:creator>${author}</dc:creator>
${categories.join("\n")}
  </item>`;
}

export const GET: APIRoute = () => {
  const siteUrl = getSiteUrl();
  const posts = getBlogPosts();

  const lastBuildDate = posts.length
    ? toRfc822(posts[0].date)
    : new Date().toUTCString();

  const items = posts.map((p) => buildItem(p, siteUrl)).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shri Gajanan Maharaj Sansthan — Blog</title>
    <link>${siteUrl}</link>
    <description>Stories, pilgrimage guides, festival updates, and devotee experiences from Shri Gajanan Maharaj Sansthan, Shegaon.</description>
    <language>en-in</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
