"use client";

import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "116+", label: "Years of Service" },
  { value: "1M+", label: "Annual Devotees" },
  { value: "10,000+", label: "Daily Prasad" },
  { value: "4", label: "Sacred Locations" },
];

export function ImpactStats() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        {/* Simple header with traditional divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-serif text-brand-gold text-lg mb-3">॥</p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-maroon mb-4">
            Our Legacy
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-gold/40" />
            <div className="w-2 h-2 bg-brand-gold/50 rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-gold/40" />
          </div>
        </motion.div>

        {/* Clean stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-brand-maroon mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}