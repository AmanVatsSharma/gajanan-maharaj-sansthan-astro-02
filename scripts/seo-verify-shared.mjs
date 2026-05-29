/**
 * Shared paths and canonical origin for Astro dist verification scripts.
 * Use the same PUBLIC_SITE_URL in CI as during `astro build` so assertions match sitemap/robots/feed.
 */
import path from "node:path";

export const DEFAULT_SITE_ORIGIN = "https://www.gajananmaharajsanstan.com";
const APEX_HOST = "gajananmaharajsanstan.com";

export function getExpectedSiteOrigin() {
  const raw = process.env.PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return DEFAULT_SITE_ORIGIN;
  }

  const withProto =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;

  try {
    const url = new URL(withProto);
    let host = url.hostname.toLowerCase();
    if (host === APEX_HOST) {
      host = `www.${APEX_HOST}`;
    }
    return `${url.protocol}//${host}`;
  } catch {
    return DEFAULT_SITE_ORIGIN;
  }
}

export function getDistClientDir(cwd = process.cwd()) {
  const override = process.env.ASTRO_DIST_CLIENT?.trim();
  if (override) {
    return path.isAbsolute(override) ? override : path.join(cwd, override);
  }
  return path.join(cwd, "dist", "client");
}

export function distClientFile(filename, cwd = process.cwd()) {
  return path.join(getDistClientDir(cwd), filename);
}
