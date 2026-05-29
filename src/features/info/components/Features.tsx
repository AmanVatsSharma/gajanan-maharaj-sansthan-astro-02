"use client";

import { motion } from "framer-motion";
import { Building2, UtensilsCrossed, Trees, Bus } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: Feature[] = [
  {
    title: "Bhakta Niwas",
    description: "Clean accommodation for devotees with modern amenities and spiritual atmosphere.",
    icon: Building2,
  },
  {
    title: "Mahaprasad",
    description: "Hygienic prasad distribution prepared with devotion for thousands daily.",
    icon: UtensilsCrossed,
  },
  {
    title: "Anand Sagar",
    description: "Spiritual park with meditation centers, gardens, and serene water features.",
    icon: Trees,
  },
  {
    title: "Free Bus",
    description: "Complimentary transport between station, Bhakta Niwas, and temple.",
    icon: Bus,
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        {/* Traditional header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-serif text-brand-gold text-xl mb-3">॥</p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-maroon mb-4">
            Sansthan Services
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-gold/40" />
            <div className="w-2 h-2 bg-brand-gold/50 rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-gold/40" />
          </div>
        </motion.div>

        {/* Clean 2x2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center border border-border/50 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-saffron/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-brand-saffron" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-maroon mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}