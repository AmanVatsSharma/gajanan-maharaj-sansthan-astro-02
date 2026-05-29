import type { APIRoute } from "astro";
import { getTwitterImageResponse } from "@/lib/og/twitter-image";

export const prerender = true;

export const GET: APIRoute = () => {
  return getTwitterImageResponse();
};
