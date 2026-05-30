/**
 * Astro config — hybrid output so marketing pages prerender and dynamic endpoints run as Vercel serverless functions.
 * Host-based canonical redirects live in `src/middleware.ts`.
 */
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  trailingSlash: "never",
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    "/home": "/",
    "/index.html": "/",
    "/favicon.ico": "/icon.png",
    "/opengraph-image": "/opengraph-image.png",
    "/twitter-image": "/twitter-image.png",
    "/icon": "/icon.png",
    "/apple-icon": "/apple-icon.png",
  },
});
