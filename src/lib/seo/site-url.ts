/**
 * File: src/lib/seo/site-url.ts
 * Canonical site URL for SEO (Astro: PUBLIC_SITE_URL, VERCEL_URL).
 */

export const DEFAULT_PRODUCTION_SITE_URL =
  "https://www.srigajananmaharajsanstan.com";
const CANONICAL_DOMAIN_APEX = "srigajananmaharajsanstan.com";
let hasLoggedApexHostNormalization = false;
let hasLoggedInvalidSiteUrl = false;

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  return withProtocol.endsWith("/") ? withProtocol.slice(0, -1) : withProtocol;
}

function logSeoSiteUrlWarning(message: string, data?: Record<string, unknown>) {
  console.warn("seo-site-url-warning", {
    timestamp: Date.now(),
    message,
    ...(data ? { data } : {}),
  });
}

function normalizeCanonicalHostname(hostname: string): string {
  if (hostname === CANONICAL_DOMAIN_APEX) {
    if (!hasLoggedApexHostNormalization) {
      hasLoggedApexHostNormalization = true;
      logSeoSiteUrlWarning(
        "Apex host provided in PUBLIC_SITE_URL. Normalizing to www canonical host.",
        {
          providedHost: hostname,
          normalizedHost: `www.${CANONICAL_DOMAIN_APEX}`,
        }
      );
    }

    return `www.${CANONICAL_DOMAIN_APEX}`;
  }

  return hostname;
}

function getSanitizedSiteUrlFromEnv(rawEnvValue: string): string | null {
  const normalizedRawUrl = normalizeUrl(rawEnvValue);

  try {
    const parsedUrl = new URL(normalizedRawUrl);
    parsedUrl.hostname = normalizeCanonicalHostname(parsedUrl.hostname);
    parsedUrl.pathname = "/";
    parsedUrl.search = "";
    parsedUrl.hash = "";

    return parsedUrl.origin;
  } catch {
    if (!hasLoggedInvalidSiteUrl) {
      hasLoggedInvalidSiteUrl = true;
      logSeoSiteUrlWarning(
        "Invalid PUBLIC_SITE_URL/VERCEL_URL value. Falling back to environment-aware defaults.",
        {
          providedValue: rawEnvValue,
          fallbackProductionUrl: DEFAULT_PRODUCTION_SITE_URL,
        }
      );
    }
    return null;
  }
}

export function getSiteUrl(): string {
  const fromEnvRaw =
    import.meta.env.PUBLIC_SITE_URL?.trim() ||
    (import.meta.env.VERCEL_URL
      ? `https://${import.meta.env.VERCEL_URL}`
      : undefined);

  if (fromEnvRaw) {
    const sanitizedFromEnv = getSanitizedSiteUrlFromEnv(fromEnvRaw);
    if (sanitizedFromEnv) {
      return sanitizedFromEnv;
    }
  }

  if (import.meta.env.PROD) {
    return DEFAULT_PRODUCTION_SITE_URL;
  }

  return "http://localhost:4321";
}

export function getSiteUrlAsUrl(): URL {
  return new URL(getSiteUrl());
}
