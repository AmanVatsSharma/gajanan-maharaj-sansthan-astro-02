"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  icon: string;
}

const stats: Stat[] = [
  { value: "116+", label: "Years of Service", icon: "🕉️" },
  { value: "1M+", label: "Annual Devotees", icon: "🙏" },
  { value: "10,000+", label: "Daily Prasad", icon: "🍲" },
  { value: "4", label: "Sacred Locations", icon: "🏛️" },
];

export function ImpactStats() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-brand-gold/5 blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-brand-saffron/5 blur-3xl -translate-y-1/2" />
      </div>

      <div className="container relative z-10">
        {/* Traditional header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-brand-gold/40" />
            <span className="text-brand-gold text-2xl">🕉️</span>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-brand-gold/40" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-heading text-brand-maroon mb-4">
            Our Legacy
          </h2>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-brand-gold/50" />
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-brand-gold/50" />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              {/* Card with hover effect */}
              <div className="relative bg-white rounded-2xl p-6 md:p-8 border border-brand-gold/20 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Icon */}
                <div className="text-4xl mb-4">{stat.icon}</div>

                {/* Value */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-brand-maroon mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>

                {/* Bottom decorative line */}
                <div className="mt-4 h-px w-8 mx-auto bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-gold/30" />
          <p className="font-serif text-brand-gold text-xl">॥</p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-gold/30" />
        </motion.div>
      </div>
    </section>
  );
}