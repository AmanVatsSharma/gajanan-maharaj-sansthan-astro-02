/**
 * contactMode — the ONE site-wide switch controlling how every Call/WhatsApp
 * CTA behaves across all surfaces (Navbar, Footer, floating widget, booking
 * strip, room modal, location CTAs, CTA banner).
 *
 *   "both"          → normal: WhatsApp buttons open wa.me, Call buttons dial tel:.
 *   "call_only"     → hide every WhatsApp CTA; only Call buttons are shown.
 *   "whatsapp_only" → Call buttons open a booking-request dialog (or link to
 *                     /booking) instead of dialling; WhatsApp CTAs stay visible.
 *
 * Change this single value to flip the whole site. Consumers must NOT read
 * this field directly — use the derived flags below (`showWhatsAppButton`,
 * `callButtonIsDialog`).
 */
export type ContactMode = "both" | "call_only" | "whatsapp_only";

export const CONTACT_DETAILS = {
  headOffice: {
    address: "Shri Gajanan Maharaj Sansthan, Shegaon, Dist. Buldhana, Maharashtra - 444203",
    email: "shreegajananmaharajsansthan@gmail.com",
  },
  booking: {
    // Primary contact number for site-wide call/WhatsApp links.
    mobile: "+917970580390",
    whatsapp: "+917970580390",
    // Secondary number shown to a per-visitor fraction of traffic.
    secondary: "+917970580390",
    // Probability (0–1) that a given visitor sees the SECONDARY number.
    // 0.5 => 50% primary, 50% secondary.
    secondaryWeight: 0.5,
    contactMode: "both" as ContactMode,
  },
  social: {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
  }
};

export const WHATSAPP_LINK = `https://wa.me/${CONTACT_DETAILS.booking.whatsapp.replace(/[^0-9]/g, '')}`;

/** Whether WhatsApp CTAs should render at all. False only in "call_only". */
export const showWhatsAppButton = CONTACT_DETAILS.booking.contactMode !== "call_only";

/** Whether Call CTAs should open the booking dialog instead of dialling. True only in "whatsapp_only". */
export const callButtonIsDialog = CONTACT_DETAILS.booking.contactMode === "whatsapp_only";
