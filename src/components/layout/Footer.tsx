/**
 * Footer component with quick links, locations, and contact info.
 */
"use client";

import { useState } from "react";
import { MessageCircle, PhoneCall } from "lucide-react";

import { CONTACT_DETAILS, showWhatsAppButton, callButtonIsDialog } from "@/data/contact";
import { useContactNumber } from "@/lib/hooks/use-contact-number";
import { BookingDialog } from "@/features/booking/components/BookingDialog";

export function Footer() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { number: contactNumber, telHref: bookingCallHref, whatsappHref: whatsappBase } = useContactNumber();

  return (
    <footer className="relative bg-brand-maroon text-white">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-brand-gold via-brand-saffron to-brand-gold opacity-80" />

      {/* Contact strip — instant outreach */}
      <div className="bg-linear-to-r from-brand-saffron via-brand-gold to-brand-saffron mt-1.5">
        <div className="container py-7 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
            <div className="text-center md:text-left">
              <p className="text-white font-bold text-lg md:text-xl font-serif">Need Help? Reach us instantly</p>
              <a
                href={bookingCallHref}
                className="text-white/90 hover:text-white text-2xl md:text-3xl font-bold tracking-wide transition-colors duration-200 mt-1 inline-block"
                aria-label="Call booking helpline"
              >
                {contactNumber}
              </a>
            </div>
            <div className="flex items-center gap-3">
              {showWhatsAppButton && (
                <a
                  href={`${whatsappBase}?text=${encodeURIComponent("🙏 Jai Gajanan Maharaj 🙏\n\nAccommodation booking enquiry")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold shadow-md transition-all duration-200 hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  WhatsApp
                </a>
              )}
              {callButtonIsDialog ? (
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  aria-label="Send booking request"
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/40 shadow-md transition-all duration-200 hover:scale-105"
                >
                  <PhoneCall className="h-5 w-5 shrink-0" />
                  Send Booking Request
                </button>
              ) : (
                <a
                  href={bookingCallHref}
                  aria-label="Call now"
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/40 shadow-md transition-all duration-200 hover:scale-105"
                >
                  <PhoneCall className="h-5 w-5 shrink-0" />
                  Call Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 md:py-12 lg:py-16 pt-12 md:pt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-bold font-heading">Shri Gajanan Maharaj Sansthan</h3>
            <p className="text-sm text-gray-200 italic">
              &quot;Jai Gajanan Maharaj&quot;
            </p>
            <p className="text-sm text-gray-200 leading-relaxed">
              Official website for devotee services and accommodation booking.
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="/" className="hover:text-brand-gold transition-colors">Home</a></li>
              <li><a href="/locations" className="hover:text-brand-gold transition-colors">Accommodation</a></li>
              <li><a href="/booking" className="hover:text-brand-gold transition-colors">Booking</a></li>
              <li><a href="/about" className="hover:text-brand-gold transition-colors">History</a></li>
              <li><a href="/blog" className="hover:text-brand-gold transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-brand-gold transition-colors">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-brand-gold transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-conditions" className="hover:text-brand-gold transition-colors">Terms & Conditions</a></li>
              <li><a href="/refund-policy" className="hover:text-brand-gold transition-colors">Refund Policy</a></li>
              <li><a href="/disclaimer" className="hover:text-brand-gold transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">Omkareshwar Jyotirlinga</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="/omkareshwar-jyotirlinga" className="hover:text-brand-gold transition-colors">Omkareshwar Jyotirlinga Guide</a></li>
              <li><a href="/omkareshwar-darshan-timings" className="hover:text-brand-gold transition-colors">Darshan Timings</a></li>
              <li><a href="/omkareshwar-aarti-timings" className="hover:text-brand-gold transition-colors">Aarti Timings</a></li>
              <li><a href="/omkareshwar-bhakta-niwas" className="hover:text-brand-gold transition-colors">Bhakta Niwas & Rooms</a></li>
              <li><a href="/omkareshwar-best-time-to-visit" className="hover:text-brand-gold transition-colors">Best Time to Visit</a></li>
              <li><a href="/omkareshwar-places-to-visit" className="hover:text-brand-gold transition-colors">Places to Visit</a></li>
              <li><a href="/omkareshwar-temple-history" className="hover:text-brand-gold transition-colors">Temple History</a></li>
              <li><a href="/omkareshwar-from-mumbai" className="hover:text-brand-gold transition-colors">From Mumbai</a></li>
              <li><a href="/omkareshwar-from-pune" className="hover:text-brand-gold transition-colors">From Pune</a></li>
              <li><a href="/omkareshwar-from-indore" className="hover:text-brand-gold transition-colors">From Indore</a></li>
              <li><a href="/omkareshwar-from-bhopal" className="hover:text-brand-gold transition-colors">From Bhopal</a></li>
              <li><a href="/narmada-parikrama-omkareshwar" className="hover:text-brand-gold transition-colors">Narmada Parikrama</a></li>
              <li><a href="/omkareshwar-abhishekam-booking" className="hover:text-brand-gold transition-colors">Abhishekam Booking</a></li>
              <li><a href="/omkareshwar-mamleshwar-temple" className="hover:text-brand-gold transition-colors">Mamleshwar Temple</a></li>
              <li><a href="/omkareshwar-temple-rules" className="hover:text-brand-gold transition-colors">Temple Rules & Dress Code</a></li>
              <li><a href="/omkareshwar-prasadam" className="hover:text-brand-gold transition-colors">Prasadam & Offerings</a></li>
            </ul>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">Trimbakeshwar Jyotirlinga</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="/trimbakeshwar-jyotirlinga" className="hover:text-brand-gold transition-colors">Trimbakeshwar Jyotirlinga Guide</a></li>
              <li><a href="/trimbakeshwar-temple-history" className="hover:text-brand-gold transition-colors">Temple History</a></li>
              <li><a href="/trimbakeshwar-3-day-itinerary" className="hover:text-brand-gold transition-colors">3-Day Itinerary</a></li>
              <li><a href="/trimbakeshwar-bhakt-niwas" className="hover:text-brand-gold transition-colors">Bhakta Niwas & Rooms</a></li>
              <li><a href="/trimbakeshwar-best-time-to-visit" className="hover:text-brand-gold transition-colors">Best Time to Visit</a></li>
              <li><a href="/brahmagiri-trek-trimbakeshwar" className="hover:text-brand-gold transition-colors">Brahmagiri Trek Guide</a></li>
              <li><a href="/kushavarta-kund-trimbakeshwar" className="hover:text-brand-gold transition-colors">Kushavarta Kund</a></li>
              <li><a href="/trimbakeshwar-from-mumbai" className="hover:text-brand-gold transition-colors">From Mumbai</a></li>
              <li><a href="/trimbakeshwar-from-pune" className="hover:text-brand-gold transition-colors">From Pune</a></li>
              <li><a href="/trimbakeshwar-from-nashik" className="hover:text-brand-gold transition-colors">From Nashik</a></li>
              <li><a href="/mahashivratri-trimbakeshwar" className="hover:text-brand-gold transition-colors">Mahashivratri at Trimbakeshwar</a></li>
              <li><a href="/narayan-nagbali-trimbakeshwar" className="hover:text-brand-gold transition-colors">Narayan Nagbali Pooja</a></li>
              <li><a href="/rudra-homa-trimbakeshwar" className="hover:text-brand-gold transition-colors">Rudra Homa</a></li>
              <li><a href="/kumbh-mela-trimbakeshwar" className="hover:text-brand-gold transition-colors">Kumbh Mela Connection</a></li>
            </ul>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">Locations</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="/locations" className="hover:text-brand-gold transition-colors">Shri Gajanan Maharaj Sansthan Shegaon</a></li>
              <li><a href="/locations" className="hover:text-brand-gold transition-colors">Shegaon Anand Vihar</a></li>
              <li><a href="/locations" className="hover:text-brand-gold transition-colors">Pandharpur</a></li>
              <li><a href="/trimbakeshwar-jyotirlinga" className="hover:text-brand-gold transition-colors">Trimbakeshwar Jyotirlinga</a></li>
              <li><a href="/omkareshwar-jyotirlinga" className="hover:text-brand-gold transition-colors">Omkareshwar Jyotirlinga</a></li>
            </ul>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">Contact</h4>
            <div className="text-sm text-gray-200 leading-relaxed">
              {CONTACT_DETAILS.headOffice.address.split(",").map((line, i, arr) => (
                <span key={i} className="block">
                  {line.trim()}{i < arr.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-200">
              <span className="font-semibold">Email:</span>{" "}
              <a href={`mailto:${CONTACT_DETAILS.headOffice.email}`} className="hover:text-brand-gold transition-colors">
                {CONTACT_DETAILS.headOffice.email}
              </a>
            </p>
            <p className="text-sm text-gray-200">
              <span className="font-semibold">Contact:</span> {contactNumber}
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-12 border-t border-white/10 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Shri Gajanan Maharaj Sansthan. All rights reserved.</p>
        </div>
      </div>

      <BookingDialog open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </footer>
  );
}
