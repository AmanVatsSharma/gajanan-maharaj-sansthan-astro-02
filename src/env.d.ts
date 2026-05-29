/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_DEBUG_SEO?: string;
  readonly VERCEL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
