/**
 * File: src/features/booking/components/BookingLandingForm.tsx
 * Module: booking
 * Purpose: Client-side booking intent form that generates WhatsApp/call CTAs.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-13
 * Notes:
 * - Designed as an SEO-friendly conversion helper (not a booking confirmation system).
 * - Supports `?location=<id>` to preselect a location from internal links.
 */

"use client";

import { useMemo, useState } from "react";
import { MapPin, MessageCircle, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTACT_DETAILS, WHATSAPP_LINK } from "@/data/contact";
import { sansthanLocations } from "@/data/sansthan-data";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics/events";

function formatDateLabel(value: string): string {
  // Keep formatting simple and locale-safe (value is `YYYY-MM-DD` from <input type="date" />).
  return value || "Not specified";
}

interface BookingLandingFormProps {
  initialLocation?: string | null;
}

export function BookingLandingForm({ initialLocation = null }: BookingLandingFormProps) {
  const [locationId, setLocationId] = useState<string>(() => {
    const preselected = initialLocation;
    if (!preselected) return "";
    const exists = sansthanLocations.some((loc) => loc.id === preselected);
    return exists ? preselected : "";
  });
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(3);
  const [phone, setPhone] = useState<string>("");

  const selectedLocation = useMemo(() => {
    return sansthanLocations.find((loc) => loc.id === locationId) ?? null;
  }, [locationId]);

  const bookingCallHref = useMemo(() => {
    return `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;
  }, []);

  const whatsappHref = useMemo(() => {
    const locationLabel = selectedLocation
      ? `${selectedLocation.name}${selectedLocation.city ? `, ${selectedLocation.city}` : ""}`
      : "a Sansthan location";

    const safeGuests = Number.isFinite(guests) && guests > 0 ? guests : 3;

    const message = [
      "🙏 Jai Gajanan Maharaj 🙏",
      "",
      "Accommodation booking enquiry",
      `Preferred location: ${locationLabel}`,
      `Check-in: ${formatDateLabel(checkIn)}`,
      `Check-out: ${formatDateLabel(checkOut)}`,
      `Guests: ${safeGuests}`,
      phone ? `Phone: ${phone}` : undefined,
      "",
      "Kindly share availability and booking process.",
    ]
      .filter(Boolean)
      .join("\n");

    const separator = WHATSAPP_LINK.includes("?") ? "&" : "?";
    return `${WHATSAPP_LINK}${separator}text=${encodeURIComponent(message)}`;
  }, [selectedLocation, checkIn, checkOut, guests, phone]);

  return (
    <div className="rounded-2xl border bg-background p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-brand-saffron/10 p-2">
          <MapPin className="h-5 w-5 text-brand-saffron" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-brand-maroon">
            Send a Booking Request
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fill details below to generate a WhatsApp message, or call the booking helpline.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5">
        <div className="space-y-2">
          <Label htmlFor="booking-location" className="text-brand-maroon">
            Select location
          </Label>
          <Select value={locationId} onValueChange={setLocationId}>
            <SelectTrigger id="booking-location" className="h-12 text-base">
              <SelectValue placeholder="Choose a location" />
            </SelectTrigger>
            <SelectContent>
              {sansthanLocations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}, {loc.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLocation ? (
            <p className="text-xs text-muted-foreground">
              Selected:{" "}
              <span className="font-medium text-brand-maroon">
                {selectedLocation.name}, {selectedLocation.city}
              </span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Tip: selecting a location helps the office respond faster.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="booking-check-in" className="text-brand-maroon">
              Check-in date (optional)
            </Label>
            <Input
              id="booking-check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-check-out" className="text-brand-maroon">
              Check-out date (optional)
            </Label>
            <Input
              id="booking-check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="booking-guests" className="text-brand-maroon">
              Number of guests
            </Label>
            <Input
              id="booking-guests"
              type="number"
              inputMode="numeric"
              min={1}
              max={25}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">
              Note: Sansthan rules may require minimum occupancy for private rooms.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-phone" className="text-brand-maroon">
              Your phone number (optional)
            </Label>
            <Input
              id="booking-phone"
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">
              Optional, but helpful if the office needs to call back.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Button
            asChild
            className="h-12 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md hover:shadow-lg transition-all"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick(`booking_page:${locationId || "unknown"}`)
              }
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp to Book
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-brand-maroon/20"
          >
            <a
              href={bookingCallHref}
              onClick={() =>
                trackPhoneClick(CONTACT_DETAILS.booking.mobile, "booking_page")
              }
            >
              <PhoneCall className="h-5 w-5" />
              Call Now
            </a>
          </Button>
        </div>

        <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
          Final confirmation is provided by the Sansthan office based on availability and rules.
        </div>
      </div>
    </div>
  );
}

