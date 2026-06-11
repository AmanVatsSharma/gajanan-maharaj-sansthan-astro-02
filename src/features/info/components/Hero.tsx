"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

// New hero with uploaded image background
const HERO_WITH_NEW_IMAGE = "/hero/new-hero-bg.png";

export function Hero() {
  return (
    <div className="relative min-h-[90vh] svh:min-h-[90svh] flex items-end overflow-hidden">
      {/* New hero background with uploaded image — no overlay, fully visible */}
      <div className="absolute inset-0 z-0">
        <img
          key={HERO_WITH_NEW_IMAGE}
          src={HERO_WITH_NEW_IMAGE}
          alt="Shri Gajanan Maharaj Temple"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Content — only the CTA buttons, sitting at the bottom edge of the hero so the image is fully visible above */}
      <div className="relative z-20 w-full flex flex-col items-center justify-end pb-10 md:pb-14 gap-6 px-6">
        {/* SEO-only content kept in DOM but visually hidden (aria-hidden + display:none) so it does not block the image.
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

        {/* CTA buttons — pinned to the bottom of the hero, the booking button scrolls to the widget below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-brand-saffron hover:bg-brand-saffron/90 text-white border-0 h-14 px-10 text-lg font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <a href="tel:+917521063034">
              <PhoneCall className="h-5 w-5 mr-2" />
              Book Accommodation
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/90 hover:bg-white text-brand-maroon border-2 border-white h-14 px-10 text-lg font-medium rounded-full hover:shadow-xl transition-all duration-300"
          >
            <a href="#rooms">
              View Rooms
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}