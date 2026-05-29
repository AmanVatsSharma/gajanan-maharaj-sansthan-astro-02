/**
 * File: src/features/locations/components/LocationBookingCtas.tsx
 * Module: locations
 * Purpose: Client-side WhatsApp/Call booking CTAs with analytics tracking.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-13
 * Notes:
 * - Kept as a client component to safely attach onClick tracking handlers.
 * - Used by the server-rendered location detail page for SEO + performance.
 */

"use client";

import { MessageCircle, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTACT_DETAILS, WHATSAPP_LINK } from "@/data/contact";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics/events";

export interface LocationBookingCtasProps {
  locationId: string;
  locationName: string;
  locationCity: string;
}

export function LocationBookingCtas({
  locationId,
  locationName,
  locationCity,
}: LocationBookingCtasProps) {
  const bookingCallHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(
    /[^0-9+]/g,
    ""
  )}`;

  const whatsappHref = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    `🙏 Jai Gajanan Maharaj 🙏\n\nAccommodation booking enquiry\nLocation: ${locationName}, ${locationCity}\n\nKindly share availability and booking process.`
  )}`;

  return (
    <div className="space-y-3">
      <Button
        asChild
        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-12 text-base"
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(`location_page:${locationId}`)}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Book on WhatsApp
        </a>
      </Button>

      <Button
        asChild
        variant="outline"
        className="w-full h-12 text-base border-brand-maroon/20"
      >
        <a
          href={bookingCallHref}
          onClick={() =>
            trackPhoneClick(CONTACT_DETAILS.booking.mobile, `location_page:${locationId}`)
          }
        >
          <PhoneCall className="mr-2 h-5 w-5" />
          Call to Book
        </a>
      </Button>

      <div className="text-xs text-muted-foreground text-center">
        * Booking subject to availability and Sansthan rules.
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Prefer a form? Use the{" "}
        <a
          href={`/booking?location=${locationId}`}
          className="underline underline-offset-4 hover:text-foreground"
        >
          booking request page
        </a>
        .
      </div>
    </div>
  );
}

