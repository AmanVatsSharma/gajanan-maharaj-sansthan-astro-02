"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

interface Location {
  id: string;
  name: string;
  city: string;
  description: string;
  image: string;
}

const locations: Location[] = [
  {
    id: "shegaon-bhakt-niwas",
    name: "Shri Gajanan Maharaj Sansthan",
    city: "Shegaon, Maharashtra",
    description: "The main pilgrimage center housing the holy Samadhi of Shri Gajanan Maharaj.",
    image: "/images/shegaon-temple.jpg",
  },
  {
    id: "pandharpur-math",
    name: "Shri Gajanan Maharaj Sansthan",
    city: "Pandharpur, Maharashtra",
    description: "A sacred complex near the holy city of Pandharpur for devotees visiting Lord Vitthal.",
    image: "/images/pandharpur.jpg",
  },
  {
    id: "trimbakeshwar",
    name: "Shri Gajanan Maharaj Sansthan",
    city: "Trimbakeshwar, Maharashtra",
    description: "Peaceful accommodation near the sacred Trimbakeshwar Jyotirlinga temple.",
    image: "/images/trimbakeshwar.jpg",
  },
];

export function FeaturedLocations() {
  return (
    <section className="py-16 md:py-20 bg-background">
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
            Sacred Destinations
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-gold/40" />
            <div className="w-2 h-2 bg-brand-gold/50 rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-gold/40" />
          </div>
        </motion.div>

        {/* Clean cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {locations.map((location, index) => (
            <motion.a
              key={location.id}
              href={`/locations/${location.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group block"
            >
              <div className="bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm">
                    <MapPin className="h-4 w-4" />
                    {location.city}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg text-brand-maroon mb-2 group-hover:text-brand-saffron transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {location.description}
                  </p>
                  <div className="flex items-center gap-2 text-brand-saffron text-sm font-medium">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="/locations"
            className="inline-flex items-center gap-2 text-brand-maroon hover:text-brand-saffron font-medium transition-colors"
          >
            <span>View All Locations</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}