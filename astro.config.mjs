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
    "/feed": "/feed.xml",
    "/opengraph-image": "/opengraph-image.png",
    "/twitter-image": "/twitter-image.png",
    "/icon": "/icon.png",
    "/apple-icon": "/apple-icon.png",

    // --- Duplicate content consolidation (P0) ---
    // Shegaon: facilities/amenities cluster → canonical
    "/blog/shegaon-bhakta-niwas-amenities-hot-water-and-services": "/blog/shegaon-bhakta-niwas-facilities-and-amenities",
    "/blog/shegaon-sheogaon-bhakta-niwas-facilities": "/blog/shegaon-bhakta-niwas-facilities-and-amenities",
    "/blog/shegaon-bhakta-niwas-room-types-and-facilities": "/blog/shegaon-bhakta-niwas-facilities-and-amenities",

    // Shegaon: booking process cluster → canonical
    "/blog/shegaon-how-to-book-bhakta-niwas": "/blog/shegaon-bhakta-niwas-booking-process",
    "/blog/shegaon-bhakta-niwas-online-booking-vs-whatsapp": "/blog/shegaon-bhakta-niwas-booking-process",
    "/blog/shegaon-bhakta-niwas-whatsapp-message-template": "/blog/shegaon-bhakta-niwas-booking-process",
    "/blog/shegaon-bhakta-niwas-common-booking-mistakes": "/blog/shegaon-bhakta-niwas-booking-process",

    // Shegaon: check-in/out cluster → canonical
    "/blog/shegaon-bhakta-niwas-checkout-process-guide": "/blog/shegaon-bhakta-niwas-check-in-check-out-timings",

    // Shegaon: contact cluster → canonical
    "/blog/shegaon-bhakta-niwas-sheogaon-contact": "/blog/shegaon-bhakta-niwas-contact-and-escalation-matrix",
    "/blog/shegaon-bhakta-niwas-offline-helpdesk-guide": "/blog/shegaon-bhakta-niwas-contact-and-escalation-matrix",

    // Trimbakeshwar: sheogaon-labelled duplicates → trimbakeshwar canonicals
    "/blog/trimbakeshwar-sheogaon-accommodation-guide": "/blog/trimbakeshwar-bhakta-niwas-accommodation-guide",
    "/blog/trimbakeshwar-sheogaon-bhakta-niwas-facilities": "/blog/trimbakeshwar-bhakta-niwas-facilities-and-amenities",

    // Spelling & Slug Consolidation (P1)
    "/blog/shegaon-sheogaon-accommodation-guide": "/blog/shegaon-bhakta-niwas-accommodation-guide",
    "/blog/shegaon-sheogaon-temple-darshan-guide": "/blog/shegaon-darshan-timing-guide",
    "/blog/shegaon-sheogaon-travel-tips": "/blog/shegaon-travel-guide",
    "/blog/shegaon-sheogaon-bhakta-niwas-facilities": "/blog/shegaon-bhakta-niwas-facilities-and-amenities",
    "/blog/shegaon-bhakta-niwas-sheogaon-contact": "/blog/shegaon-bhakta-niwas-contact-and-escalation-matrix",
    "/blog/shegaon-omkareshwar-bhakt-niwas-guide": "/blog/omkareshwar-bhakt-niwas-guide",
  },
});
