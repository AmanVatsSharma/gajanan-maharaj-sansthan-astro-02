/**
 * File: src/lib/seo/structured-data.ts
 * Module: lib/seo
 * Purpose: JSON-LD structured data generators for rich snippets in Google
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-15
 * Notes:
 * - Generates Organization, LocalBusiness, PlaceOfWorship, LodgingBusiness schemas
 * - Helps Google understand and display rich results in SERP
 * - All schemas follow schema.org standards
 */

import type { Location } from "@/data/sansthan-data";
import {
  SITE_CONFIG,
  ORGANIZATION_INFO,
  SOCIAL_PROFILES,
} from "./constants";
import { getSiteUrl } from "./site-url";

/**
 * Main Organization schema for the Sansthan
 */
export function getOrganizationSchema() {
  const baseUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ReligiousOrganization"],
    "@id": `${baseUrl}#organization`,
    name: ORGANIZATION_INFO.legalName,
    alternateName: [
      "Gajanan Maharaj Mandir Shegaon",
      "Shree Gajanan Maharaj Sansthan",
      "Sri Gajanan Maharaj Sansthan",
      "Gajanan Maharaj Sansthan",
      "Shri Gajanan Maharaj Sanstan",
      "Shree Gajanan Maharaj Sanstan",
      "SGMS Shegaon",
      "Gajanan Maharaj Temple Shegaon",
      "Shri Gajanan Maharaj Sansthan Shegaon",
      "श्री गजानन महाराज संस्थान",
      "श्री गजानन महाराज संस्थान शेगांव",
      "गजानन महाराज संस्थान",
      "गजानन महाराज मंदिर शेगांव",
      "शेगांव संस्थान",
    ],
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}${ORGANIZATION_INFO.logo}`,
      width: 512,
      height: 512,
    },
    description: SITE_CONFIG.description,
    foundingDate: `${SITE_CONFIG.foundingYear}-01-01`,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION_INFO.address.streetAddress,
      addressLocality: ORGANIZATION_INFO.address.addressLocality,
      addressRegion: ORGANIZATION_INFO.address.addressRegion,
      postalCode: ORGANIZATION_INFO.address.postalCode,
      addressCountry: ORGANIZATION_INFO.address.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORGANIZATION_INFO.phone,
      email: ORGANIZATION_INFO.email,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "mr"],
    },
    knowsAbout: [
      "Hindu Temple",
      "Pilgrimage Accommodation",
      "Bhakta Niwas",
      "Gajanan Maharaj",
      "Dattatreya tradition",
      "Maharashtra pilgrimage",
      "Dharamshala",
    ],
    sameAs: Object.values(SOCIAL_PROFILES),
  };
}

/**
 * WebSite schema for improved entity understanding.
 * Includes SearchAction for blog discovery (parity with Next `main`).
 */
export function getWebSiteSchema() {
  const baseUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    url: baseUrl,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.locale,
    publisher: {
      "@id": `${baseUrl}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Place of Worship schema for temple locations
 */
export function getPlaceOfWorshipSchema(location: Location) {
  const baseUrl = getSiteUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "PlaceOfWorship",
    "@id": `${baseUrl}/locations/${location.id}#place`,
    name: location.name,
    description: location.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.city === "Omkareshwar" ? "Madhya Pradesh" : "Maharashtra",
      addressCountry: "IN",
    },
    telephone: location.contact[0] || ORGANIZATION_INFO.phone,
    image: location.images.map((img) => `${baseUrl}${img}`),
    url: `${baseUrl}/locations/${location.id}`,
    isAccessibleForFree: true,
    publicAccess: true,
    alternateName: [
      `Bhakta Niwas ${location.city}`,
      `Bhakt Niwas ${location.city}`,
      `Bhakta Nivas ${location.city}`,
      `Bhakt Nivas ${location.city}`,
    ],
    ...(location.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
      },
    }),
    ...(location.googleMapsLink && { hasMap: location.googleMapsLink }),
  };
}

/**
 * Local Business schema for each location
 */
export function getLocalBusinessSchema(location: Location) {
  const baseUrl = getSiteUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/locations/${location.id}#business`,
    name: `${location.name} - ${SITE_CONFIG.name}`,
    description: location.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.city === "Omkareshwar" ? "Madhya Pradesh" : "Maharashtra",
      addressCountry: "IN",
    },
    telephone: location.contact[0] || ORGANIZATION_INFO.phone,
    image: location.images.map((img) => `${baseUrl}${img}`),
    url: `${baseUrl}/locations/${location.id}`,
    priceRange: "Free-Donation Based",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "04:00",
      closes: "22:00",
    },
    ...(location.amenities.length > 0 && {
      amenityFeature: location.amenities.map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })),
    }),
    alternateName: [
      `Bhakta Niwas ${location.city}`,
      `Bhakt Niwas ${location.city}`,
      `Bhakta Nivas ${location.city}`,
      `Bhakt Nivas ${location.city}`,
    ],
    ...(location.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
      },
    }),
    ...(location.googleMapsLink && { hasMap: location.googleMapsLink }),
  };
}

/**
 * Lodging Business schema for accommodation-focused SEO
 */
export function getLodgingBusinessSchema(location: Location) {
  const baseUrl = getSiteUrl();
  
  // Calculate total capacity
  const totalCapacity = location.facilities.reduce(
    (sum, facility) => sum + facility.capacity,
    0
  );

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${baseUrl}/locations/${location.id}#lodging`,
    name: `${location.name} Accommodation`,
    description: `Temple accommodation at ${location.name}, ${location.city}. ${location.description}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.city === "Omkareshwar" ? "Madhya Pradesh" : "Maharashtra",
      addressCountry: "IN",
    },
    telephone: location.contact[0] || ORGANIZATION_INFO.phone,
    image: location.images.map((img) => `${baseUrl}${img}`),
    url: `${baseUrl}/locations/${location.id}`,
    priceRange: "Donation Based",
    ...(location.amenities.length > 0 && {
      amenityFeature: location.amenities.map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })),
    }),
    numberOfRooms: location.facilities.length,
    maximumAttendeeCapacity: totalCapacity,
    checkinTime: "06:00",
    checkoutTime: "10:00",
    petsAllowed: false,
    smokingAllowed: false,
    alternateName: [
      `Bhakta Niwas ${location.city}`,
      `Bhakt Niwas ${location.city}`,
      `Bhakta Nivas ${location.city}`,
      `Bhakt Nivas ${location.city}`,
    ],
    ...(location.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
      },
    }),
    ...(location.googleMapsLink && { hasMap: location.googleMapsLink }),
  };
}

/**
 * Breadcrumb schema for navigation
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const baseUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * FAQ schema for booking questions
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Review/Rating schema for testimonials
 */
export function getAggregateRatingSchema(
  itemName: string,
  ratingValue: number,
  reviewCount: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: itemName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: reviewCount,
    },
  };
}

/**
 * Individual review schema
 */
export function getReviewSchema(
  reviewerName: string,
  reviewBody: string,
  ratingValue: number,
  datePublished?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: reviewerName,
    },
    reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue: ratingValue.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    datePublished: datePublished || new Date().toISOString().split("T")[0],
  };
}

interface ReviewInput {
  author: string;
  reviewBody: string;
  ratingValue: number;
  datePublished?: string;
}

/**
 * Organization schema with embedded AggregateRating and individual reviews.
 * Replaces the plain getOrganizationSchema() on pages that display testimonials.
 * Enables star-rating rich results in Google SERP (proven +15–30% CTR lift).
 */
export function getOrganizationWithRatingSchema(reviews: ReviewInput[]) {
  const baseSchema = getOrganizationSchema();
  const totalRating = reviews.reduce((sum, r) => sum + r.ratingValue, 0);
  const avgRating = reviews.length > 0 ? totalRating / reviews.length : 5;

  return {
    ...baseSchema,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: reviews.length,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      reviewBody: r.reviewBody,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.ratingValue.toString(),
        bestRating: "5",
        worstRating: "1",
      },
      ...(r.datePublished ? { datePublished: r.datePublished } : {}),
    })),
  };
}

/**
 * Event schema for special occasions (optional, for future use)
 */
export function getEventSchema(
  eventName: string,
  eventDescription: string,
  startDate: string,
  endDate: string,
  locationName: string,
  locationAddress: string
) {
  const baseUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    description: eventDescription,
    startDate,
    endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: locationName,
      address: locationAddress,
    },
    organizer: {
      "@type": "Organization",
      name: ORGANIZATION_INFO.legalName,
      url: baseUrl,
    },
    isAccessibleForFree: true,
  };
}

/**
 * Interface for blog post data
 */
export interface BlogPost {
  title: string;
  date: string;
  slug: string;
  description?: string;
  author?: string;
  image?: string;
  dateModified?: string;
  keywords?: string[];
  tags?: string[];
  category?: string;
  rawContent?: string;
  relatedPosts?: Array<{ title: string; slug: string }>;
}

export interface CollectionPageItem {
  title: string;
  urlPath: string;
  description?: string;
  date?: string;
  image?: string;
  keywords?: string[];
  category?: string;
}

interface CollectionPageSchemaOptions {
  path: string;
  title: string;
  description: string;
  items: CollectionPageItem[];
}

function toAbsoluteUrl(baseUrl: string, urlPath: string): string {
  if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
    return urlPath;
  }

  return `${baseUrl}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
}

/**
 * Article/BlogPosting schema for blog posts.
 * Includes speakable for voice search (first 1-2 paragraphs).
 */
export function getArticleSchema(post: BlogPost) {
  const baseUrl = getSiteUrl();
  const imageUrl = post.image 
    ? (post.image.startsWith("http") ? post.image : `${baseUrl}${post.image}`)
    : `${baseUrl}${ORGANIZATION_INFO.logo}`;
  
  // Use slug as is if it looks like a path, or append to /blog/
  const postUrl = post.slug.startsWith('/') 
    ? `${baseUrl}${post.slug}`
    : `${baseUrl}/blog/${post.slug}`;

  const articleKeywords = post.keywords ?? post.tags ?? [];

  // Names like "Sansthan", "Admin", "Team", "Editor" are org identifiers, not people.
  // Using them as @type:Person sends a false E-E-A-T signal to Google's quality raters.
  const ORG_AUTHOR_TOKENS = new Set(['sansthan', 'admin', 'editor', 'team', 'staff', 'temple', 'trust', 'sgms']);
  const authorIsOrg = !post.author || ORG_AUTHOR_TOKENS.has(post.author.toLowerCase().trim());
  const authorField = authorIsOrg
    ? { "@id": `${baseUrl}#organization` }
    : { "@type": "Person", name: post.author };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.description,
    keywords: articleKeywords.length > 0 ? articleKeywords : undefined,
    articleSection: post.category,
    about: post.tags?.map((tag) => ({
      "@type": "DefinedTerm",
      name: tag,
    })),
    image: [
      {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    ],
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    inLanguage: "en-IN",
    author: authorField,
    wordCount: post.rawContent ? post.rawContent.split(/\s+/).length : undefined,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_INFO.legalName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${ORGANIZATION_INFO.logo}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    isPartOf: {
      "@type": "Blog",
      "@id": `${baseUrl}/blog#blog`,
      name: `${ORGANIZATION_INFO.legalName} Blog`,
      url: `${baseUrl}/blog`,
    },
  };

  // Speakable for voice search: first 1-2 paragraphs
  schema.speakable = {
    "@type": "SpeakableSpecification",
    cssSelector: [".prose p:nth-of-type(1)", ".prose p:nth-of-type(2)"],
  };

  if (post.relatedPosts && post.relatedPosts.length > 0) {
    schema.isRelatedTo = post.relatedPosts.slice(0, 5).map((related) => ({
      "@type": "BlogPosting",
      "@id": `${baseUrl}/blog/${related.slug}#article`,
      url: `${baseUrl}/blog/${related.slug}`,
      headline: related.title,
    }));
  }

  return schema;
}

/**
 * HowTo schema for guide-style posts (category === "guides").
 * Helps with rich snippets for step-by-step content.
 */
export function getHowToSchema(
  title: string,
  description: string,
  steps: string[],
  url?: string
) {
  const baseUrl = getSiteUrl();
  const howToUrl = url ? (url.startsWith("http") ? url : `${baseUrl}${url}`) : baseUrl;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    url: howToUrl,
    step: steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}

/**
 * CollectionPage + ItemList schema for blog and taxonomy listings.
 */
export function getCollectionPageSchema({
  path,
  title,
  description,
  items,
}: CollectionPageSchemaOptions) {
  const baseUrl = getSiteUrl();
  const pageUrl = toAbsoluteUrl(baseUrl, path);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name: title,
    description,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        item: {
          "@type": "BlogPosting",
          "@id": `${toAbsoluteUrl(baseUrl, item.urlPath)}#article`,
          url: toAbsoluteUrl(baseUrl, item.urlPath),
          headline: item.title,
          description: item.description,
          datePublished: item.date,
          image: item.image ? [toAbsoluteUrl(baseUrl, item.image)] : undefined,
          keywords: item.keywords,
          articleSection: item.category,
          inLanguage: "en-IN",
        },
      })),
    },
  };
}

/**
 * ItemList schema for the locations listing page (/locations).
 * Helps Google understand the page as a curated list of places.
 */
export function getLocationsItemListSchema(
  locations: Array<{ id: string; name: string; city: string; description: string }>
) {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shri Gajanan Maharaj Sansthan — All Accommodation Locations",
    description:
      "Bhakta Niwas accommodation managed by Shri Gajanan Maharaj Sansthan at temple locations across Maharashtra and Madhya Pradesh.",
    url: `${baseUrl}/locations`,
    itemListElement: locations.map((loc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: loc.name,
      description: loc.description,
      item: {
        "@type": "LodgingBusiness",
        "@id": `${baseUrl}/locations/${loc.id}#lodging`,
        name: loc.name,
        url: `${baseUrl}/locations/${loc.id}`,
        addressLocality: loc.city,
        addressCountry: "IN",
      },
    })),
  };
}

/**
 * ContactPage schema — adds structured address/contact for /contact page.
 */
export function getContactPageSchema(phone: string, address: string) {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${baseUrl}/contact#contactpage`,
    url: `${baseUrl}/contact`,
    name: `Contact Shri Gajanan Maharaj Sansthan`,
    description:
      "Contact page for Shri Gajanan Maharaj Sansthan — phone numbers, address, office hours, and Google Maps links for all locations.",
    mainEntity: {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: ORGANIZATION_INFO.legalName,
      telephone: phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shri Gajanan Maharaj Sansthan Temple Complex",
        addressLocality: "Shegaon",
        addressRegion: "Maharashtra",
        postalCode: "444203",
        addressCountry: "IN",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
  };
}

/**
 * ItemList schema for Bhakta Niwas room types with pricing.
 * Gives Google explicit pricing data to show in rich results and featured snippets.
 */
export function getRoomsItemListSchema(
  rooms: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    ac: boolean;
    capacity: number;
  }>
) {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/bhakta-niwas#rooms`,
    name: "Bhakta Niwas Room Types — Shri Gajanan Maharaj Sansthan Shegaon",
    description:
      "Room types and suggested donation amounts at Bhakta Niwas, Shri Gajanan Maharaj Sansthan Shegaon. All prices include room accommodation, all meals (breakfast, lunch, dinner), hot water, and taxes.",
    url: `${baseUrl}/bhakta-niwas`,
    numberOfItems: rooms.length,
    itemListElement: rooms.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${room.title} — Bhakta Niwas Shegaon`,
      item: {
        "@type": "Accommodation",
        name: room.title,
        description: `${room.description}. Capacity: ${room.capacity} persons. ${room.ac ? "Air-conditioned" : "Non air-conditioned"}. Includes all meals.`,
        accommodationCategory: room.ac ? "AC Room" : "Non-AC Room",
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: room.capacity,
          unitCode: "C62",
        },
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Hot Water", value: true },
          { "@type": "LocationFeatureSpecification", name: "All Meals Included", value: true },
          {
            "@type": "LocationFeatureSpecification",
            name: "Air Conditioning",
            value: room.ac,
          },
          { "@type": "LocationFeatureSpecification", name: "Attached Bathroom", value: true },
        ],
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: room.price,
          description: `Suggested donation ₹${room.price.toLocaleString("en-IN")}. Includes room, breakfast, lunch, dinner, hot water. No hidden charges.`,
          seller: {
            "@id": `${baseUrl}#organization`,
          },
        },
        containedInPlace: {
          "@type": "LodgingBusiness",
          "@id": `${baseUrl}/locations/shegaon-bhakt-niwas#lodging`,
          name: "Shri Gajanan Maharaj Sansthan Bhakta Niwas Shegaon",
        },
      },
    })),
  };
}

/**
 * Person schema for Shri Gajanan Maharaj — critical for Google Knowledge Panel.
 * Establishes the site as the authoritative entity for all "gajanan maharaj" searches.
 */
export function getPersonSchema() {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}#gajanan-maharaj`,
    name: "Shri Gajanan Maharaj",
    alternateName: [
      "Gajanan Maharaj",
      "Sant Gajanan Maharaj",
      "Shree Gajanan Maharaj",
      "Sri Gajanan Maharaj",
      "Gajananbuva",
      "Gajanan Maharaj of Shegaon",
    ],
    description:
      "Shri Gajanan Maharaj is a revered Hindu saint who appeared in Shegaon, Maharashtra around 1878. Considered a manifestation of Lord Dattatreya, he preached equality, compassion, and non-sectarian devotion. His Samadhi is enshrined at Shri Gajanan Maharaj Sansthan, Shegaon. Shri Gajanan Maharaj Sansthan was founded in 1908 by his devotees to preserve his samadhi, conduct daily worship, and serve humanity through social welfare.",
    birthDate: "1858",
    birthPlace: {
      "@type": "Place",
      name: "Shegaon, Maharashtra, India",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Shegaon",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    deathDate: "1910-09-08",
    nationality: {
      "@type": "Country",
      name: "India",
    },
    religion: "Hinduism",
    knowsAbout: ["Yoga", "Vedanta", "Bhakti", "Advaita", "Non-sectarianism"],
    sameAs: ["https://en.wikipedia.org/wiki/Gajanan_Maharaj"],
    affiliation: {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: ORGANIZATION_INFO.legalName,
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Hindu Saint",
      description: "Revered saint and spiritual teacher in the Dattatreya tradition",
    },
    memberOf: {
      "@type": "Organization",
      name: "Dattatreya tradition of Hinduism",
    },
  };
}

/**
 * Service schema for Bhakta Niwas temple accommodation.
 * Helps Google show this as a bookable service in rich results.
 */
export function getServiceSchema() {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/bhakta-niwas#service`,
    name: "Bhakta Niwas Accommodation — Shri Gajanan Maharaj Sansthan",
    alternateName: [
      "Bhakt Niwas Shegaon Booking",
      "Bhakta Nivas Accommodation",
      "Temple Stay Shegaon",
      "Dharamshala Shegaon Booking",
    ],
    description:
      "Temple accommodation (Bhakta Niwas / Bhakt Niwas) for devotee families at Shri Gajanan Maharaj Sansthan locations: Shegaon, Pandharpur, Trimbakeshwar, and Omkareshwar. Family rooms available on donation basis with meals, hot water, and free bus service.",
    provider: {
      "@id": `${baseUrl}#organization`,
    },
    serviceType: "Temple Accommodation / Dharamshala",
    category: "Religious Accommodation",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceOutput: "Temple accommodation booking confirmation",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${baseUrl}/booking`,
      servicePhone: ORGANIZATION_INFO.phone,
      availableLanguage: ["en", "hi", "mr"],
    },
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "0",
      description:
        "Donation-based accommodation. Suggested donation ₹1,250–₹4,150 per room per night. All meals (breakfast, lunch, dinner) included.",
      seller: {
        "@id": `${baseUrl}#organization`,
      },
    },
    termsOfService: `${baseUrl}/terms-conditions`,
  };
}

/**
 * Speakable schema helper — voice search for FAQ and heading content.
 * Pass CSS selectors that contain speakable text (heading + first paragraph).
 */
export function getSpeakableSchema(url: string, cssSelectors: string[]) {
  const baseUrl = getSiteUrl();
  const pageUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}

/**
 * HinduTemple schema — Google-recognized religious place + tourist attraction.
 * Uses @type array so the location is simultaneously classified as
 * HinduTemple (knowledge graph / AI Overviews), PlaceOfWorship (religious
 * entity), and TouristAttraction (travel planner cards).
 */
export function getHinduTempleSchema(location: Location) {
  const baseUrl = getSiteUrl();
  const addressRegion =
    location.city === "Omkareshwar" ? "Madhya Pradesh" : "Maharashtra";
  const isShegaon = location.city === "Shegaon";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["HinduTemple", "PlaceOfWorship", "TouristAttraction"],
    "@id": `${baseUrl}/locations/${location.id}#temple`,
    name: location.name,
    description: location.description,
    url: `${baseUrl}/locations/${location.id}`,
    telephone: location.contact[0] || ORGANIZATION_INFO.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion,
      addressCountry: "IN",
    },
    image: location.images.map((img) =>
      img.startsWith("http") ? img : `${baseUrl}${img}`
    ),
    logo: `${baseUrl}${ORGANIZATION_INFO.logo}`,
    isAccessibleForFree: true,
    publicAccess: true,
    smokingAllowed: false,
    religion: "Hinduism",
    slogan: "Gan Gan Ganat Bote",
    knowsLanguage: ["mr", "hi", "en", "sa"],
    alternateName: [
      `Bhakta Niwas ${location.city}`,
      `Bhakt Niwas ${location.city}`,
      `Bhakta Nivas ${location.city}`,
      `Bhakt Nivas ${location.city}`,
      `Shri Gajanan Maharaj Sansthan ${location.city}`,
      `Shree Gajanan Maharaj Sansthan ${location.city}`,
      `Gajanan Maharaj Mandir ${location.city}`,
      ...(isShegaon
        ? [
            "Shri Gajanan Maharaj Samadhi Mandir",
            "श्री गजानन महाराज समाधी मंदिर",
            "गजानन महाराज संस्थान शेगांव",
            "श्री गजानन महाराज संस्थान शेगांव",
          ]
        : []),
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "05:00",
        closes: "21:30",
      },
    ],
    founder: { "@id": `${baseUrl}#gajanan-maharaj` },
    foundingDate: "1908",
    parentOrganization: { "@id": `${baseUrl}#organization` },
    ...(location.amenities.length > 0 && {
      amenityFeature: location.amenities.map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })),
    }),
    ...(location.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
      },
    }),
    ...(location.googleMapsLink && { hasMap: location.googleMapsLink }),
    ...(isShegaon && {
      sameAs: [
        "https://en.wikipedia.org/wiki/Shegaon",
        "https://en.wikipedia.org/wiki/Gajanan_Maharaj",
        "https://www.wikidata.org/wiki/Q5517110",
      ],
    }),
  };

  return schema;
}

/**
 * Book schema — Shri Gajanan Vijay Granth.
 * Captures high-volume queries about the granth (pothi), adhyay, ovi counts,
 * Dasganu Maharaj authorship, and language editions.
 */
export function getGranthBookSchema() {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${baseUrl}#gajanan-vijay-granth`,
    name: "Shri Gajanan Vijay Granth",
    alternateName: [
      "Gajanan Vijay",
      "Gajanan Vijay Pothi",
      "Shri Gajanan Vijay",
      "Shree Gajanan Vijay Granth",
      "श्री गजानन विजय ग्रंथ",
      "गजानन विजय पोथी",
      "श्री गजानन विजय",
    ],
    author: { "@id": `${baseUrl}#dasganu-maharaj` },
    about: { "@id": `${baseUrl}#gajanan-maharaj` },
    publisher: { "@id": `${baseUrl}#organization` },
    inLanguage: ["mr", "hi", "en", "gu", "kn", "te", "ta"],
    numberOfPages: 420,
    bookFormat: "https://schema.org/Hardcover",
    datePublished: "1940",
    genre: [
      "Hindu Devotional Literature",
      "Hagiography",
      "Marathi Ovi Poetry",
      "Sant Sahitya",
    ],
    abstract:
      "Biography of Sant Shri Gajanan Maharaj of Shegaon composed in 21 chapters (adhyay) and 3,669 ovis (devotional Marathi stanzas) by Sant Dasganu Maharaj. Published by Shri Gajanan Maharaj Sansthan.",
    keywords:
      "gajanan vijay granth, vijay pothi, dasganu maharaj, 21 adhyay, 3669 ovis, gajanan maharaj biography, shegaon saint, marathi devotional",
  };
}

/**
 * Person schema for Sant Dasganu Maharaj — author of Gajanan Vijay Granth.
 * Referenced via @id from the Book schema.
 */
export function getDasganuMaharajSchema() {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}#dasganu-maharaj`,
    name: "Sant Dasganu Maharaj",
    alternateName: [
      "Das Ganu Maharaj",
      "Dasganu Maharaj",
      "संत दासगणू महाराज",
      "दासगणू महाराज",
    ],
    description:
      "Marathi poet-saint, disciple of Sai Baba of Shirdi, and author of Shri Gajanan Vijay Granth — the authoritative biography of Sant Gajanan Maharaj of Shegaon.",
    honorificPrefix: "Sant",
    nationality: { "@type": "Country", name: "India" },
    religion: "Hinduism",
    knowsAbout: ["Sant Sahitya", "Marathi Ovi Poetry", "Bhakti"],
    sameAs: ["https://en.wikipedia.org/wiki/Das_Ganu_Maharaj"],
  };
}

/**
 * Enhanced Person schema for Shri Gajanan Maharaj with Devanagari names,
 * Wikidata link, granth cross-reference, and knownFor facets. Preferred over
 * the legacy getPersonSchema() — use on homepage and saint-profile pages.
 */
export function getEnhancedPersonSchema() {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}#gajanan-maharaj`,
    name: "Shri Gajanan Maharaj",
    honorificPrefix: "Sant Shri",
    alternateName: [
      "Gajanan Maharaj",
      "Sant Gajanan Maharaj",
      "Shree Gajanan Maharaj",
      "Sri Gajanan Maharaj",
      "Gajananbuva",
      "Gajanan Maharaj of Shegaon",
      "Shegaon Sant",
      "श्री गजानन महाराज",
      "संत गजानन महाराज",
      "गजानन महाराज",
      "गजाननबुवा",
      "श्रीगजानन महाराज",
    ],
    description:
      "Shri Gajanan Maharaj is a revered Hindu saint who first appeared at Shegaon, Maharashtra, on 23 February 1878. Considered by devotees to be a manifestation in the Dattatreya tradition, he preached equality, compassion, and non-sectarian devotion. His samadhi is enshrined at Shri Gajanan Maharaj Sansthan, Shegaon. The Sansthan was founded in 1908 by devotees to preserve his samadhi, conduct daily worship, and serve humanity through mahaprasad, accommodation, and social welfare.",
    birthDate: "1878-02-23",
    birthPlace: {
      "@type": "Place",
      name: "Shegaon, Buldhana, Maharashtra, India (first appearance)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Shegaon",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    deathDate: "1910-09-08",
    deathPlace: {
      "@type": "Place",
      name: "Shegaon, Maharashtra, India",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Shegaon",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    nationality: { "@type": "Country", name: "India" },
    religion: "Hinduism",
    knowsAbout: [
      "Yoga",
      "Vedanta",
      "Bhakti",
      "Advaita",
      "Dattatreya tradition",
      "Non-sectarianism",
    ],
    knownFor: [
      "Samadhi at Shegaon",
      "Gan Gan Ganat Bote mantra",
      "Gajanan Vijay Granth (21 adhyay biography)",
      "Miracles and compassion across Vidarbha",
    ],
    subjectOf: { "@id": `${baseUrl}#gajanan-vijay-granth` },
    affiliation: {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: ORGANIZATION_INFO.legalName,
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Hindu Saint",
      description:
        "Revered saint and spiritual teacher in the Dattatreya tradition",
    },
    memberOf: {
      "@type": "Organization",
      name: "Dattatreya tradition of Hinduism",
    },
    sameAs: [
      "https://en.wikipedia.org/wiki/Gajanan_Maharaj",
      "https://www.wikidata.org/wiki/Q5517110",
    ],
  };
}

interface LocationRatingInput {
  ratingValue: number;
  reviewCount: number;
  reviews?: ReviewInput[];
}

/**
 * LocalBusiness schema with embedded AggregateRating + Review items.
 * Use on location detail pages so each branch shows star ratings in SERP.
 */
export function getLocalBusinessWithRatingSchema(
  location: Location,
  rating: LocationRatingInput
) {
  const base = getLocalBusinessSchema(location);
  return {
    ...base,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.ratingValue.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: rating.reviewCount,
    },
    ...(rating.reviews && rating.reviews.length > 0
      ? {
          review: rating.reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewBody: r.reviewBody,
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.ratingValue.toString(),
              bestRating: "5",
              worstRating: "1",
            },
            ...(r.datePublished ? { datePublished: r.datePublished } : {}),
          })),
        }
      : {}),
  };
}

/**
 * LodgingBusiness schema with embedded AggregateRating + Review items.
 * Unlocks star rating rich results on the accommodation entity per location.
 */
export function getLodgingBusinessWithRatingSchema(
  location: Location,
  rating: LocationRatingInput,
  priceRange?: { min: number; max: number; currency?: string }
) {
  const base = getLodgingBusinessSchema(location);
  return {
    ...base,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.ratingValue.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: rating.reviewCount,
    },
    ...(priceRange && {
      priceRange: `${priceRange.currency ?? "₹"}${priceRange.min}–${priceRange.currency ?? "₹"}${priceRange.max}`,
      makesOffer: {
        "@type": "Offer",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          priceCurrency: priceRange.currency === "$" ? "USD" : "INR",
        },
      },
    }),
    ...(rating.reviews && rating.reviews.length > 0
      ? {
          review: rating.reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewBody: r.reviewBody,
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.ratingValue.toString(),
              bestRating: "5",
              worstRating: "1",
            },
            ...(r.datePublished ? { datePublished: r.datePublished } : {}),
          })),
        }
      : {}),
  };
}

/**
 * TouristAttraction schema for Anand Sagar — Shegaon's 350-acre spiritual park.
 * Linked to the Shegaon temple entity via containedInPlace.
 */
export function getAnandSagarSchema() {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": `${baseUrl}#anand-sagar`,
    name: "Anand Sagar — Shri Gajanan Maharaj Sansthan",
    alternateName: [
      "Anand Sagar Shegaon",
      "Ananda Sagar",
      "आनंद सागर",
      "आनंद सागर शेगांव",
    ],
    description:
      "350-acre spiritual and recreational complex developed by Shri Gajanan Maharaj Sansthan at Shegaon. Features Dhyan Kendra with a 35-foot Swami Vivekananda statue, meditation centers, gardens, boating, toy train, and children's play areas. Free entry for devotees.",
    url: `${baseUrl}/locations/shegaon-bhakt-niwas`,
    isAccessibleForFree: true,
    publicAccess: true,
    containedInPlace: {
      "@id": `${baseUrl}/locations/shegaon-bhakt-niwas#temple`,
    },
    parentOrganization: { "@id": `${baseUrl}#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shegaon",
      addressRegion: "Maharashtra",
      postalCode: "444203",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "17:00",
    },
  };
}

interface FestivalEventInput {
  name: string;
  alternateName?: string[];
  description: string;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
  locationId?: string;
  image?: string;
}

/**
 * Enriched Event schema for festivals with linked organizer, free offers,
 * and offline attendance mode. Use on homepage + dedicated festival pages.
 */
export function getFestivalEventSchema(input: FestivalEventInput) {
  const baseUrl = getSiteUrl();
  const locationRef = input.locationId
    ? { "@id": `${baseUrl}/locations/${input.locationId}#temple` }
    : {
        "@type": "Place",
        name: input.locationName,
        address: input.locationAddress,
      };

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    ...(input.alternateName && { alternateName: input.alternateName }),
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: locationRef,
    organizer: { "@id": `${baseUrl}#organization` },
    isAccessibleForFree: true,
    ...(input.image && {
      image: input.image.startsWith("http")
        ? input.image
        : `${baseUrl}${input.image}`,
    }),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: baseUrl,
      validFrom: input.startDate,
    },
  };
}

/**
 * ImageObject schema — for gallery hero / darshan photos.
 * Feeds Google Images rich results.
 */
export function getImageObjectSchema(
  url: string,
  caption: string,
  width = 1200,
  height = 630
) {
  const baseUrl = getSiteUrl();
  const absUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: absUrl,
    url: absUrl,
    caption,
    name: caption,
    width: String(width),
    height: String(height),
    creator: { "@id": `${baseUrl}#organization` },
    copyrightHolder: { "@id": `${baseUrl}#organization` },
    license: `${baseUrl}/terms-conditions`,
  };
}

interface VideoObjectInput {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl?: string;
  embedUrl?: string;
  uploadDate: string;
  duration?: string;
  isLive?: boolean;
}

/**
 * VideoObject schema — use when live darshan or recorded aarti videos exist.
 * Omits fields that are undefined so we only emit valid schema.
 */
export function getVideoObjectSchema(input: VideoObjectInput) {
  const baseUrl = getSiteUrl();
  const thumb = input.thumbnailUrl.startsWith("http")
    ? input.thumbnailUrl
    : `${baseUrl}${input.thumbnailUrl}`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    thumbnailUrl: thumb,
    uploadDate: input.uploadDate,
    publisher: { "@id": `${baseUrl}#organization` },
  };
  if (input.contentUrl) schema.contentUrl = input.contentUrl;
  if (input.embedUrl) schema.embedUrl = input.embedUrl;
  if (input.duration) schema.duration = input.duration;
  if (input.isLive) {
    schema.publication = {
      "@type": "BroadcastEvent",
      isLiveBroadcast: true,
      startDate: input.uploadDate,
    };
  }
  return schema;
}
