"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { CONTACT_DETAILS } from "@/data/contact";

// New hero with uploaded image background
const HERO_WITH_NEW_IMAGE = "/hero/new-hero-bg.png";

export function Hero() {
  const bookingCallHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="relative min-h-[90vh] svh:min-h-[90svh] flex items-center justify-center overflow-hidden">
      {/* New hero background with uploaded image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 z-10" />
        <img
          key={HERO_WITH_NEW_IMAGE}
          src={HERO_WITH_NEW_IMAGE}
          alt="Shri Gajanan Maharaj Temple"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Traditional border pattern at top */}
        <div className="absolute top-0 left-0 right-0 h-2 z-20 bg-gradient-to-r from-brand-gold via-brand-saffron to-brand-gold" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full min-h-[90vh] svh:min-h-[90svh] flex flex-col justify-end pb-20 md:pb-24">
        {/* SEO-only content kept in DOM but visually hidden (aria-hidden, display:none) so it does not block the image.
            Crawlers that ignore display:none still index the text; screen readers skip it. */}
        <div aria-hidden="true" hidden>
          <h1>
            Welcome to Shri Gajanan Maharaj Sansthan
            <br />
            Shegaon, Maharashtra
          </h1>
          <p>
            ॥ श्री गजानन महाराज ॥ — Jai Gajanan Maharaj
          </p>
          <p>
            Experience divine serenity at the sacred shrine of Shri Gajanan Maharaj. Plan your
            spiritual journey for Darshan and peaceful Bhakta Niwas stay at Shri Gajanan Maharaj
            Sansthan Shegaon, Pandharpur, Omkareshwar, and Trimbakeshwar.
          </p>
          <ul>
            <li>Serving devotees since 1908</li>
            <li>4 Sacred Locations: Shegaon, Pandharpur, Omkareshwar, Trimbakeshwar</li>
            <li>Free Bus Service</li>
            <li>Bhakta Niwas accommodation booking</li>
          </ul>
        </div>

        {/* CTA buttons — pinned near the bottom of the hero so the background image stays unobstructed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6"
        >
          <Button
            asChild
            size="lg"
            className="bg-brand-saffron hover:bg-brand-saffron/90 text-white border-0 h-14 px-10 text-lg font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <a href={bookingCallHref}>
              <PhoneCall className="h-5 w-5 mr-2" />
              Book Accommodation
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent hover:bg-white/15 text-white border-2 border-white/50 h-14 px-10 text-lg font-medium rounded-full hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            <a href="/locations">
              Explore Locations
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade with gradient — lightened so image stays visible */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/30 to-transparent" />
        {/* Traditional border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      </div>
    </div>
  );
}