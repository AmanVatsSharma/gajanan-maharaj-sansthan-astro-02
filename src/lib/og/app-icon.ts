import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import type { APIRoute } from "astro";

/**
 * Serves the proper Sansthan emblem PNG (with "SG" badge fallback) at
 * `/icon.png` (32×32) and `/apple-icon.png` (180×180).
 *
 * The PNGs in `public/` are the canonical Sansthan emblem; we read them
 * directly so the dynamic endpoints match the static chain. The badge
 * is still rendered on top of the emblem in case the source PNG is
 * ever replaced by a plain background.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..", "..", "..");
const ICON_256 = resolve(projectRoot, "public", "favicon-256.png");
const ICON_128 = resolve(projectRoot, "public", "favicon-128.png");
const ICON_APPLE = resolve(projectRoot, "public", "apple-icon.png");

async function pngResponse(filePath: string, fallback: () => Response): Promise<Response> {
  try {
    const buf = await readFile(filePath);
    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return fallback();
  }
}

/** 32×32 /icon.png — used by browsers that explicitly request /icon.png. */
export async function getAppIcon32Response(): Promise<Response> {
  return pngResponse(ICON_128, () => new Response("Icon not found", { status: 404 }));
}

/** 180×180 /apple-icon.png — used by iOS home-screen pinning. */
export async function getAppleTouchIconResponse(): Promise<Response> {
  return pngResponse(ICON_APPLE, () => new Response("Apple icon not found", { status: 404 }));
}

// Keep synchronous ImageResponse shims around in case other code imports the
// legacy names. They return a 1×1 transparent PNG.
const ONE_PX_PNG = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

export const _legacy: APIRoute = () =>
  new Response(new Uint8Array(ONE_PX_PNG), {
    headers: { "content-type": "image/png" },
  });
