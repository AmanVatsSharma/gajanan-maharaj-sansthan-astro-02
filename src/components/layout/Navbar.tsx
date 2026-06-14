/**
 * Premium sticky navbar with mobile drawer navigation.
 */
"use client";

import { useEffect, useState } from "react";
import { Menu, MessageCircle, PhoneCall } from "lucide-react";

import { CONTACT_DETAILS, WHATSAPP_LINK } from "@/data/contact";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/booking", label: "Booking" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Sansthan" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ pathname }: { pathname: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // New hero: hide header initially, show on scroll
  const [showHeader, setShowHeader] = useState(false);

  const bookingCallHref = `tel:${CONTACT_DETAILS.booking.mobile.replace(/[^0-9+]/g, "")}`;

  const navWhatsAppMessage = [
    "🙏 Jai Gajanan Maharaj 🙏",
    "",
    "Temple accommodation booking enquiry",
    "",
    "Kindly guide me on availability and booking.",
  ].join("\n");
  const navWhatsAppHref = `${WHATSAPP_LINK}?text=${encodeURIComponent(navWhatsAppMessage)}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      // Show header after scrolling 50px
      setShowHeader(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        showHeader || isScrolled
          ? "border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-md py-2"
          : "bg-transparent border-transparent py-4 backdrop-blur-sm -translate-y-full opacity-0"
      )}
    >
      {/* Saffron brand stripe */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-saffron" />
      <div className="container flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 sm:gap-3">
          <img
            src="/logo/images-1-256.png"
            alt="Shri Gajanan Maharaj Sansthan Emblem"
            width={isScrolled ? 40 : 50}
            height={isScrolled ? 40 : 50}
            className="transition-all duration-300 rounded-full"
            fetchPriority="high"
          />
          <span
            className={cn(
              "font-bold tracking-tight text-brand-saffron font-serif transition-all duration-300 hidden sm:inline",
              isScrolled ? "text-xl" : "text-2xl"
            )}
          >
            Shri Gajanan Maharaj Sansthan
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-brand-saffron underline underline-offset-4 decoration-brand-saffron decoration-2"
                  : "text-foreground/80 hover:text-brand-saffron"
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Button
              asChild
              size="sm"
              className="h-10 lg:h-11 rounded-full px-4 lg:px-5 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm gap-1.5 text-sm font-semibold"
            >
              <a
                href={navWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp for temple accommodation booking"
                onClick={() => trackWhatsAppClick("navbar_desktop")}
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
            </Button>
            <Button asChild variant="premium" size="sm" className="h-10 lg:h-11 rounded-full px-4 lg:px-5 gap-1.5 text-sm font-semibold">
              <a
                href={bookingCallHref}
                aria-label={`Call booking helpline ${CONTACT_DETAILS.booking.mobile}`}
                onClick={() => trackPhoneClick(CONTACT_DETAILS.booking.mobile, "navbar_desktop")}
              >
                <PhoneCall className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">Call</span>
              </a>
            </Button>
            <span
              className="hidden xl:inline text-xs text-muted-foreground tabular-nums max-w-34 truncate"
              title={CONTACT_DETAILS.booking.mobile}
            >
              {CONTACT_DETAILS.booking.mobile}
            </span>
          </div>

          {/* Mobile always-visible quick contact icons */}
          <div className="md:hidden flex items-center gap-1.5">
            <a
              href={navWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              onClick={() => trackWhatsAppClick("navbar_mobile_icon")}
              className="h-9 w-9 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center shadow-sm transition-colors duration-200"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={bookingCallHref}
              aria-label="Call"
              onClick={() => trackPhoneClick(CONTACT_DETAILS.booking.mobile, "navbar_mobile_icon")}
              className="h-9 w-9 rounded-full bg-brand-maroon hover:bg-brand-maroon/80 text-white flex items-center justify-center shadow-sm transition-colors duration-200"
            >
              <PhoneCall className="h-4 w-4" />
            </a>
          </div>

          <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="left-auto right-0 top-0 translate-x-0 translate-y-0 h-dvh w-[88vw] max-w-sm gap-0 p-0 rounded-none sm:rounded-l-2xl border-l">
              <DialogHeader className="p-6 pb-4 border-b text-left">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="/logo/images-1-256.png"
                    alt="Shri Gajanan Maharaj Sansthan Emblem"
                    width={40}
                    height={40}
                    className="shrink-0 rounded-full"
                  />
                  <DialogTitle className="font-serif text-lg text-brand-maroon">
                    Shri Gajanan Maharaj Sansthan
                  </DialogTitle>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  &quot;Jai Gajanan Maharaj&quot;
                </p>
              </DialogHeader>

              <div className="p-6 space-y-6">
                <div className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-brand-saffron/10 text-brand-maroon"
                          : "hover:bg-muted/60 text-foreground/80"
                      )}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button asChild variant="premium" className="w-full h-12 rounded-full text-base">
                    <a
                      href={navWhatsAppHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackWhatsAppClick("navbar_drawer");
                        setIsMobileOpen(false);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Book via WhatsApp
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 rounded-full text-base border-brand-maroon/20"
                  >
                    <a
                      href={bookingCallHref}
                      onClick={() => {
                        trackPhoneClick(CONTACT_DETAILS.booking.mobile, "navbar_drawer");
                        setIsMobileOpen(false);
                      }}
                    >
                      <PhoneCall className="h-4 w-4" />
                      Call for Booking
                    </a>
                  </Button>

                  <div className="text-center text-xs text-muted-foreground">
                    Booking help: <span className="font-medium text-brand-maroon">{CONTACT_DETAILS.booking.mobile}</span>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
                  For faster assistance, please keep your <span className="font-medium">dates</span>,{" "}
                  <span className="font-medium">location</span>, and <span className="font-medium">guest count</span>{" "}
                  ready while calling or messaging.
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}
