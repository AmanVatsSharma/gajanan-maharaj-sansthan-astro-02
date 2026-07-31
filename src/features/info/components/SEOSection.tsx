/**
 * File: src/features/info/components/SEOSection.tsx
 * Module: info
 * Purpose: SEO-focused informational section highlighting brand variations and booking verification.
 * Author: Gemini CLI / Novologic
 * Last-updated: 2026-05-08
 * Notes:
 * - Addresses "Known by many names" pattern for better SEO coverage
 * - High-intent keyword integration in a user-friendly layout
 * - Uses Framer Motion for graceful entry animations
 */
"use client";

import { motion } from "framer-motion";
import { useContactNumber } from "@/lib/hooks/use-contact-number";
import { Search, ShieldCheck, MapPin, ExternalLink } from "lucide-react";

export function SEOSection() {
  const { number: DISPLAY_PHONE, telHref: TEL_LINK } = useContactNumber();

  const nameVariations = [
    "Shri Gajanan Maharaj Sansthan",
    "Shree Gajanan Maharaj Sansthan",
    "Sri Gajanan Maharaj Sansthan",
    "Gajanan Maharaj Mandir Shegaon",
    "Shegaon Sansthan",
    "SGMS Shegaon",
  ];

  const keywordVariations = [
    "bhakt niwas shegaon booking",
    "bhakta niwas shegaon online booking",
    "gajanan maharaj sansthan room booking",
    "shegaon temple accommodation",
    "bhakt niwas shegaon whatsapp number",
    "shri gajanan maharaj sansthan official website",
  ];

  return (
    <section className="bg-muted/30 py-16 sm:py-24 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center md:text-left"
          >
            <h2 className="text-3xl font-bold tracking-tight text-brand-maroon sm:text-4xl lg:text-5xl font-heading">
              Known by Many Names, <span className="text-brand-saffron">One Sacred Trust</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-4xl">
              Devotees and pilgrims from across the globe often search for our verified accommodation using various names such as{" "}
              {nameVariations.map((name, index) => (
                <span key={name}>
                  <strong className="text-foreground font-semibold">{name}</strong>
                  {index < nameVariations.length - 1 ? ", " : "."}
                </span>
              ))}{" "}
              All these variations point to the same officially registered <strong>Shri Gajanan Maharaj Sansthan</strong> in Shegaon, Maharashtra.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Keyword Variation Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl bg-card p-8 shadow-sm border border-border group hover:border-brand-gold/50 transition-colors"
            >
              <h3 className="text-xl font-bold text-brand-maroon mb-6 flex items-center gap-3">
                <Search className="w-5 h-5 text-brand-gold" />
                Popular Search Terms
              </h3>
              <ul className="grid grid-cols-1 gap-4">
                {keywordVariations.map((kw) => (
                  <li key={kw} className="flex items-center gap-3 text-muted-foreground group/item">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/40 group-hover/item:bg-brand-gold transition-colors" />
                    <span className="text-sm font-medium group-hover/item:text-foreground transition-colors italic">{kw}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  *These terms are frequently used by devotees seeking official darshan and bhakta niwas booking information online.
                </p>
              </div>
            </motion.div>

            {/* Official Status Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl bg-brand-maroon p-8 text-white shadow-xl relative overflow-hidden"
            >
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-saffron/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl" />

              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
                <ShieldCheck className="w-6 h-6 text-brand-gold" />
                Official Verification Guide
              </h3>
              <p className="text-brand-gold/90 mb-8 text-sm font-medium relative z-10">
                For authentic reservations and to avoid fraudulent listings, always follow these verified steps for your visit.
              </p>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-gold font-bold text-sm border border-white/10 group-hover:bg-brand-saffron group-hover:text-white transition-colors">1</div>
                  <div className="space-y-1">
                    <p className="font-semibold flex items-center gap-2">
                      Official Site <ExternalLink className="w-3 h-3 opacity-50" />
                    </p>
                    <p className="text-sm text-white/70">Always use <span className="text-brand-gold font-bold">www.srigajananmaharajsanstan.com</span> for all sansthan related information.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-gold font-bold text-sm border border-white/10 group-hover:bg-brand-saffron group-hover:text-white transition-colors">2</div>
                  <div className="space-y-1">
                    <p className="font-semibold">Booking Helpline</p>
                    <p className="text-sm text-white/70">Call or WhatsApp <a href={TEL_LINK} className="text-brand-gold font-bold hover:underline decoration-brand-gold/30 underline-offset-4">{DISPLAY_PHONE}</a> for verified room status.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-gold font-bold text-sm border border-white/10 group-hover:bg-brand-saffron group-hover:text-white transition-colors">3</div>
                  <div className="space-y-1">
                    <p className="font-semibold flex items-center gap-2">
                      Multiple Locations <MapPin className="w-3 h-3 opacity-50" />
                    </p>
                    <p className="text-sm text-white/70">Our verified Bhakt Niwas services are available in Shegaon, Pandharpur, Omkareshwar, and Trimbakeshwar.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Flow */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-8 border-t border-border/50"
          >
            <p className="text-sm font-medium text-muted-foreground text-center flex flex-wrap items-center justify-center gap-2">
              <span className="italic text-brand-maroon/70">Search Variation</span>
              <span className="text-brand-gold">→</span>
              <span className="italic text-brand-maroon/70">Official Helpline</span>
              <span className="text-brand-gold">→</span>
              <span className="italic text-brand-maroon/70">Verified Booking</span>
              <span className="text-brand-gold">→</span>
              <span className="italic text-brand-maroon/70">Peaceful Spiritual Stay</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
