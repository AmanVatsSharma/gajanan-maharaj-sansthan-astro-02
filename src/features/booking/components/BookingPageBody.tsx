/**
 * Booking landing page body (client island for Astro).
 */
"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FAQ } from "@/components/seo/FAQ";
import { StructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { bookingFAQs } from "@/data/faq";
import { BookingLandingForm } from "@/features/booking/components/BookingLandingForm";
import { BookingDialog } from "@/features/booking/components/BookingDialog";
import { getHowToSchema } from "@/lib/seo/structured-data";

interface BookingPageBodyProps {
  initialLocation?: string | null;
}

export function BookingPageBody({ initialLocation = null }: BookingPageBodyProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const howToSchema = getHowToSchema(
    "How to Book Accommodation at Shri Gajanan Maharaj Sansthan",
    "Step-by-step guide to booking Bhakta Niwas accommodation at Shri Gajanan Maharaj Sansthan via WhatsApp or phone. Available at Shegaon, Pandharpur, Trimbakeshwar, and Omkareshwar.",
    [
      "Select your preferred Sansthan location — Shri Gajanan Maharaj Sansthan Shegaon, Shri Gajanan Maharaj Sansthan Pandharpur, Shri Gajanan Maharaj Sansthan Trimbakeshwar, or Shri Gajanan Maharaj Sansthan Omkareshwar.",
      "Fill in your preferred check-in dates and the number of guests. Rooms are for families only — a minimum of 3 family members is usually required. Carry valid government-issued ID proof.",
      "Send the booking request via WhatsApp or call the Sansthan booking helpline. The office confirms room availability and completes your booking based on current occupancy.",
    ],
    "/booking"
  );

  return (
    <>
      <StructuredData data={howToSchema} />
      <div className="container py-12">
        <Breadcrumbs items={[{ name: "Booking", url: "/booking" }]} className="mb-6" />

        <div className="mx-auto max-w-5xl space-y-10">
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-brand-maroon text-balance">
              Accommodation Booking Request
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              This is the official booking help page for devotees. Share your preferred location,
              dates, and guest count, then contact our office via WhatsApp or phone for availability
              and confirmation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full px-6 text-base border-brand-maroon/20"
              >
                <a href="/locations">View Locations</a>
              </Button>
              <Button
                variant="premium"
                className="h-12 rounded-full px-6 text-base"
                onClick={() => setIsBookingOpen(true)}
              >
                Send Request
              </Button>
            </div>
          </header>

          <section id="booking-form" aria-label="Booking request form">
            <BookingLandingForm initialLocation={initialLocation} />
          </section>

          <section className="rounded-2xl border bg-muted/20 p-6 sm:p-8">
            <h2 className="text-2xl font-bold font-heading text-brand-maroon mb-3">
              How booking works
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
              <li>
                Select your preferred location (Shri Gajanan Maharaj Sansthan Shegaon, Shri Gajanan
                Maharaj Sansthan Pandharpur, Shri Gajanan Maharaj Sansthan Trimbakeshwar, or Shri
                Gajanan Maharaj Sansthan Omkareshwar).
              </li>
              <li>Share your dates and guest count.</li>
              <li>Send the request via WhatsApp or call. The office confirms based on availability.</li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              For rules (families only, ID proof, minimum occupancy), please check the FAQs below.
            </p>
          </section>

          <section aria-label="Booking FAQs">
            <FAQ
              title="Booking FAQs"
              description="Common questions about accommodation rules, facilities, and the booking process."
              faqs={bookingFAQs}
            />
          </section>

          <section
            className="rounded-2xl border bg-muted/20 p-6 sm:p-8"
            aria-label="Planning resources"
          >
            <h2 className="text-2xl font-bold font-heading text-brand-maroon mb-3">
              Planning Resources
            </h2>
            <p className="text-muted-foreground mb-4">
              Before you book, explore locations, Sansthan history, and direct contact options.
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="/locations"
                  className="underline underline-offset-4 hover:text-brand-saffron transition-colors"
                >
                  All Sansthan locations &amp; maps
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="underline underline-offset-4 hover:text-brand-saffron transition-colors"
                >
                  About Shri Gajanan Maharaj Sansthan
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="underline underline-offset-4 hover:text-brand-saffron transition-colors"
                >
                  Contact &amp; office details
                </a>
              </li>
            </ul>
          </section>

          <section className="text-center text-sm text-muted-foreground">
            Need direct contact details? Visit{" "}
            <a href="/contact" className="underline underline-offset-4 hover:text-foreground">
              Contact
            </a>
            .
          </section>
        </div>
      </div>

      <BookingDialog open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </>
  );
}
