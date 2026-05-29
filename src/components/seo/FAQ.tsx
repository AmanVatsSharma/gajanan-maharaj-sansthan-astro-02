/**
 * File: src/components/seo/FAQ.tsx
 * Module: components/seo
 * Purpose: FAQ component with accordion UI and structured data
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 * Notes:
 * - Accordion-style UI for better UX
 * - Includes FAQ schema for rich snippets in SERP
 * - Helps answer common user questions and improve SEO
 */

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getFAQSchema } from "@/lib/seo/structured-data";
import { StructuredData } from "./StructuredData";
import type { FAQItem } from "@/data/faq";

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
}

/**
 * FAQ component with collapsible accordion and SEO schema
 */
export function FAQ({ faqs, title, description }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ schema for SEO
  const faqSchema = getFAQSchema(
    faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  return (
    <>
      <StructuredData data={faqSchema} />
      <div className="w-full max-w-4xl mx-auto">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-maroon mb-3">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="font-semibold text-foreground text-base md:text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-brand-saffron flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
