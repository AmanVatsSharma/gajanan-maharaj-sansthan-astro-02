"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { CONTACT_DETAILS } from "@/data/contact";

const heroImages = [
  "/gallery/hero-image-2026-02-05.jpeg",
  "/hero/1.png",
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const bookingCallHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="relative min-h-[85vh] svh:min-h-[85svh] flex items-center justify-center overflow-hidden">
      {/* Auto-sliding background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 z-10" />

        {heroImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={index === 0 ? "Shri Gajanan Maharaj Temple - Sacred shrine at Shegaon" : "Shri Gajanan Maharaj Temple - Divine view"}
            width={1920}
            height={1080}
            fetchPriority={index === 0 ? "high" : "low"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImage
                  ? "bg-brand-gold w-6"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 text-center text-white px-6 py-20 max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1 } }
        }}
      >
        {/* Devanagari sacred chant */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
          }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-gold/60" />
            <span className="text-brand-gold text-2xl">🙏</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-gold/60" />
          </div>
          <p className="font-serif text-brand-gold text-xl md:text-2xl tracking-wider mb-3">
            ॥ श्री गजानन महाराज ॥
          </p>
          <p className="font-serif italic text-brand-gold/90 text-lg md:text-xl tracking-wide">
            || Jai Gajanan Maharaj ||
          </p>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } }
          }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 leading-tight"
        >
          Shri Gajanan<br />
          <span className="text-brand-gold">Maharaj Sansthan</span>
        </motion.h1>

        {/* Simple divider */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scaleX: 0 },
            visible: { opacity: 1, scaleX: 1, transition: { duration: 0.6, delay: 0.7 } }
          }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-brand-gold/50" />
          <svg className="w-4 h-4 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8Z" />
          </svg>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-brand-gold/50" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.9 } }
          }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Experience divine serenity at our sacred shrine.<br className="hidden md:block" />
          Plan your spiritual journey for Darshan and peaceful stay.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.1 } }
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-brand-saffron hover:bg-brand-saffron/90 text-white border-0 h-12 px-8 text-base font-medium rounded-full shadow-lg"
          >
            <a href={bookingCallHref}>
              <PhoneCall className="h-4 w-4 mr-2" />
              Book Accommodation
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent hover:bg-white/10 text-white border-white/40 h-12 px-8 text-base font-medium rounded-full"
          >
            <a href="/locations">
              Explore Locations
            </a>
          </Button>
        </motion.div>

        {/* Trust badge */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8, delay: 1.4 } }
          }}
          className="mt-12"
        >
          <p className="text-white/60 text-sm tracking-wide">
            Serving devotees since 1908
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </div>
  );
}