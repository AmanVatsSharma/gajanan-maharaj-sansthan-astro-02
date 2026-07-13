/**
 * File: src/features/info/components/CTABanner.tsx
 * Module: info
 * Purpose: Final compelling CTA banner before footer.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-04-11
 * Notes:
 * - Saffron → maroon gradient with mandala radial overlay
 * - Gold ornamental borders top & bottom with lotus center
 * - Devanagari blessing line above main heading
 * - Saffron-toned WhatsApp button to stay on-brand (not generic green)
 * - Breathing room increased, text simplified
 */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, PhoneCall, Send } from "lucide-react";
import { CONTACT_DETAILS, WHATSAPP_LINK } from "@/data/contact";
import { BookingDialog } from "@/features/booking/components/BookingDialog";

/* Mandala-like radial SVG overlay */
function MandalaOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
    >
      {[40, 80, 120, 160, 200, 240].map((r) => (
        <circle key={r} cx="400" cy="250" r={r} stroke="white" strokeWidth="1" fill="none" />
      ))}
      {/* Radiating lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x2 = 400 + 240 * Math.cos(angle);
        const y2 = 250 + 240 * Math.sin(angle);
        return <line key={i} x1="400" y1="250" x2={x2} y2={y2} stroke="white" strokeWidth="0.8" />;
      })}
    </svg>
  );
}

/* Gold ornamental border row */
function OrnamentalBorder() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      <div className="h-px flex-1 bg-white/20" />
      <svg viewBox="0 0 32 12" className="w-8 h-3 text-white/40" fill="currentColor">
        <path d="M16 0L18 4H22L19 6.5L20 11L16 8.5L12 11L13 6.5L10 4H14Z" />
      </svg>
      <div className="h-px flex-1 bg-white/20" />
    </div>
  );
}

export function CTABanner() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const callHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;
  const isWhatsAppOnly = CONTACT_DETAILS.booking.whatsappBookingOnly;

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Rich deep gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-brand-saffron via-[#A0300A] to-brand-maroon" />

      {/* Mandala pattern overlay */}
      <MandalaOverlay />

      {/* Floating ambient glow */}
      <motion.div
        className="absolute top-10 left-[10%] w-40 h-40 rounded-full bg-white/8 blur-3xl pointer-events-none"
        animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-[10%] w-32 h-32 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none"
        animate={{ y: [0, -16, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Top ornamental border */}
      <div className="absolute top-6 left-6 right-6 md:left-16 md:right-16">
        <OrnamentalBorder />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center text-white max-w-3xl mx-auto"
        >
          {/* Devanagari blessing */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif italic text-white/70 text-sm md:text-base tracking-widest mb-4"
          >
            ॥ श्री गजानन महाराज संस्थान ॥
          </motion.p>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 md:mb-6 px-4 leading-tight text-balance"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
          >
            Experience Divine Grace & Spiritual Serenity
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base md:text-lg text-white/80 mb-10 md:mb-12 max-w-xl mx-auto px-4 leading-relaxed"
          >
            Book your stay at Bhakta Niwas and feel the blessings of Shri Gajanan Maharaj.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            {/* WhatsApp — saffron-toned, on-brand */}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto min-w-[240px] sm:min-w-[280px] h-14 md:h-16 text-base md:text-lg rounded-full bg-white text-brand-maroon hover:bg-brand-gold hover:text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold border-0"
            >
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("cta_banner")}
              >
                <MessageCircle className="mr-2 h-5 w-5 md:h-6 md:w-6 shrink-0" />
                Book on WhatsApp
              </a>
            </Button>

            {/* Call / Booking Request */}
            {isWhatsAppOnly ? (
              <Button
                size="lg"
                onClick={() => setIsBookingOpen(true)}
                variant="outline"
                className="w-full sm:w-auto min-w-[200px] sm:min-w-[240px] h-14 md:h-16 text-base md:text-lg rounded-full border-2 border-white/50 bg-white/10 text-white hover:bg-white/20 hover:border-white/70 shadow-lg transition-all duration-300 font-semibold"
              >
                <Send className="mr-2 h-5 w-5 md:h-6 md:w-6 shrink-0" />
                Send Booking Request
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-[200px] sm:min-w-[240px] h-14 md:h-16 text-base md:text-lg rounded-full border-2 border-white/50 bg-white/10 text-white hover:bg-white/20 hover:border-white/70 shadow-lg transition-all duration-300 font-semibold"
              >
                <a
                  href={callHref}
                  onClick={() => trackPhoneClick(CONTACT_DETAILS.booking.mobile, "cta_banner")}
                >
                  <PhoneCall className="mr-2 h-5 w-5 md:h-6 md:w-6 shrink-0" />
                  {CONTACT_DETAILS.booking.mobile}
                </a>
              </Button>
            )}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs md:text-sm text-white/60"
          >
            <div className="flex items-center gap-2">
              {/* Lotus dot */}
              <svg aria-hidden="true" className="w-3 h-3 text-brand-gold/70 shrink-0" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1C4.5 3 3 4 1 4.5c1 2 3 3 5 3s4-1 5-3C9 4 7.5 3 6 1zm0 0c1.5 2 3 3 5 3.5-.5 2-2 3.5-5 4-3-.5-4.5-2-5-4C3 4 4.5 3 6 1z" />
              </svg>
              <span>Trusted Since 1908</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <svg aria-hidden="true" className="w-3 h-3 text-brand-gold/70 shrink-0" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1C4.5 3 3 4 1 4.5c1 2 3 3 5 3s4-1 5-3C9 4 7.5 3 6 1zm0 0c1.5 2 3 3 5 3.5-.5 2-2 3.5-5 4-3-.5-4.5-2-5-4C3 4 4.5 3 6 1z" />
              </svg>
              <span>10,000+ Devotees Served Daily</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom ornamental border */}
      <div className="absolute bottom-6 left-6 right-6 md:left-16 md:right-16">
        <OrnamentalBorder />
      </div>

      <BookingDialog open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </section>
  );
}
