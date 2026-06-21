import type { APIRoute } from "astro";
import { getAppleTouchIconResponse } from "@/lib/og/app-icon";

export const prerender = true;

export const GET: APIRoute = async () => {
  return getAppleTouchIconResponse();
};
