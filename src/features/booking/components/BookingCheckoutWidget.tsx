/**
 * File: src/features/booking/components/BookingCheckoutWidget.tsx
 * Module: booking
 * Purpose: Home page quick booking strip (Call / WhatsApp first; optional location).
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-04-02
 * Notes:
 * - Used on the homepage under the hero for immediate contact paths.
 * - Does not confirm a booking; office confirms availability.
 */
"use client";

import { useMemo, useState } from "react";
import { ArrowRight, MapPin, MessageCircle, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONTACT_DETAILS, WHATSAPP_LINK } from "@/data/contact";
import { sansthanLocations } from "@/data/sansthan-data";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

const LOCATION_ANY = "__any__";

export interface BookingCheckoutWidgetProps {
  className?: string;
  "data-testid"?: string;
}

/**
 * BookingCheckoutWidget — phone and WhatsApp are always available; location is optional context.
 */
export function BookingCheckoutWidget({ className, "data-testid": dataTestId }: BookingCheckoutWidgetProps) {
  const [locationId, setLocationId] = useState<string>(LOCATION_ANY);

  const selectedLocation = useMemo(() => {
    if (!locationId || locationId === LOCATION_ANY) return null;
    return sansthanLocations.find((loc) => loc.id === locationId) ?? null;
  }, [locationId]);

  const bookingCallHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;

  const quickCheckoutWhatsAppHref = useMemo(() => {
    const lines = [
      "🙏 Jai Gajanan Maharaj 🙏",
      "",
      "Temple accommodation booking enquiry",
      selectedLocation
        ? `Preferred Sansthan location: ${selectedLocation.name}, ${selectedLocation.city}`
        : "",
      "",
      "Kindly guide me on availability and booking.",
    ]
      .filter((line) => line !== "")
      .join("\n");
    return `${WHATSAPP_LINK}?text=${encodeURIComponent(lines)}`;
  }, [selectedLocation]);

  return (
    <section
      id="quick-checkout"
      aria-label="Book temple accommodation by phone or WhatsApp"
      className={cn("relative -mt-14 md:-mt-20 lg:-mt-24 pb-10 md:pb-14", className)}
      data-testid={dataTestId}
    >
      <div className="container">
        <Card className="mx-auto max-w-5xl border-brand-saffron/20 shadow-2xl bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <CardHeader className="pb-4">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-brand-maroon">
              Book temple accommodation
            </h2>
            <CardDescription className="text-sm md:text-base">
              Call or WhatsApp our booking helpline now—no steps required. Optionally pick a location so we can help you faster.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3 sm:flex-wrap">
              <Button
                asChild
                size="lg"
                className="h-12 sm:h-14 rounded-full flex-1 min-w-[200px] bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md"
              >
                <a
                  href={quickCheckoutWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp the Sansthan for temple accommodation booking"
                  onClick={() => trackWhatsAppClick(`quick_checkout:${selectedLocation?.id ?? "any"}`)}
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp to book
                </a>
              </Button>
              <Button asChild variant="premium" size="lg" className="h-12 sm:h-14 rounded-full flex-1 min-w-[200px]">
                <a
                  href={bookingCallHref}
                  aria-label={`Call booking helpline at ${CONTACT_DETAILS.booking.mobile}`}
                  onClick={() =>
                    trackPhoneClick(CONTACT_DETAILS.booking.mobile, `quick_checkout:${selectedLocation?.id ?? "any"}`)
                  }
                >
                  <PhoneCall className="h-5 w-5" />
                  Call now
                </a>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Booking helpline:{" "}
              <span className="font-semibold text-brand-maroon tabular-nums">{CONTACT_DETAILS.booking.mobile}</span>
            </p>

            <div className="space-y-2 pt-1 border-t border-border/60">
              <Label htmlFor="quick-checkout-location" className="text-brand-maroon">
                Optional: preferred location
              </Label>
              <Select
                value={locationId}
                onValueChange={setLocationId}
              >
                <SelectTrigger id="quick-checkout-location" className="h-12 text-base w-full md:max-w-md">
                  <SelectValue placeholder="Any location — office will guide you" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LOCATION_ANY}>Any location / not sure yet</SelectItem>
                  {sansthanLocations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}, {loc.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tip: Have your dates and guest count ready for faster assistance.
              </p>
            </div>

            {selectedLocation ? (
              <div className="rounded-2xl border bg-muted/30 p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-brand-saffron/10 p-2">
                    <MapPin className="h-5 w-5 text-brand-saffron" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-maroon leading-tight">
                      {selectedLocation.name}
                      {selectedLocation.city ? (
                        <span className="text-muted-foreground font-medium">, {selectedLocation.city}</span>
                      ) : null}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{selectedLocation.address}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              Final confirmation is provided by the Sansthan office based on availability and rules.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
              <Button asChild variant="ghost" size="sm" className="h-10 rounded-full">
                <a href="/booking">
                  Booking form
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" className="h-10 rounded-full">
                <a href="/locations">
                  View locations
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
