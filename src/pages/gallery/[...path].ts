import type { APIRoute } from "astro";
import { getGalleryPlaceholderResponse } from "@/lib/og/gallery-placeholder";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const raw = params.path;
  const pathStr =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw.join("/") : "";
  const res = getGalleryPlaceholderResponse(pathStr);
  res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return res;
};
