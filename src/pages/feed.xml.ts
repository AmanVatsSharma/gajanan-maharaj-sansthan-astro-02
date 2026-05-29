import type { APIRoute } from "astro";
import { getBlogPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/seo/site-url";

export const prerender = true;

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export const GET: APIRoute = async () => {
  const posts = await getBlogPosts();
  const siteUrl = getSiteUrl();

  const itemsXml = posts
    .map(
      (post) =>
        `<item>
          <title>${escapeXml(post.title)}</title>
          <link>${siteUrl}/blog/${post.slug}</link>
          <description>${escapeXml(post.description)}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <guid>${siteUrl}/blog/${post.slug}</guid>
          ${post.author ? `<author>${escapeXml(post.author)}</author>` : ""}
          ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("") || ""}
        </item>`
    )
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Gajanan Maharaj Sansthan Blog</title>
    <link>${siteUrl}</link>
    <description>Latest updates and articles from Gajanan Maharaj Sansthan</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
};
