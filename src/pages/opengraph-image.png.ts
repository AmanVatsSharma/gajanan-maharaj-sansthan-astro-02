import type { APIRoute } from "astro";
import { getDefaultOpenGraphResponse } from "@/lib/og/default-open-graph";

export const prerender = true;

export const GET: APIRoute = () => {
  return getDefaultOpenGraphResponse();
};
