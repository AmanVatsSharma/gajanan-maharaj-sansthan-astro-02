/**
 * File: src/features/info/components/Testimonials.tsx
 * Module: info
 * Purpose: Display devotee testimonials with traditional parchment styling.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-04-11
 * Notes:
 * - Parchment card backgrounds with faint lotus watermark
 * - Large decorative Unicode quote marks in gold
 * - 5-star gold ratings for each testimonial
 * - Author divider in gold-saffron-maroon gradient
 */
"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";

/* Five gold stars */
function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} aria-hidden="true" className="w-4 h-4 text-brand-gold" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* Faint lotus watermark for card background */
function LotusWatermark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      fill="none"
      className="absolute bottom-3 right-3 w-20 h-20 text-brand-gold opacity-[0.06] pointer-events-none"
    >
      <path
        fill="currentColor"
        d="M60 10C48 26 36 34 18 36c6 18 22 28 42 28s36-10 42-28c-18-2-30-10-42-26zm0 0c12 16 24 24 42 26-4 18-18 30-42 32-24-2-38-14-42-32 18-2 30-10 42-26z"
      />
      <circle cx="60" cy="75" r="6" fill="currentColor" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-background overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-[15%] w-64 h-64 rounded-full bg-brand-gold/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-[15%] w-64 h-64 rounded-full bg-brand-saffron/20 blur-3xl" />
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
          <div className="inline-block px-3 py-1 md:px-4 rounded-full bg-brand-saffron/10 border border-brand-saffron/20 mb-3 md:mb-4">
            <span className="text-brand-maroon font-semibold text-xs md:text-sm uppercase tracking-wider">
              Devotee Experiences
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-brand-maroon mb-3 md:mb-4 px-4">
            What Devotees Say
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            Heartfelt blessings shared by devotees who visited our holy shrines
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full bg-[#FEF9EE] rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-brand-gold/20 hover:border-brand-gold/40 overflow-hidden">
                {/* Faint lotus watermark */}
                <LotusWatermark />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Stars + large opening quote */}
                  <div className="flex items-start justify-between mb-4">
                    <StarRating />
                    <span
                      className="font-serif text-6xl md:text-7xl text-brand-gold/25 leading-none -mt-3 select-none"
                      aria-hidden="true"
                    >
                      &#x275D;
                    </span>
                  </div>

                  {/* Quote text */}
                  <blockquote className="mb-6 flex-1">
                    <p className="text-foreground/80 leading-relaxed italic text-sm md:text-base font-serif">
                      {testimonial.quote}
                    </p>
                  </blockquote>

                  {/* Gold gradient divider */}
                  <div className="w-full h-px bg-linear-to-r from-brand-gold/60 via-brand-saffron/40 to-transparent mb-4" />

                  {/* Author */}
                  <div>
                    <p className="font-semibold font-heading text-brand-maroon text-sm md:text-base">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing spiritual line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-12 md:w-20 bg-linear-to-r from-transparent to-brand-gold/50" />
            <p className="font-serif italic text-brand-maroon/70 text-base md:text-lg tracking-wide">
              ॥ Jai Gajanan Maharaj ॥
            </p>
            <div className="h-px w-12 md:w-20 bg-linear-to-l from-transparent to-brand-gold/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
