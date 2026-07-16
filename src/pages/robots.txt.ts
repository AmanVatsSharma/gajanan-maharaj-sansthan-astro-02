import type { APIRoute } from "astro";
import { getSiteUrl } from "@/lib/seo/site-url";

export const prerender = true;

export const GET: APIRoute = () => {
  const siteUrl = getSiteUrl();
  const body = `User-agent: *
Allow: /
Crawl-delay: 1
Disallow: /api/
Disallow: /admin/

User-agent: Googlebot-Image
Allow: /images/
Allow: /gallery/
Allow: /logo/
Allow: /rooms/

Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
