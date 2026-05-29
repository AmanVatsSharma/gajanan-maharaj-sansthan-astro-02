/**
 * File: src/features/info/components/Hero.tsx
 * Module: info
 * Purpose: Premium hero section with parallax, animations, and decorative elements.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-04-11
 * Notes:
 * - Lightened overlay to ~black/55 so temple photo is visible
 * - Added Devanagari script line and gold trust badge
 * - Pulsing ring animation on WhatsApp CTA for attention
 * - Gold decorative border at bottom of content area
 */
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, PhoneCall } from "lucide-react";
import { CONTACT_DETAILS, WHATSAPP_LINK } from "@/data/contact";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics/events";

export function Hero() {
  const { scrollY } = useScroll();

  // Parallax transforms
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const bookingCallHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;
  const heroWhatsAppMessage = [
    "🙏 Jai Gajanan Maharaj 🙏",
    "",
    "Accommodation booking enquiry",
    "Kindly guide me for availability and booking process.",
  ].join("\n");
  const heroWhatsAppHref = `${WHATSAPP_LINK}?text=${encodeURIComponent(heroWhatsAppMessage)}`;

  return (
    <div className="relative flex min-h-[90vh] svh:min-h-[90svh] items-center justify-center overflow-hidden">
      {/* Parallax background with lightened overlay — ~55% black so temple is visible */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {/* Primary overlay — kept at 55 for visibility */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/45 to-black/65 z-10" />
        <img
          src="/gallery/hero-image-2026-02-05.jpeg"
          alt="Shri Gajanan Maharaj Temple Shegaon - Main entrance and temple complex with devotees"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center scale-110"
        />
        {/* Subtle radial vignette for depth without heavy darkening */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.3)_100%)] z-10" />
      </motion.div>

      {/* Floating ambient glows — purely decorative */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-[10%] w-32 h-32 rounded-full bg-brand-gold/8 blur-3xl"
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-[15%] w-40 h-40 rounded-full bg-brand-saffron/8 blur-3xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <motion.div
        className="container relative z-20 text-center text-white px-4 py-16 sm:py-20"
        style={{ opacity }}
      >
        {/* Devanagari script line — rendered before the English badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-3 md:mb-4"
        >
          <span className="font-serif italic text-brand-gold text-base md:text-lg tracking-widest drop-shadow-lg">
            ॥ श्री गजानन महाराज ॥
          </span>
        </motion.div>

        {/* Official Website badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-block mb-6 md:mb-8"
        >
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 border border-brand-gold/60 rounded-full bg-black/35">
            {/* Soft gold glow behind badge */}
            <motion.div
              className="absolute inset-0 rounded-full bg-brand-gold/15 blur-xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Small lotus SVG icon */}
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 md:h-4 md:w-4 text-brand-gold relative z-10 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C10.5 5 8 7 5 8c2 3 5 4 7 4s5-1 7-4c-3-1-5.5-3-7-6zm0 0c1.5 3 4 5 7 6-1 3-3 5-7 6-4-1-6-3-7-6 3-1 5.5-3 7-6z" />
            </svg>
            <span className="text-brand-gold font-semibold tracking-wider text-xs md:text-sm uppercase relative z-10">
              Official Website
            </span>
          </div>
        </motion.div>

        {/* Spiritual chant */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mb-4 md:mb-5 text-xl md:text-3xl lg:text-4xl font-medium tracking-wide md:tracking-wider text-brand-gold font-serif italic"
        >
          <span className="inline-block">|| Jai Gajanan Maharaj ||</span>
        </motion.p>

        {/* Main heading — large Playfair with subtle gold text-shadow */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-5 md:mb-6 text-4xl md:text-6xl lg:text-8xl font-bold font-heading text-white drop-shadow-2xl leading-tight px-2 text-balance"
          style={{ textShadow: "0 2px 24px rgba(212,175,55,0.25), 0 1px 4px rgba(0,0,0,0.6)" }}
        >
          Shri Gajanan Maharaj Sansthan
        </motion.h1>

        {/* Gold ornamental divider line below heading */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="flex items-center justify-center gap-3 mb-6 md:mb-8"
        >
          <div className="h-px w-16 md:w-24 bg-linear-to-r from-transparent to-brand-gold/70" />
          {/* Small diamond */}
          <svg aria-hidden="true" className="w-3 h-3 text-brand-gold shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0L7.5 4.5H12L8.25 7.3L9.75 12L6 9.2L2.25 12L3.75 7.3L0 4.5H4.5Z" />
          </svg>
          <div className="h-px w-16 md:w-24 bg-linear-to-l from-transparent to-brand-gold/70" />
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-10 md:mb-12 text-base md:text-xl lg:text-2xl text-gray-100/90 max-w-3xl mx-auto font-light leading-relaxed px-2"
        >
          Experience spiritual serenity and divine grace. Plan your visit for Darshan and comfortable stay at our Bhakta Niwas.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto justify-center">
            {/* WhatsApp button with pulsing ring */}
            <div className="relative w-full sm:w-auto flex justify-center">
              {/* Outer pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-[#25D366]/40"
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
              <Button
                asChild
                size="lg"
                className="relative w-full sm:w-auto bg-brand-saffron hover:bg-brand-saffron/90 text-white border border-white/20 sm:min-w-[220px] text-base md:text-lg h-14 md:h-16 rounded-full shadow-2xl shadow-black/20 hover:scale-105 transition-all duration-300 font-semibold"
              >
                <a
                  href={heroWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp for accommodation booking"
                  onClick={() => trackWhatsAppClick("hero_primary")}
                >
                  <MessageCircle className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
                  WhatsApp Booking
                </a>
              </Button>
            </div>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 sm:min-w-[220px] text-base md:text-lg h-14 md:h-16 rounded-full hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <a
                href={bookingCallHref}
                aria-label="Call the booking helpline"
                onClick={() => trackPhoneClick(CONTACT_DETAILS.booking.mobile, "homepage_hero")}
              >
                <PhoneCall className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
                Call Now
              </a>
            </Button>
          </div>

          {/* Tappable phone number */}
          <motion.a
            href={bookingCallHref}
            onClick={() => trackPhoneClick(CONTACT_DETAILS.booking.mobile, "hero_phone_link")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-white/70 hover:text-white text-sm md:text-base transition-colors duration-200 mt-1"
            aria-label="Call us directly"
          >
            📞 {CONTACT_DETAILS.booking.mobile}
          </motion.a>
        </motion.div>

        {/* Trust indicator — gold pill badge with horizontal rules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-8 md:mt-10 flex items-center justify-center gap-3"
        >
          <div className="h-px w-10 md:w-16 bg-brand-gold/40" />
          <span className="inline-flex items-center px-4 py-1 rounded-full border border-brand-gold/50 bg-black/30 text-brand-gold text-xs md:text-sm font-medium tracking-wide">
            Serving devotees since 1908
          </span>
          <div className="h-px w-10 md:w-16 bg-brand-gold/40" />
        </motion.div>
      </motion.div>

      {/* Decorative bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
        <svg
          className="absolute bottom-0 w-full h-8 text-background"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,20 Q300,0 600,20 T1200,20 L1200,40 L0,40 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
