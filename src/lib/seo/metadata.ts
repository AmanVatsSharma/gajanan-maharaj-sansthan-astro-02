/**
 * Page metadata for Astro <head> (parity with former Next Metadata).
 */

import { SITE_CONFIG, OG_IMAGE_DIMENSIONS } from "./constants";
import { getSiteUrl } from "./site-url";

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

export interface PaginationLinks {
  prev?: string;
  next?: string;
}

export type SitePageMetadata = {
  title: string;
  description: string;
  keywords?: string[];
  alternates?: { canonical?: string };
  openGraph?: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    type: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
  robots?: { index: boolean; follow: boolean; maxSnippet?: number };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  other?: Record<string, string | number | Array<string | number>>;
  hreflangAlternates?: HreflangAlternate[];
  pagination?: PaginationLinks;
};

interface PageMetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  path?: string;
  noIndex?: boolean;
  robots?: { index?: boolean; follow?: boolean; maxSnippet?: number };
  type?: "website" | "article";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  other?: Record<string, string | number | Array<string | number>>;
  hreflangAlternates?: HreflangAlternate[];
  pagination?: PaginationLinks;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  regionCode?: string;
}

/** `<title>` text matching former Next `title.template` behavior */
export function getHtmlTitle(pageTitle: string): string {
  const siteNameLower = SITE_CONFIG.name.toLowerCase();
  const titleLower = pageTitle.toLowerCase();
  if (titleLower.includes(siteNameLower)) {
    return pageTitle;
  }
  return `${pageTitle} | ${SITE_CONFIG.name}`;
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image = "/opengraph-image",
  path = "",
  noIndex = false,
  robots: robotsParam,
  type = "website",
  article,
  other,
  hreflangAlternates,
  pagination,
}: PageMetadataProps): SitePageMetadata {
  const siteUrl = getSiteUrl();
  const fullUrl = `${siteUrl}${path}`;
  const siteNameLower = SITE_CONFIG.name.toLowerCase();
  const titleLower = title.toLowerCase();
  const fullTitle = titleLower.includes(siteNameLower)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;

  const metadata: SitePageMetadata = {
    title,
    description,
    keywords,
    other,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type,
      images: [
        {
          url: image,
          width: OG_IMAGE_DIMENSIONS.width,
          height: OG_IMAGE_DIMENSIONS.height,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };

  if (robotsParam !== undefined) {
    metadata.robots = {
      index: robotsParam.index ?? true,
      follow: robotsParam.follow ?? true,
      ...(robotsParam.maxSnippet !== undefined ? { maxSnippet: robotsParam.maxSnippet } : {}),
    };
  } else if (noIndex) {
    metadata.robots = {
      index: false,
      follow: true,
    };
  }

  if (article) {
    metadata.article = article;
  }

  if (hreflangAlternates && hreflangAlternates.length > 0) {
    metadata.hreflangAlternates = hreflangAlternates;
  }

  if (pagination && (pagination.prev || pagination.next)) {
    metadata.pagination = pagination;
  }

  return metadata;
}

export function generateLocationMetadata(
  locationName: string,
  locationCity: string,
  locationDescription: string,
  locationImage: string,
  locationId: string,
  keywords: string[] = [],
  coordinates?: LocationCoordinates
): SitePageMetadata {
  // Include "Bhakta Niwas" in title for locations where the name doesn't already mention it
  const titleSuffix = locationName.toLowerCase().includes("bhakt")
    ? `${locationCity} Temple Accommodation`
    : `Bhakta Niwas ${locationCity} - Temple Accommodation`;
  const title = `${locationName} - ${titleSuffix}`;
  const descBase = `Book Bhakta Niwas at ${locationCity} — ${locationDescription}`;
  const description = descBase.length > 155
    ? descBase.slice(0, 152) + "…"
    : descBase;
  const geoMetaTags = coordinates
    ? getGeoMetaTags(
        coordinates.latitude,
        coordinates.longitude,
        `${locationName}, ${locationCity}`,
        coordinates.regionCode
      )
    : undefined;

  return generatePageMetadata({
    title,
    description,
    keywords: [
      ...keywords,
      `${locationCity} temple accommodation`,
      `${locationCity} temple booking`,
      `${locationName}`,
      "dharamshala booking",
      "bhakt niwas",
      `${locationCity} bhakta niwas`,
      `${locationCity} bhakt niwas`,
      `bhakta niwas ${locationCity}`,
      `bhakt niwas ${locationCity}`,
      `${locationCity} bhakta nivas`,
      `${locationCity} bhakt nivas`,
      `bhakta nivas ${locationCity}`,
      `bhakt nivas ${locationCity}`,
    ],
    image: locationImage,
    path: `/locations/${locationId}`,
    other: geoMetaTags,
  });
}

export function getGeoMetaTags(
  latitude: number,
  longitude: number,
  placeName: string,
  regionCode = "IN-MH"
) {
  return {
    "geo.position": `${latitude};${longitude}`,
    "geo.placename": placeName,
    "geo.region": regionCode,
    ICBM: `${latitude}, ${longitude}`,
  };
}
