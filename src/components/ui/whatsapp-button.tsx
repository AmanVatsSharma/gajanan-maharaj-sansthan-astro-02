/**
 * File: src/components/ui/whatsapp-button.tsx
 * Module: ui
 * Purpose: Dual floating contact widget — WhatsApp + Call — for instant outreach.
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_DETAILS, WHATSAPP_LINK } from "@/data/contact";
import { MessageCircle, PhoneCall, X, Headphones } from "lucide-react";
import { trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics/events";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const callHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Mobile: always show both pills — no tap needed to reveal */}
      <div className="sm:hidden flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("floating_widget")}
          aria-label="Chat on WhatsApp"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-semibold shadow-lg shadow-black/20 active:scale-95 transition-all duration-200"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          WhatsApp
        </a>
        <a
          href={callHref}
          onClick={() => trackPhoneClick(CONTACT_DETAILS.booking.mobile, "floating_widget")}
          aria-label="Call now"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#800000] hover:bg-[#6b0000] text-white text-sm font-semibold shadow-lg shadow-black/20 active:scale-95 transition-all duration-200"
        >
          <PhoneCall className="h-5 w-5 shrink-0" />
          Call Now
        </a>
      </div>

      {/* Desktop: saffron trigger that fans out WhatsApp + Call pills */}
      <div className="hidden sm:flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.a
                key="whatsapp"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("floating_widget")}
                aria-label="Chat on WhatsApp"
                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 420, damping: 26, delay: 0.06 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-semibold shadow-lg shadow-black/20 transition-colors duration-200"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                WhatsApp
              </motion.a>
              <motion.a
                key="call"
                href={callHref}
                onClick={() => trackPhoneClick(CONTACT_DETAILS.booking.mobile, "floating_widget")}
                aria-label="Call now"
                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#800000] hover:bg-[#6b0000] text-white text-sm font-semibold shadow-lg shadow-black/20 transition-colors duration-200"
              >
                <PhoneCall className="h-5 w-5 shrink-0" />
                Call Now
              </motion.a>
            </>
          )}
        </AnimatePresence>

        {/* Trigger */}
        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label={isOpen ? "Close contact options" : "Contact us"}
          className="h-14 w-14 rounded-full bg-brand-saffron text-white shadow-lg shadow-black/25 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.14 }}>
                <X className="h-6 w-6" />
              </motion.span>
            ) : (
              <motion.span key="h" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.14 }}>
                <Headphones className="h-6 w-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
