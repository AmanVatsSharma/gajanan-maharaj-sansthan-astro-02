/**
 * File: src/features/info/components/RoomTypesSection.tsx
 * Module: info
 * Purpose: Home page “Rooms” style section with quick WhatsApp/Call CTAs.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-06
 * Notes:
 * - Mirrors the “rooms cards” intent from the reference site, but without pricing.
 * - Room types are derived from `sansthanLocations[].facilities` (location-specific).
 */
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, MessageCircle, PhoneCall, Snowflake, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContactNumber } from "@/lib/hooks/use-contact-number";
import { sansthanLocations, type Facility } from "@/data/sansthan-data";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

const facilityTypeIconMap: Record<Facility["type"], React.ComponentType<{ className?: string }>> = {
  Room: Building2,
  Dormitory: Users,
  Hall: Users,
};

function getFacilitySummary(facility: Facility): string {
  const acLabel = facility.ac ? "AC" : "Non-AC";
  const typeLabel = facility.type;
  return `${typeLabel} • ${acLabel} • Up to ${facility.capacity} devotees`;
}

function buildFacilityWhatsAppHref(whatsappBase: string, locationLabel: string, facility: Facility): string {
  const acLabel = facility.ac ? "AC" : "Non-AC";
  const message = [
    "🙏 Jai Gajanan Maharaj 🙏",
    "",
    "Accommodation enquiry (room details)",
    `Location: ${locationLabel}`,
    `Room type: ${facility.name} (${facility.type}, ${acLabel}, capacity ${facility.capacity})`,
    "",
    "Kindly share tariff and availability for the selected dates.",
  ].join("\n");

  const separator = whatsappBase.includes("?") ? "&" : "?";
  return `${whatsappBase}${separator}text=${encodeURIComponent(message)}`;
}

export function RoomTypesSection() {
  const defaultLocationId = sansthanLocations[0]?.id ?? "";
  const [locationId, setLocationId] = useState<string>(defaultLocationId);
  const { number: contactNumber, telHref: bookingCallHref, whatsappHref: whatsappBase } = useContactNumber();

  const selectedLocation = useMemo(() => {
    return sansthanLocations.find((loc) => loc.id === locationId) ?? null;
  }, [locationId]);

  const facilities = selectedLocation?.facilities ?? [];
  const locationLabel = selectedLocation
    ? `${selectedLocation.name}${selectedLocation.city ? `, ${selectedLocation.city}` : ""}`
    : "Selected location";

  const locationDetailsHref = selectedLocation ? `/locations/${selectedLocation.id}` : "/locations";

  if (!defaultLocationId) {
    return null;
  }

  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-linear-to-b from-background via-muted/20 to-background overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-16 right-[10%] w-80 h-80 rounded-full bg-brand-saffron/25 blur-3xl" />
        <div className="absolute bottom-16 left-[10%] w-80 h-80 rounded-full bg-brand-gold/25 blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-block px-3 py-1 md:px-4 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-3 md:mb-4">
            <span className="text-brand-maroon font-semibold text-xs md:text-sm uppercase tracking-wider">
              Accommodation
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-brand-maroon mb-3 md:mb-4 px-4">
            Room Types
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            Explore room options by location. Tariff and availability vary—please call or WhatsApp for the latest details.
          </p>
        </motion.div>

        {/* Location filter + quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8 md:mb-10"
        >
          <div className="rounded-2xl border bg-card/70 backdrop-blur p-5 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="w-full md:flex-1 space-y-2">
                <Label htmlFor="room-types-location" className="text-brand-maroon">
                  Select Location
                </Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger id="room-types-location" className="h-12 text-base">
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
                <p className="text-xs text-muted-foreground">
                  For amenities and rules, see location details.
                </p>
              </div>

              <Button asChild variant="outline" className="h-11 rounded-full border-brand-maroon/20 w-full md:w-auto">
                <a href={locationDetailsHref}>
                  Location details
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Room cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {facilities.map((facility, index) => {
            const Icon = facilityTypeIconMap[facility.type] ?? Building2;
            const acLabel = facility.ac ? "AC" : "Non-AC";
            const facilityWhatsAppHref = buildFacilityWhatsAppHref(whatsappBase, locationLabel, facility);

            return (
              <motion.div
                key={`${facility.name}-${facility.type}-${facility.ac}-${facility.capacity}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group"
              >
                <div className="relative h-full bg-card rounded-2xl p-6 md:p-7 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-border/50 hover:border-brand-gold/30 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-brand-gold/0 via-brand-saffron/0 to-brand-maroon/0 group-hover:from-brand-gold/5 group-hover:via-brand-saffron/5 group-hover:to-brand-maroon/5 transition-all duration-500" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-saffron/10 group-hover:bg-brand-saffron/20 transition-colors duration-300 shrink-0">
                        <Icon className="h-6 w-6 text-brand-saffron" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border",
                            facility.ac
                              ? "bg-brand-gold/10 border-brand-gold/30 text-brand-maroon"
                              : "bg-muted/60 border-border text-muted-foreground"
                          )}
                        >
                          <Snowflake className="h-3.5 w-3.5" />
                          {acLabel}
                        </span>
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-brand-saffron/10 text-brand-maroon border border-brand-saffron/20">
                          {facility.type}
                        </span>
                      </div>
                    </div>

                    {/* Title + summary */}
                    <h3 className="text-xl md:text-2xl font-bold font-heading text-brand-maroon mb-1 group-hover:text-brand-saffron transition-colors">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      {getFacilitySummary(facility)}
                    </p>

                    {/* Actions */}
                    <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        asChild
                        className="h-11 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm hover:shadow-md"
                      >
                        <a
                          href={facilityWhatsAppHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp to enquire about ${facility.name} at ${locationLabel}`}
                          onClick={() =>
                            trackWhatsAppClick(
                              `rooms_section:${selectedLocation?.id || "unknown"}:${facility.name}`
                            )
                          }
                        >
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>

                      <Button asChild variant="outline" className="h-11 rounded-full border-brand-maroon/20">
                        <a
                          href={bookingCallHref}
                          aria-label={`Call to enquire about ${facility.name} at ${locationLabel}`}
                          onClick={() =>
                            trackPhoneClick(
                              contactNumber,
                              `rooms_section:${selectedLocation?.id || "unknown"}:${facility.name}`
                            )
                          }
                        >
                          <PhoneCall className="h-4 w-4" />
                          Call
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full bg-brand-gold/5 blur-2xl group-hover:bg-brand-gold/10 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-center mt-10 md:mt-12"
        >
          <p className="text-xs md:text-sm text-muted-foreground">
            Looking for a different location?{" "}
            <a href="/locations" className="underline underline-offset-4 hover:text-brand-saffron transition-colors">
              View all locations
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}

