/**
 * File: src/features/info/components/PlanYourVisit.tsx
 * Module: info
 * Purpose: Practical visit planning information for devotees.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 * Notes:
 * - Displays darshan timings, transport options, and visit tips
 * - Clean icon-based layout with helpful information
 */
"use client";

import { motion } from "framer-motion";
import { Clock, Train, Bus, Plane, Calendar, Info } from "lucide-react";
import { darshanTimings, transportOptions, visitTips, importantNotes } from "@/data/visit-info";

const iconMap = {
  train: Train,
  bus: Bus,
  plane: Plane,
};

export function PlanYourVisit() {
  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-linear-to-b from-background via-brand-maroon/5 to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-[20%] w-56 h-56 rounded-full bg-brand-saffron/30 blur-3xl" />
        <div className="absolute bottom-20 right-[20%] w-56 h-56 rounded-full bg-brand-gold/30 blur-3xl" />
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
              Visit Information
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-brand-maroon mb-3 md:mb-4 px-4">
            Plan Your Pilgrimage
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            Everything you need to know for a smooth and blessed visit to our holy shrines
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-10 md:mb-12">
          {/* Darshan Timings */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border/50"
          >
            <div className="flex items-center gap-2.5 md:gap-3 mb-5 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-saffron/10 flex items-center justify-center">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-brand-saffron" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-heading text-brand-maroon">
                Darshan Timings
              </h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              {darshanTimings.map((timing) => (
                <div
                  key={timing.type}
                  className="flex justify-between items-start p-3 md:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm md:text-base text-foreground mb-1">
                      {timing.type}
                    </p>
                    {timing.description && (
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {timing.description}
                      </p>
                    )}
                  </div>
                  <span className="text-brand-maroon font-semibold text-xs md:text-sm whitespace-nowrap ml-3 md:ml-4">
                    {timing.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Best Time to Visit */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border/50"
          >
            <div className="flex items-center gap-2.5 md:gap-3 mb-5 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-brand-gold" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-heading text-brand-maroon">
                Best Time to Visit
              </h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              {visitTips.map((tip) => (
                <div
                  key={tip.season}
                  className="p-3 md:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    <p className="font-semibold text-sm md:text-base text-foreground">
                      {tip.season}
                    </p>
                    <span className="text-xs font-medium text-brand-maroon bg-brand-maroon/10 px-2 py-1 rounded-full">
                      {tip.months}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* How to Reach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-10 md:mb-12"
        >
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border/50">
            <h3 className="text-xl md:text-2xl font-bold font-heading text-brand-maroon mb-5 md:mb-6 text-center">
              How to Reach Shegaon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {transportOptions.map((option) => {
                const IconComponent = iconMap[option.icon as keyof typeof iconMap];
                return (
                  <div
                    key={option.mode}
                    className="text-center p-5 md:p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 rounded-xl bg-brand-saffron/10 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 md:h-7 md:w-7 text-brand-saffron" />
                    </div>
                    <h4 className="font-semibold text-sm md:text-base text-foreground mb-1.5 md:mb-2">
                      {option.mode}
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-brand-saffron/5 border border-brand-saffron/20 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2.5 md:gap-3 mb-5 md:mb-6">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-brand-saffron/20 flex items-center justify-center">
                <Info className="h-4 w-4 md:h-5 md:w-5 text-brand-saffron" />
              </div>
              <h3 className="text-lg md:text-xl font-bold font-heading text-brand-maroon">
                Important Notes
              </h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
              {importantNotes.map((note, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs md:text-sm text-foreground/80"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-saffron mt-1.5 shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
