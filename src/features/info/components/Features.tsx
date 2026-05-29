"use client";

import { motion } from "framer-motion";
import { Building2, UtensilsCrossed, Trees, Bus, Star } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: Feature[] = [
  {
    title: "Bhakta Niwas",
    description: "Clean and comfortable accommodation for devotee families with modern amenities and spiritual atmosphere.",
    icon: Building2,
  },
  {
    title: "Mahaprasad",
    description: "Hygienic and nutritious prasad distribution prepared with devotion for thousands of devotees daily.",
    icon: UtensilsCrossed,
  },
  {
    title: "Anand Sagar",
    description: "350-acre spiritual park with meditation centers, gardens, boating, and serene water features.",
    icon: Trees,
  },
  {
    title: "Free Bus",
    description: "Complimentary transport between Railway Station, Bhakta Niwas, and Temple complex.",
    icon: Bus,
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-amber-50/30 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-brand-saffron/5 blur-3xl" />
      </div>

      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="container relative z-10">
        {/* Traditional header with Om symbol */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Om and decorative elements */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-brand-gold/40" />
            <span className="text-brand-gold text-2xl">🕉️</span>
            <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-brand-gold/40" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-heading text-brand-maroon mb-4">
            Sansthan Services
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Dedicated to serving devotees with devotion, dignity, and discipline
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-gold/50" />
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-gold/50" />
          </div>
        </motion.div>

        {/* Features grid with traditional card design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Card with traditional styling */}
                <div className="relative bg-white rounded-2xl p-6 md:p-8 border border-brand-gold/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  {/* Top decorative line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-brand-saffron to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon container with traditional design */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-saffron/20 to-brand-gold/20 flex items-center justify-center border-2 border-brand-gold/30 group-hover:border-brand-saffron/50 transition-colors">
                      <Icon className="h-9 w-9 text-brand-saffron group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    {/* Decorative dots around icon */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-gold/40" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-gold/40" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold font-heading text-brand-maroon text-center mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom decorative element */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="font-serif italic text-xl md:text-2xl text-brand-maroon/80">
            <span className="text-brand-gold text-3xl">"</span>
            Service to humanity is service to God
            <span className="text-brand-gold text-3xl">"</span>
          </p>
        </motion.div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
    </section>
  );
}