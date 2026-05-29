/**
 * File: src/features/info/components/ImpactStats.tsx
 * Module: info
 * Purpose: Display impact statistics with animated counters on a warm gradient panel.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-04-11
 * Notes:
 * - Redesigned with warm saffron/gold gradient panel instead of card grid
 * - Added lotus SVG divider between header and stats
 * - Gold bottom border accent on each stat item
 * - Numbers rendered in Playfair Display (font-heading) for traditional gravitas
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  {
    id: "years",
    value: 116,
    suffix: "+",
    label: "Years of Service",
    description: "Serving devotees since 1908",
  },
  {
    id: "devotees",
    value: 1,
    suffix: "M+",
    label: "Annual Devotees",
    description: "Millions visit every year",
  },
  {
    id: "locations",
    value: 6,
    suffix: "+",
    label: "Holy Locations",
    description: "Across sacred pilgrimage sites",
  },
  {
    id: "prasad",
    value: 10000,
    suffix: "+",
    label: "Daily Prasad",
    description: "Servings distributed daily",
  },
];

interface CounterProps {
  end: number;
  duration?: number;
}

function Counter({ end, duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(countRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, end, duration]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
}

/* Inline lotus SVG — 8-petal design, purely decorative */
function LotusIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Centre circle */}
      <circle cx="32" cy="32" r="5" />
      {/* 8 petals — each a rounded teardrop rotated around centre */}
      <ellipse cx="32" cy="18" rx="4" ry="10" />
      <ellipse cx="32" cy="46" rx="4" ry="10" />
      <ellipse cx="18" cy="32" rx="10" ry="4" />
      <ellipse cx="46" cy="32" rx="10" ry="4" />
      {/* Diagonal petals */}
      <ellipse cx="21.5" cy="21.5" rx="4" ry="10" transform="rotate(-45 21.5 21.5)" />
      <ellipse cx="42.5" cy="21.5" rx="4" ry="10" transform="rotate(45 42.5 21.5)" />
      <ellipse cx="21.5" cy="42.5" rx="4" ry="10" transform="rotate(45 21.5 42.5)" />
      <ellipse cx="42.5" cy="42.5" rx="4" ry="10" transform="rotate(-45 42.5 42.5)" />
    </svg>
  );
}

export function ImpactStats() {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Warm parchment background matching the page */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-amber-50/60 to-background" />

      {/* Subtle ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-gold/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-brand-saffron/8 blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-block px-3 py-1 md:px-4 rounded-full bg-brand-saffron/10 border border-brand-saffron/25 mb-3 md:mb-4">
            <span className="text-brand-maroon font-semibold text-xs md:text-sm uppercase tracking-wider">
              Our Impact
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-brand-maroon mb-3 md:mb-4">
            Serving with Devotion
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Continuing the legacy of Shri Gajanan Maharaj through dedicated service to humanity
          </p>
        </motion.div>

        {/* Lotus divider between header and stats panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-10 md:mb-12"
        >
          <div className="h-px flex-1 max-w-[80px] bg-linear-to-r from-transparent to-brand-gold/50" />
          <LotusIcon className="h-8 w-8 text-brand-gold shrink-0" />
          <div className="h-px flex-1 max-w-[80px] bg-linear-to-l from-transparent to-brand-gold/50" />
        </motion.div>

        {/* Stats panel — warm gradient background with gold frame */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Panel gradient background — saffron/10 → gold/5 */}
          <div className="absolute inset-0 bg-linear-to-br from-brand-saffron/12 via-amber-50/80 to-brand-gold/10" />
          {/* Gold frame border */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-brand-gold/30" />
          {/* Decorative top accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-brand-gold/70 to-transparent" />
          {/* Decorative bottom accent stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-brand-gold/70 to-transparent" />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-brand-gold/20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.12 }}
                className="relative flex flex-col items-center text-center px-4 py-10 md:py-14 lg:px-8"
              >
                {/* Gold bottom border accent — thin line at bottom of content area */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-linear-to-r from-transparent via-brand-gold to-transparent" />

                {/* Large Playfair number */}
                <div className="mb-2">
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-brand-maroon leading-none tabular-nums">
                    <Counter end={stat.value} />
                    <span className="text-brand-saffron">{stat.suffix}</span>
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-brand-maroon mb-1 leading-tight">
                  {stat.label}
                </h3>

                {/* Description — subtler */}
                <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-10 md:mt-12"
        >
          <div className="w-8 md:w-12 h-px bg-linear-to-r from-transparent to-brand-gold/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
          <div className="w-4 md:w-6 h-px bg-brand-gold/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
          <div className="w-8 md:w-12 h-px bg-linear-to-l from-transparent to-brand-gold/50" />
        </motion.div>
      </div>
    </section>
  );
}
