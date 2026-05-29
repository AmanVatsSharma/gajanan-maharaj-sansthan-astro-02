"use client";

import { useEffect } from "react";

/**
 * Reads `?q=` from the URL and hides blog cards whose data-search text does not match.
 * Aligns with WebSite SearchAction pointing at `/blog?q=...`.
 */
export function BlogListingQueryFilter() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q")?.toLowerCase().trim();
    if (!q) {
      return;
    }

    const rows = document.querySelectorAll<HTMLElement>("[data-blog-filter-row]");
    rows.forEach((el) => {
      const haystack = el.dataset.search?.toLowerCase() ?? "";
      el.hidden = !haystack.includes(q);
    });
  }, []);

  return null;
}
