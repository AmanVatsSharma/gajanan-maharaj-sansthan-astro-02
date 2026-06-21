import type { APIRoute } from "astro";
import { getAppIcon32Response } from "@/lib/og/app-icon";

export const prerender = true;

export const GET: APIRoute = async () => {
  return getAppIcon32Response();
};
