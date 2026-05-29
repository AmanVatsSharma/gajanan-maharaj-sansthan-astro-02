"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
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
            Devotee Experiences
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-gold/40" />
            <div className="w-2 h-2 bg-brand-gold/50 rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-gold/40" />
          </div>
        </motion.div>

        {/* Simple testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.slice(0, 4).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-border/50"
            >
              {/* Quote mark */}
              <div className="text-brand-gold/30 font-serif text-4xl mb-2 leading-none">"</div>

              {/* Quote */}
              <p className="text-foreground/80 leading-relaxed mb-4 font-light">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-brand-gold/30 to-transparent" />
                <div className="text-right">
                  <p className="font-heading font-semibold text-brand-maroon text-sm">
                    — {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing chant */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="font-serif italic text-brand-maroon/70">
            ॥ Jai Gajanan Maharaj ॥
          </p>
        </motion.div>
      </div>
    </section>
  );
}