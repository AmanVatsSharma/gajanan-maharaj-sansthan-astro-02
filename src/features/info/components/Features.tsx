/**
 * File: src/features/info/components/Features.tsx
 * Module: info
 * Purpose: Display key Sansthan services with traditional premium styling.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-04-11
 * Notes:
 * - Parchment card background with gold numbered indicators
 * - Decorative gold border treatment top & bottom
 * - Lotus SVG alongside service icons for traditional feel
 * - Quote elevated to italic Playfair with decorative marks
 */
"use client";

import { motion } from "framer-motion";
import { Building2, Utensils, Flower2, Bus } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  num: string;
}

const features: Feature[] = [
  {
    title: "Bhakta Niwas",
    description: "Clean and affordable accommodation for families visiting the holy shrine with modern amenities and a spiritual atmosphere.",
    icon: Building2,
    num: "01",
  },
  {
    title: "Mahaprasad",
    description: "Hygienic and nutritious prasad distribution for thousands of devotees daily, prepared with devotion and care.",
    icon: Utensils,
    num: "02",
  },
  {
    title: "Anand Sagar",
    description: "Spiritual and recreational park with meditation centers, beautiful gardens, and serene water features.",
    icon: Flower2,
    num: "03",
  },
  {
    title: "Free Bus Service",
    description: "Complimentary transport between Railway Station, Bhakta Niwas, and Temple for devotee convenience.",
    icon: Bus,
    num: "04",
  },
];

/* Small decorative lotus SVG — purely ornamental */
function LotusIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
    >
      <path d="M16 4C13 8 10 10 6 11c2 4 6 6 10 6s8-2 10-6c-4-1-7-3-10-7zm0 0c3 4 6 6 10 7-1 4-4 7-10 8-6-1-9-4-10-8 4-1 7-3 10-7z" />
      <circle cx="16" cy="22" r="2" />
    </svg>
  );
}

/* Gold ornamental divider with lotus center */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <div className="h-px flex-1 max-w-24 bg-linear-to-r from-transparent to-brand-gold/50" />
      <LotusIcon className="w-5 h-5 text-brand-gold/60 shrink-0" />
      <div className="h-px flex-1 max-w-24 bg-linear-to-l from-transparent to-brand-gold/50" />
    </div>
  );
}

export function Features() {
  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-[#FDFAF4] overflow-hidden">
      {/* Top gold border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-gold/50 to-transparent" />
      {/* Bottom gold border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Subtle ambient glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-[5%] w-72 h-72 rounded-full bg-brand-saffron/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-[5%] w-72 h-72 rounded-full bg-brand-gold/10 blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-block px-3 py-1 md:px-4 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 mb-3 md:mb-4">
            <span className="text-brand-maroon font-semibold text-xs md:text-sm uppercase tracking-wider">
              Our Services
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-brand-maroon mb-3 md:mb-4">
            Serving with Devotion
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dedicated to the service of humanity and devotees with discipline, devotion, and dignity
          </p>
          <GoldDivider />
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full bg-white rounded-2xl p-4 sm:p-5 md:p-7 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 border border-brand-gold/15 overflow-hidden flex flex-col">
                  {/* Large decorative number — parchment watermark */}
                  <span
                    className="absolute top-3 right-4 font-heading font-bold text-5xl md:text-6xl text-brand-gold/10 leading-none select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {feature.num}
                  </span>

                  {/* Icon + lotus pair */}
                  <div className="flex items-center gap-2 mb-4 md:mb-5">
                    <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-brand-saffron/10 group-hover:bg-brand-saffron/20 transition-colors duration-300 shrink-0">
                      <Icon className="h-6 w-6 md:h-7 md:w-7 text-brand-saffron" />
                    </div>
                    <LotusIcon className="w-5 h-5 text-brand-gold/50 group-hover:text-brand-gold/80 transition-colors duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-bold font-heading text-brand-maroon mb-2 leading-snug">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  {/* Gold bottom accent line */}
                  <div className="mt-4 h-px w-full bg-linear-to-r from-brand-gold/40 via-brand-saffron/30 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Inspirational quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="font-heading font-semibold text-lg md:text-xl lg:text-2xl text-brand-maroon/80 italic">
            <span className="text-brand-gold text-3xl leading-none align-bottom mr-1" aria-hidden="true">&#x275D;</span>
            Service to humanity is service to God
            <span className="text-brand-gold text-3xl leading-none align-bottom ml-1" aria-hidden="true">&#x275E;</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
