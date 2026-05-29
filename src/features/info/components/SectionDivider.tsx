/**
 * File: src/features/info/components/SectionDivider.tsx
 * Module: info
 * Purpose: Reusable decorative divider between sections.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 * Notes:
 * - Elegant traditional Indian motif-inspired design
 * - Animated reveal on scroll
 */
"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "default" | "ornate" | "minimal";
}

export function SectionDivider({ variant = "default" }: SectionDividerProps) {
  if (variant === "minimal") {
    return (
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container"
        >
          <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
        </motion.div>
      </div>
    );
  }

  if (variant === "ornate") {
    return (
      <div className="py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container"
        >
          <div className="flex items-center justify-center gap-4">
            {/* Left ornament */}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-maroon/40" />
              <div className="w-16 h-px bg-linear-to-r from-transparent to-brand-gold/60" />
              <div className="w-2 h-2 rounded-full bg-brand-gold/60" />
            </div>

            {/* Center lotus symbol */}
            <div className="w-8 h-8 rounded-full bg-brand-saffron/10 border border-brand-gold/30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-brand-gold" />
            </div>

            {/* Right ornament */}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-gold/60" />
              <div className="w-16 h-px bg-linear-to-l from-transparent to-brand-gold/60" />
              <div className="w-2 h-2 rounded-full bg-brand-maroon/40" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-linear-to-r from-transparent to-brand-gold/50" />
          <div className="w-2 h-2 rounded-full bg-brand-gold" />
          <div className="w-8 h-px bg-brand-gold/50" />
          <div className="w-3 h-3 rounded-full bg-brand-saffron/30 border-2 border-brand-gold flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-brand-gold" />
          </div>
          <div className="w-8 h-px bg-brand-gold/50" />
          <div className="w-2 h-2 rounded-full bg-brand-gold" />
          <div className="w-12 h-px bg-linear-to-l from-transparent to-brand-gold/50" />
        </div>
      </motion.div>
    </div>
  );
}
