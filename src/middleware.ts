/**
 * Canonical host redirect (mirrors next.config when SEO_ENABLE_APP_HOST_REDIRECTS=true).
 */
import { defineMiddleware } from "astro:middleware";

const CANONICAL_DOMAIN_APEX = "srigajananmaharajsanstan.com";
const DEFAULT_CANONICAL_ORIGIN = `https://www.${CANONICAL_DOMAIN_APEX}`;

function normalizeCanonicalHostname(hostname: string): string {
  if (hostname === CANONICAL_DOMAIN_APEX) {
    return `www.${CANONICAL_DOMAIN_APEX}`;
  }
  return hostname;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (process.env.SEO_ENABLE_APP_HOST_REDIRECTS !== "true") {
    return next();
  }

  const raw = import.meta.env.PUBLIC_SITE_URL?.trim();
  let canonicalOrigin = DEFAULT_CANONICAL_ORIGIN;
  if (raw) {
    const withProtocol =
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `https://${raw}`;
    try {
      const u = new URL(withProtocol);
      u.hostname = normalizeCanonicalHostname(u.hostname);
      u.pathname = "/";
      u.search = "";
      u.hash = "";
      canonicalOrigin = u.origin;
    } catch {
      /* keep default */
    }
  }

  const host = context.request.headers.get("host")?.split(":")[0];
  if (!host) {
    return next();
  }

  const canonicalHost = new URL(canonicalOrigin).hostname;
  const isLocal =
    host.includes("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local");

  if (isLocal) {
    return next();
  }

  const redirectFromHost = canonicalHost.startsWith("www.")
    ? canonicalHost.replace(/^www\./, "")
    : `www.${canonicalHost}`;

  if (redirectFromHost === canonicalHost || host !== redirectFromHost) {
    return next();
  }

  const url = new URL(context.request.url);
  const dest = `${canonicalOrigin}${url.pathname}${url.search}`;
  return Response.redirect(dest, 308);
});
