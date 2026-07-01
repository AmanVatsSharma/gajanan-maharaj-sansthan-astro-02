/**
 * Footer component with quick links, locations, and contact info.
 */
import { MessageCircle, PhoneCall } from "lucide-react";
import { CONTACT_DETAILS, WHATSAPP_LINK } from "@/data/contact";

export function Footer() {
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
                href={`tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`}
                className="text-white/90 hover:text-white text-2xl md:text-3xl font-bold tracking-wide transition-colors duration-200 mt-1 inline-block"
                aria-label="Call booking helpline"
              >
                {CONTACT_DETAILS.booking.mobile}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent("🙏 Jai Gajanan Maharaj 🙏\n\nAccommodation booking enquiry")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold shadow-md transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                WhatsApp
              </a>
              <a
                href={`tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`}
                aria-label="Call now"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/40 shadow-md transition-all duration-200 hover:scale-105"
              >
                <PhoneCall className="h-5 w-5 shrink-0" />
                Call Now
              </a>
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
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">Popular Guides</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="/blog/shegaon-travel-guide" className="hover:text-brand-gold transition-colors">Shegaon Travel Guide</a></li>
              <li><a href="/trimbakeshwar-jyotirlinga" className="hover:text-brand-gold transition-colors">Trimbakeshwar Jyotirlinga Guide</a></li>
              <li><a href="/omkareshwar-jyotirlinga" className="hover:text-brand-gold transition-colors">Omkareshwar Jyotirlinga Guide</a></li>
              <li><a href="/blog/omkareshwar-darshan-timings" className="hover:text-brand-gold transition-colors">Omkareshwar Darshan Timings</a></li>
              <li><a href="/blog/shegaon-bhakta-niwas-booking-process" className="hover:text-brand-gold transition-colors">Bhakta Niwas Booking</a></li>
              <li><a href="/blog/phone-and-whatsapp-booking-best-practices" className="hover:text-brand-gold transition-colors">Phone & WhatsApp Booking</a></li>
              <li><a href="/blog/gajanan-maharaj-sansthan-booking-guide" className="hover:text-brand-gold transition-colors">Accommodation Booking</a></li>
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
              <span className="font-semibold">Contact:</span> {CONTACT_DETAILS.booking.mobile}
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-12 border-t border-white/10 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Shri Gajanan Maharaj Sansthan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
