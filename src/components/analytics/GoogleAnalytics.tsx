/**
 * Google Analytics 4 — Astro client island (replaces next/script).
 */
"use client";

import { useEffect } from "react";

interface GoogleAnalyticsProps {
  gaId: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (
      !gaId ||
      !import.meta.env.PROD ||
      gaId === "GA_MEASUREMENT_ID"
    ) {
      return;
    }
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);
    const inline = document.createElement("script");
    inline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', { page_path: window.location.pathname });
    `;
    document.head.appendChild(inline);
    return () => {
      s.remove();
      inline.remove();
    };
  }, [gaId]);

  return null;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
}

export function trackPageView(url: string) {
  const id = import.meta.env.PUBLIC_GA_MEASUREMENT_ID || "";
  if (typeof window !== "undefined" && window.gtag && id) {
    window.gtag("config", id, {
      page_path: url,
    });
  }
}
