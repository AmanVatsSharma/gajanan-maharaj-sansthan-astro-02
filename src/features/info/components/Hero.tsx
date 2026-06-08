"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PhoneCall, MapPin } from "lucide-react";
import { CONTACT_DETAILS } from "@/data/contact";

// New hero with uploaded image background
const HERO_WITH_NEW_IMAGE = "/hero/new-hero-bg.png";

export function Hero() {
  const bookingCallHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="relative min-h-[90vh] svh:min-h-[90svh] flex items-center justify-center overflow-hidden">
      {/* New hero background with uploaded image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 z-10" />
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
      <motion.div
        className="relative z-20 text-center text-white px-6 py-20 max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Top decorative element */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-brand-gold" />
            <div className="text-brand-gold text-3xl">🕉️</div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-brand-gold" />
          </div>
        </motion.div>

        {/* Devanagari sacred chant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <p className="font-serif text-brand-gold text-2xl md:text-3xl tracking-widest mb-2 drop-shadow-lg">
            ॥ श्री गजानन महाराज ॥
          </p>
          <p className="font-serif italic text-brand-gold/90 text-xl md:text-2xl tracking-wider drop-shadow-md">
            || Jai Gajanan Maharaj ||
          </p>
        </motion.div>

        {/* Ornate divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-brand-gold/70" />
          <svg className="w-6 h-6 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.5 6.5L18 8L13.5 9.5L12 14L10.5 9.5L6 8L10.5 6.5L12 2Z" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-brand-gold/70" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading text-white mb-6 leading-tight tracking-wide"
        >
          <span className="block text-4xl md:text-5xl lg:text-6xl mb-2 text-brand-gold/90 font-normal italic">
            Welcome to
          </span>
          Shri Gajanan<br />
          <span className="text-brand-gold">Maharaj Sansthan</span>
        </motion.h1>

        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <MapPin className="h-4 w-4 text-brand-gold" />
          <span className="text-white/90 text-sm">Shegaon, Maharashtra</span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Experience divine serenity at the sacred shrine of Shri Gajanan Maharaj.
          <br className="hidden md:block" />
          Plan your spiritual journey for Darshan and peaceful Bhakta Niwas stay.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
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

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="text-brand-gold">🙏</span>
            <span>Serving since 1908</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-brand-gold/50" />
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="text-brand-gold">🏛️</span>
            <span>4 Sacred Locations</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-brand-gold/50" />
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="text-brand-gold">❤️</span>
            <span>Free Bus Service</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        {/* Traditional border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      </div>
    </div>
  );
}