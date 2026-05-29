/**
 * File: src/lib/analytics/events.ts
 * Module: lib/analytics
 * Purpose: Analytics event tracking helper functions
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 * Notes:
 * - Centralized event tracking for consistency
 * - Tracks booking flow, WhatsApp clicks, phone calls, location views
 * - All events follow GA4 recommended event naming conventions
 */

import { trackEvent } from "@/components/analytics/GoogleAnalytics";

/**
 * Track when user starts booking process
 */
export function trackBookingStarted(location?: string) {
  trackEvent("booking_started", {
    location: location || "unknown",
    event_category: "booking",
    event_label: "Booking Form Opened",
  });
}

/**
 * Track when user completes booking form
 */
export function trackBookingCompleted(
  location: string,
  checkInDate: string,
  numberOfPeople: number
) {
  trackEvent("booking_completed", {
    location,
    check_in_date: checkInDate,
    number_of_people: numberOfPeople,
    event_category: "booking",
    event_label: "Booking Request Submitted",
  });
}

/**
 * Track when user clicks WhatsApp button
 */
export function trackWhatsAppClick(source: string) {
  trackEvent("whatsapp_click", {
    source,
    event_category: "engagement",
    event_label: "WhatsApp Contact Click",
  });
}

/**
 * Track when user clicks phone number
 */
export function trackPhoneClick(phoneNumber: string, location?: string) {
  trackEvent("phone_click", {
    phone_number: phoneNumber,
    location: location || "unknown",
    event_category: "engagement",
    event_label: "Phone Number Click",
  });
}

/**
 * Track when user views a location detail page
 */
export function trackLocationView(locationName: string, locationId: string) {
  trackEvent("location_view", {
    location_name: locationName,
    location_id: locationId,
    event_category: "engagement",
    event_label: "Location Page View",
  });
}

/**
 * Track when user clicks "Book Accommodation" CTA
 */
export function trackBookingCTAClick(
  location: string,
  ctaPosition: "sidebar" | "page" | "card"
) {
  trackEvent("booking_cta_click", {
    location,
    cta_position: ctaPosition,
    event_category: "conversion",
    event_label: "Booking CTA Clicked",
  });
}

/**
 * Track form field errors (helpful for UX optimization)
 */
export function trackFormError(fieldName: string, errorType: string) {
  trackEvent("form_error", {
    field_name: fieldName,
    error_type: errorType,
    event_category: "form",
    event_label: "Form Validation Error",
  });
}

/**
 * Track navigation clicks (internal linking)
 */
export function trackNavigation(destination: string, source: string) {
  trackEvent("navigation", {
    destination,
    source,
    event_category: "navigation",
    event_label: "Internal Navigation",
  });
}
