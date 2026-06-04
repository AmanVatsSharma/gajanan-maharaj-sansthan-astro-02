import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  CLUSTER_CONFIG_FINGERPRINT,
  EXPECTED_GENERATED_TOTAL,
  LOCATION_CLUSTER_TARGETS,
  NON_LOCATION_CLUSTER_TARGETS,
} from "./seo-cluster-config.mjs";
import {
  getVariantForIntent,
  getRandomElement,
  getFaqVariant,
  getLocationFact,
  FAQ_VARIANTS,
} from "./content-variants.mjs";

const BLOG_ROOT = path.resolve(
  process.env.SEO_BLOG_GENERATOR_ROOT || path.join(process.cwd(), "content/blog")
);
const GENERATOR_MANIFEST_PATH = path.join(
  BLOG_ROOT,
  "_ops/generated-seo-cluster-manifest.json"
);
const AUTHOR_NAME = "Sansthan";
const BASE_DATE = new Date("2026-02-15T00:00:00Z");

const CORE_RELATED_SLUGS = [
  "shegaon-travel-guide",
  "shegaon-accommodation-guide",
  "nearby-places-from-shegaon",
  "omkareshwar-darshan-timings",
  "welcome-to-sansthan",
  "bhakta-niwas-complete-booking-guide",
  "gajanan-maharaj-sansthan-complete-guide",
];

const CORE_RELATED_LINK_LABELS = {
  "shegaon-travel-guide": "Complete Travel Guide to Shegaon",
  "shegaon-accommodation-guide": "Shegaon Accommodation Guide",
  "nearby-places-from-shegaon": "Nearby Places from Shegaon",
  "omkareshwar-darshan-timings": "Omkareshwar Darshan Timings Guide",
  "welcome-to-sansthan": "Welcome to Sansthan",
  "pandharpur-and-shegaon-family-yatra-plan": "Pandharpur and Shegaon Family Yatra Plan",
  "jyotirlinga-and-sansthan-combined-itinerary": "Jyotirlinga and Sansthan Combined Itinerary",
  "trimbakeshwar-nashik-shegaon-route": "Trimbakeshwar Nashik Shegaon Route",
  "shegaon-bhakta-niwas-vs-anand-vihar": "Shegaon Bhakta Niwas vs Anand Vihar",
  "phone-and-whatsapp-booking-best-practices": "Phone and WhatsApp Booking Best Practices",
  "shegaon-bhakta-niwas-booking-process": "Shegaon Bhakta Niwas Booking Process",
  "sansthan-contact-numbers-all-locations": "Sansthan Contact Numbers All Locations",
  "bhakta-niwas-complete-booking-guide": "Bhakta Niwas Complete Booking Guide",
  "gajanan-maharaj-sansthan-complete-guide": "Official Sansthan Guide for Devotees",
};

/**
 * Cross-cluster pillar slugs for robust interlinking. Each location cluster links to 2-3 pillars from other clusters.
 */
const CROSS_CLUSTER_PILLAR_MAP = {
  shegaon: ["omkareshwar-darshan-timings", "pandharpur-and-shegaon-family-yatra-plan", "jyotirlinga-and-sansthan-combined-itinerary"],
  omkareshwar: ["shegaon-travel-guide", "jyotirlinga-and-sansthan-combined-itinerary", "shegaon-to-omkareshwar-route-guide"],
  pandharpur: ["shegaon-travel-guide", "pandharpur-and-shegaon-family-yatra-plan", "shegaon-accommodation-guide"],
  trimbakeshwar: ["trimbakeshwar-nashik-shegaon-route", "jyotirlinga-and-sansthan-combined-itinerary", "shegaon-travel-guide"],
};

/** Plan 3: Tertiary pillar slugs for guides/spiritual/events - location posts also link to these */
const TERTIARY_PILLAR_SLUGS = [
  "phone-and-whatsapp-booking-best-practices",
  "shegaon-bhakta-niwas-booking-process",
  "sansthan-contact-numbers-all-locations",
];

/** Plan 4: Pillar guide slugs for stronger topic authority */
const PILLAR_GUIDE_SLUGS = [
  "gajanan-maharaj-sansthan-complete-guide",
  "bhakta-niwas-complete-booking-guide",
  "how-to-book-bhakta-niwas-online",
  "all-sansthan-contact-numbers-complete-list",
];

const LOCATION_CONFIGS = [
  {
    key: "shegaon",
    city: "Shegaon",
    count: LOCATION_CLUSTER_TARGETS.shegaon,
    directory: "locations/shegaon",
    image: "/images/shegaon-temple.svg",
    locationPage: "/locations/shegaon-bhakt-niwas",
    locationIds: ["shegaon-bhakt-niwas", "shegaon-anand-vihar", "shegaon-visawa"],
    keywordSeed: [
      "shri gajanan maharaj sansthan shegaon",
      "shegaon temple accommodation",
      "bhakta niwas shegaon",
    ],
  },
  {
    key: "omkareshwar",
    city: "Omkareshwar",
    count: LOCATION_CLUSTER_TARGETS.omkareshwar,
    directory: "locations/omkareshwar",
    image: "/images/omkareshwar.svg",
    locationPage: "/locations/omkareshwar",
    locationIds: ["omkareshwar"],
    keywordSeed: [
      "shri gajanan maharaj sansthan omkareshwar",
      "omkareshwar temple accommodation",
    ],
  },
  {
    key: "pandharpur",
    city: "Pandharpur",
    count: LOCATION_CLUSTER_TARGETS.pandharpur,
    directory: "locations/pandharpur",
    image: "/images/pandharpur.svg",
    locationPage: "/locations/pandharpur-math",
    locationIds: ["pandharpur-math"],
    keywordSeed: [
      "shri gajanan maharaj sansthan pandharpur",
      "pandharpur temple stay",
    ],
  },
  {
    key: "trimbakeshwar",
    city: "Trimbakeshwar",
    count: LOCATION_CLUSTER_TARGETS.trimbakeshwar,
    directory: "locations/trimbakeshwar",
    image: "/images/trimbakeshwar.svg",
    locationPage: "/locations/trimbakeshwar",
    locationIds: ["trimbakeshwar"],
    keywordSeed: [
      "shri gajanan maharaj sansthan trimbakeshwar",
      "trimbakeshwar accommodation",
    ],
  },
];

const LOCATION_TOPIC_VARIANTS = [
  { suffix: "darshan-timing-guide", title: "Darshan Timing Guide", intent: "darshan" },
  { suffix: "weekend-planning-guide", title: "Weekend Planning Guide", intent: "travel-guide" },
  { suffix: "family-accommodation-checklist", title: "Family Accommodation Checklist", intent: "accommodation" },
  { suffix: "best-time-to-visit", title: "Best Time to Visit", intent: "travel-guide" },
  { suffix: "route-and-transport-options", title: "Route and Transport Options", intent: "transport" },
  { suffix: "one-day-itinerary", title: "One Day Itinerary", intent: "travel-guide" },
  { suffix: "two-day-itinerary", title: "Two Day Itinerary", intent: "travel-guide" },
  { suffix: "devotee-faqs", title: "Devotee FAQs", intent: "travel-guide" },
  { suffix: "first-time-visitor-guide", title: "First Time Visitor Guide", intent: "travel-guide" },
  { suffix: "senior-citizen-travel-tips", title: "Senior Citizen Travel Tips", intent: "travel-guide" },
  { suffix: "group-yatra-planning", title: "Group Yatra Planning", intent: "travel-guide" },
  { suffix: "accommodation-near-temple", title: "Accommodation Near Temple", intent: "accommodation" },
  { suffix: "morning-darshan-planning", title: "Morning Darshan Planning", intent: "darshan" },
  { suffix: "festival-season-guide", title: "Festival Season Guide", intent: "travel-guide" },
  { suffix: "budget-pilgrimage-guide", title: "Budget Pilgrimage Guide", intent: "travel-guide" },
  { suffix: "family-safety-and-comfort-tips", title: "Family Safety and Comfort Tips", intent: "travel-guide" },
  { suffix: "prayer-and-darshan-etiquette", title: "Prayer and Darshan Etiquette", intent: "darshan" },
  { suffix: "packing-checklist", title: "Packing Checklist", intent: "travel-guide" },
  { suffix: "rainy-season-visit-guide", title: "Rainy Season Visit Guide", intent: "travel-guide" },
  { suffix: "summer-visit-guide", title: "Summer Visit Guide", intent: "travel-guide" },
  { suffix: "winter-visit-guide", title: "Winter Visit Guide", intent: "travel-guide" },
  { suffix: "temple-area-food-and-facilities", title: "Temple Area Food and Facilities", intent: "accommodation" },
  { suffix: "local-travel-checklist", title: "Local Travel Checklist", intent: "transport" },
  { suffix: "darshan-queue-time-optimization", title: "Darshan Queue Time Optimization", intent: "darshan" },
  { suffix: "photo-and-memory-planning", title: "Photo and Memory Planning", intent: "travel-guide" },
  { suffix: "festival-crowd-management-guide", title: "Festival Crowd Management Guide", intent: "darshan" },
  { suffix: "evening-darshan-planning", title: "Evening Darshan Planning", intent: "darshan" },
  { suffix: "temple-circuit-extension-guide", title: "Temple Circuit Extension Guide", intent: "transport" },
  { suffix: "kids-friendly-yatra-guide", title: "Kids Friendly Yatra Guide", intent: "travel-guide" },
  { suffix: "contact-and-support-guide", title: "Contact and Support Guide", intent: "travel-guide" },
  // Bhakta Niwas and Sheogaon focus (Shegaon cluster)
  { suffix: "bhakta-niwas-accommodation-guide", title: "Bhakta Niwas Accommodation Guide", intent: "accommodation" },
  { suffix: "bhakta-niwas-booking-process", title: "Bhakta Niwas Booking Process", intent: "accommodation" },
  { suffix: "bhakta-niwas-vs-anand-vihar", title: "Bhakta Niwas vs Anand Vihar", intent: "accommodation" },
  { suffix: "bhakta-niwas-sheogaon-contact", title: "Bhakta Niwas Sheogaon Contact", intent: "accommodation" },
  { suffix: "bhakta-niwas-facilities-and-amenities", title: "Bhakta Niwas Facilities and Amenities", intent: "accommodation" },
  { suffix: "sheogaon-temple-darshan-guide", title: "Sheogaon Temple Darshan Guide", intent: "darshan" },
  { suffix: "sheogaon-accommodation-guide", title: "Sheogaon Accommodation Guide", intent: "accommodation" },
  { suffix: "sheogaon-travel-tips", title: "Sheogaon Travel Tips", intent: "travel-guide" },
  // Triambakeshwar variant and Omkareshwar Bhakt Niwas
  { suffix: "triambakeshwar-jyotirlinga-stay", title: "Triambakeshwar Jyotirlinga Stay", intent: "accommodation" },
  { suffix: "triambakeshwar-darshan-tips", title: "Triambakeshwar Darshan Tips", intent: "darshan" },
  { suffix: "omkareshwar-bhakt-niwas-guide", title: "Omkareshwar Bhakt Niwas Guide", intent: "accommodation" },
  { suffix: "omkareshwar-temple-stay-tips", title: "Omkareshwar Temple Stay Tips", intent: "accommodation" },
  { suffix: "jyotirlinga-yatra-planning", title: "Jyotirlinga Yatra Planning", intent: "transport" },
  { suffix: "nashik-trimbakeshwar-combo-guide", title: "Nashik Trimbakeshwar Combo Guide", intent: "transport" },
  { suffix: "pandharpur-wari-planning", title: "Pandharpur Wari Planning", intent: "travel-guide" },
  { suffix: "vitthal-darshan-timing-guide", title: "Vitthal Darshan Timing Guide", intent: "darshan" },
  { suffix: "math-stay-booking-tips", title: "Math Stay Booking Tips", intent: "accommodation" },
  { suffix: "seasonal-pilgrimage-calendar", title: "Seasonal Pilgrimage Calendar", intent: "travel-guide" },
  { suffix: "devotee-id-and-document-guide", title: "Devotee ID and Document Guide", intent: "accommodation" },
  { suffix: "temple-stay-rules-and-etiquette", title: "Temple Stay Rules and Etiquette", intent: "accommodation" },
  { suffix: "emergency-contact-and-support", title: "Emergency Contact and Support", intent: "travel-guide" },
  { suffix: "multi-generation-family-yatra", title: "Multi-Generation Family Yatra", intent: "travel-guide" },
  { suffix: "off-peak-visit-benefits", title: "Off-Peak Visit Benefits", intent: "travel-guide" },
  { suffix: "canteen-and-mahaprasad-guide", title: "Canteen and Mahaprasad Guide", intent: "accommodation" },
  { suffix: "parking-and-local-transport", title: "Parking and Local Transport", intent: "transport" },
  { suffix: "how-to-book-bhakta-niwas", title: "How to Book Bhakta Niwas", intent: "accommodation" },
  { suffix: "sheogaon-bhakta-niwas-facilities", title: "Sheogaon Bhakta Niwas Facilities", intent: "accommodation" },
  // Plan 2: Additional variants for 72+ location posts
  { suffix: "solo-traveler-guide", title: "Solo Traveler Guide", intent: "travel-guide" },
  { suffix: "wheelchair-accessibility", title: "Wheelchair Accessibility", intent: "accommodation" },
  { suffix: "medical-facilities-nearby", title: "Medical Facilities Nearby", intent: "travel-guide" },
  { suffix: "local-markets-and-shopping", title: "Local Markets and Shopping", intent: "travel-guide" },
  { suffix: "three-day-itinerary", title: "Three Day Itinerary", intent: "travel-guide" },
  { suffix: "week-long-stay-planning", title: "Week Long Stay Planning", intent: "accommodation" },
  { suffix: "early-morning-darshan-tips", title: "Early Morning Darshan Tips", intent: "darshan" },
  { suffix: "monsoon-visit-guide", title: "Monsoon Visit Guide", intent: "travel-guide" },
  { suffix: "holiday-rush-planning", title: "Holiday Rush Planning", intent: "travel-guide" },
  { suffix: "first-aid-and-safety", title: "First Aid and Safety", intent: "travel-guide" },
  { suffix: "photography-tips-for-devotees", title: "Photography Tips for Devotees", intent: "travel-guide" },
  { suffix: "prasad-and-offerings-guide", title: "Prasad and Offerings Guide", intent: "darshan" },
  { suffix: "nearby-attractions-day-trip", title: "Nearby Attractions Day Trip", intent: "transport" },
  { suffix: "evening-aarti-timing-guide", title: "Evening Aarti Timing Guide", intent: "darshan" },
  { suffix: "temple-complex-map-and-directions", title: "Temple Complex Map and Directions", intent: "transport" },
  // Plan 3: 28 more for 100 Shegaon posts
  { suffix: "buldhana-district-guide", title: "Buldhana District Guide", intent: "travel-guide" },
  { suffix: "akola-to-shegaon-route", title: "Akola to Shegaon Route", intent: "transport" },
  { suffix: "jalgaon-pilgrimage-route", title: "Jalgaon Pilgrimage Route", intent: "transport" },
  { suffix: "maharashtra-temple-circuit", title: "Maharashtra Temple Circuit", intent: "transport" },
  { suffix: "anand-sagar-visit-guide", title: "Anand Sagar Visit Guide", intent: "travel-guide" },
  { suffix: "visawa-accommodation-tips", title: "Visawa Accommodation Tips", intent: "accommodation" },
  { suffix: "vidarbha-pilgrimage-planning", title: "Vidarbha Pilgrimage Planning", intent: "travel-guide" },
  { suffix: "amravati-to-shegaon-route", title: "Amravati to Shegaon Route", intent: "transport" },
  { suffix: "four-day-itinerary", title: "Four Day Itinerary", intent: "travel-guide" },
  { suffix: "five-day-extended-stay", title: "Five Day Extended Stay", intent: "accommodation" },
  { suffix: "late-evening-darshan-tips", title: "Late Evening Darshan Tips", intent: "darshan" },
  { suffix: "spring-visit-guide", title: "Spring Visit Guide", intent: "travel-guide" },
  { suffix: "post-monsoon-visit-guide", title: "Post Monsoon Visit Guide", intent: "travel-guide" },
  { suffix: "new-year-darshan-planning", title: "New Year Darshan Planning", intent: "travel-guide" },
  { suffix: "travel-insurance-for-pilgrimage", title: "Travel Insurance for Pilgrimage", intent: "travel-guide" },
  { suffix: "mobile-photography-tips", title: "Mobile Photography Tips", intent: "travel-guide" },
  { suffix: "flower-offering-guide", title: "Flower Offering Guide", intent: "darshan" },
  { suffix: "weekend-getaway-from-mumbai", title: "Weekend Getaway from Mumbai", intent: "transport" },
  { suffix: "nagpur-to-shegaon-route", title: "Nagpur to Shegaon Route", intent: "transport" },
  { suffix: "pune-to-shegaon-route", title: "Pune to Shegaon Route", intent: "transport" },
  { suffix: "anand-vihar-vs-visawa", title: "Anand Vihar vs Visawa", intent: "accommodation" },
  { suffix: "buldhana-temple-stays", title: "Buldhana Temple Stays", intent: "accommodation" },
  { suffix: "local-bus-and-auto-guide", title: "Local Bus and Auto Guide", intent: "transport" },
  { suffix: "temple-museum-and-heritage", title: "Temple Museum and Heritage", intent: "travel-guide" },
  { suffix: "group-darshan-booking", title: "Group Darshan Booking", intent: "accommodation" },
  { suffix: "corporate-yatra-planning", title: "Corporate Yatra Planning", intent: "travel-guide" },
  { suffix: "lunar-eclipse-darshan-tips", title: "Lunar Eclipse Darshan Tips", intent: "darshan" },
  { suffix: "solar-eclipse-visit-guide", title: "Solar Eclipse Visit Guide", intent: "darshan" },
  // Plan 4: 35 more for 135 Shegaon posts
  { suffix: "bhakta-niwas-room-types-and-facilities", title: "Bhakta Niwas Room Types and Facilities", intent: "accommodation" },
  { suffix: "bhakta-niwas-check-in-check-out-timings", title: "Bhakta Niwas Check-in and Check-out Timings", intent: "accommodation" },
  { suffix: "bhakta-niwas-refund-and-cancellation-guide", title: "Bhakta Niwas Refund and Cancellation Guide", intent: "accommodation" },
  { suffix: "bhakta-niwas-online-booking-vs-whatsapp", title: "Bhakta Niwas Online Booking vs WhatsApp", intent: "accommodation" },
  { suffix: "bhakta-niwas-dormitory-vs-family-rooms", title: "Bhakta Niwas Dormitory vs Family Rooms", intent: "accommodation" },
  { suffix: "bhakta-niwas-whatsapp-message-template", title: "Bhakta Niwas WhatsApp Message Template", intent: "accommodation" },
  { suffix: "bhakta-niwas-rules-and-conduct", title: "Bhakta Niwas Rules and Conduct", intent: "accommodation" },
  { suffix: "bhakta-niwas-safety-and-security-guide", title: "Bhakta Niwas Safety and Security Guide", intent: "accommodation" },
  { suffix: "bhakta-niwas-amenities-hot-water-and-services", title: "Bhakta Niwas Amenities, Hot Water, and Services", intent: "accommodation" },
  { suffix: "bhakta-niwas-food-canteen-and-mahaprasad", title: "Bhakta Niwas Food, Canteen, and Mahaprasad", intent: "accommodation" },
  { suffix: "booking-follow-up-and-confirmation-tips", title: "Booking Follow-up and Confirmation Tips", intent: "accommodation" },
  { suffix: "festival-advance-booking-window", title: "Festival Advance Booking Window", intent: "travel-guide" },
  { suffix: "train-and-bus-arrival-planning", title: "Train and Bus Arrival Planning", intent: "transport" },
  { suffix: "night-stay-checklist-for-devotees", title: "Night Stay Checklist for Devotees", intent: "accommodation" },
  { suffix: "local-communication-and-helpline-tips", title: "Local Communication and Helpline Tips", intent: "travel-guide" },
  { suffix: "bhakta-niwas-payment-modes-and-receipts", title: "Bhakta Niwas Payment Modes and Receipts", intent: "accommodation" },
  { suffix: "bhakta-niwas-id-proof-requirements", title: "Bhakta Niwas ID Proof Requirements", intent: "accommodation" },
  { suffix: "bhakta-niwas-extension-and-extra-day-policy", title: "Bhakta Niwas Extension and Extra Day Policy", intent: "accommodation" },
  { suffix: "bhakta-niwas-late-check-in-guidance", title: "Bhakta Niwas Late Check-in Guidance", intent: "accommodation" },
  { suffix: "bhakta-niwas-checkout-process-guide", title: "Bhakta Niwas Checkout Process Guide", intent: "accommodation" },
  { suffix: "bhakta-niwas-baggage-and-locker-facilities", title: "Bhakta Niwas Baggage and Locker Facilities", intent: "accommodation" },
  { suffix: "bhakta-niwas-cleanliness-and-discipline", title: "Bhakta Niwas Cleanliness and Discipline", intent: "accommodation" },
  { suffix: "bhakta-niwas-senior-citizen-comfort-guide", title: "Bhakta Niwas Senior Citizen Comfort Guide", intent: "accommodation" },
  { suffix: "bhakta-niwas-family-stay-tips", title: "Bhakta Niwas Family Stay Tips", intent: "accommodation" },
  { suffix: "bhakta-niwas-accessibility-and-wheelchair-support", title: "Bhakta Niwas Accessibility and Wheelchair Support", intent: "accommodation" },
  { suffix: "bhakta-niwas-common-booking-mistakes", title: "Bhakta Niwas Common Booking Mistakes", intent: "accommodation" },
  { suffix: "bhakta-niwas-peak-season-strategy", title: "Bhakta Niwas Peak Season Strategy", intent: "accommodation" },
  { suffix: "bhakta-niwas-offline-helpdesk-guide", title: "Bhakta Niwas Offline Helpdesk Guide", intent: "accommodation" },
  { suffix: "bhakta-niwas-contact-and-escalation-matrix", title: "Bhakta Niwas Contact and Escalation Matrix", intent: "accommodation" },
  { suffix: "bhakta-niwas-parking-and-drop-off-guide", title: "Bhakta Niwas Parking and Drop-off Guide", intent: "transport" },
  { suffix: "nashik-to-shegaon-route", title: "Nashik to Shegaon Route", intent: "transport" },
  { suffix: "bhopal-to-shegaon-route", title: "Bhopal to Shegaon Route", intent: "transport" },
  { suffix: "indore-to-shegaon-route", title: "Indore to Shegaon Route", intent: "transport" },
  { suffix: "hyderabad-to-shegaon-route", title: "Hyderabad to Shegaon Route", intent: "transport" },
  { suffix: "delhi-to-shegaon-travel-plan", title: "Delhi to Shegaon Travel Plan", intent: "transport" },
  // Plan 5: 20 more for 155 Shegaon posts
  { suffix: "aurangabad-to-shegaon-route", title: "Aurangabad to Shegaon Route", intent: "transport" },
  { suffix: "jalna-to-shegaon-route", title: "Jalna to Shegaon Route", intent: "transport" },
  { suffix: "nanded-to-shegaon-travel-plan", title: "Nanded to Shegaon Travel Plan", intent: "transport" },
  { suffix: "devotee-dining-options-guide", title: "Devotee Dining Options Guide", intent: "accommodation" },
  { suffix: "budget-travel-planning-from-mumbai", title: "Budget Travel Planning from Mumbai", intent: "transport" },
  { suffix: "bhakta-niwas-wi-fi-and-connectivity", title: "Bhakta Niwas Wi-Fi and Connectivity", intent: "accommodation" },
  { suffix: "temple-donation-and-seva-process", title: "Temple Donation and Seva Process", intent: "travel-guide" },
  { suffix: "bhakta-niwas-hygiene-and-sanitation", title: "Bhakta Niwas Hygiene and Sanitation", intent: "accommodation" },
  { suffix: "visiting-with-toddlers-tips", title: "Visiting with Toddlers Tips", intent: "travel-guide" },
  { suffix: "local-handicrafts-and-souvenirs", title: "Local Handicrafts and Souvenirs", intent: "travel-guide" },
  { suffix: "bhakta-niwas-emergency-medical-assistance", title: "Bhakta Niwas Emergency Medical Assistance", intent: "accommodation" },
  { suffix: "temple-library-and-literature", title: "Temple Library and Literature", intent: "travel-guide" },
  { suffix: "bhakta-niwas-drinking-water-facilities", title: "Bhakta Niwas Drinking Water Facilities", intent: "accommodation" },
  { suffix: "shegaon-railway-station-guide", title: "Shegaon Railway Station Guide", intent: "transport" },
  { suffix: "bus-stand-to-temple-directions", title: "Bus Stand to Temple Directions", intent: "transport" },
  { suffix: "nearest-airport-to-shegaon", title: "Nearest Airport to Shegaon", intent: "transport" },
  { suffix: "bhakta-niwas-ventilation-and-ac-rooms", title: "Bhakta Niwas Ventilation and AC Rooms", intent: "accommodation" },
  { suffix: "trusted-local-guides-and-help", title: "Trusted Local Guides and Help", intent: "travel-guide" },
  { suffix: "bhakta-niwas-group-discounts", title: "Bhakta Niwas Group Discounts", intent: "accommodation" },
  { suffix: "post-darshan-relaxation-spots", title: "Post Darshan Relaxation Spots", intent: "travel-guide" },
];

const CROSS_LOCATION_GUIDE_VARIANTS = [
  "multi-location-pilgrimage-planning-guide",
  "shegaon-to-omkareshwar-route-guide",
  "shegaon-to-pandharpur-route-guide",
  "shegaon-to-trimbakeshwar-route-guide",
  "omkareshwar-to-trimbakeshwar-pilgrimage-checklist",
  "pandharpur-and-shegaon-family-yatra-plan",
  "jyotirlinga-and-sansthan-combined-itinerary",
  "temple-accommodation-comparison-guide",
  "week-long-devotional-circuit-planner",
  "pilgrimage-budget-planning-for-families",
  "festival-season-multi-city-travel-guide",
  "devotee-document-checklist-for-all-locations",
  "phone-and-whatsapp-booking-best-practices",
  "sansthan-location-selection-guide",
  "month-wise-pilgrimage-planning-calendar",
  "bhakta-niwas-across-locations-comparison",
  "sheogaon-and-omkareshwar-combined-yatra",
  "triambakeshwar-pandharpur-route-planning",
  "gajanan-maharaj-sansthan-booking-guide",
  "family-pilgrimage-with-children-tips",
  "senior-devotee-multi-city-itinerary",
  "best-accommodation-for-large-groups",
  "darshan-and-stay-priority-planning",
  "rainy-season-multi-location-travel",
  "festival-rush-booking-strategies",
  "shegaon-pandharpur-omkareshwar-circuit",
  "trimbakeshwar-nashik-shegaon-route",
  "devotee-testimonials-and-tips",
  "sansthan-contact-numbers-all-locations",
  "last-minute-booking-options-guide",
  "extended-stay-planning-for-devotees",
  // Plan 2: Additional guides for 46 total
  "shegaon-omkareshwar-3-day-itinerary",
  "pandharpur-wari-accommodation-tips",
  "trimbakeshwar-to-shegaon-route-guide",
  "omkareshwar-pandharpur-combined-yatra",
  "family-with-infants-pilgrimage-tips",
  "solo-female-devotee-safety-guide",
  "wheelchair-accessible-locations-guide",
  "monsoon-season-multi-city-travel",
  "festival-dates-and-booking-windows",
  "id-proof-and-document-checklist",
  "what-to-carry-pilgrimage-essentials",
  "return-journey-planning-tips",
  "group-booking-coordination-guide",
  "senior-citizen-special-needs-guide",
  "kids-activities-during-yatra",
  // Plan 3: 12 more for 58 total
  "maharashtra-pilgrimage-circuit",
  "buldhana-temple-stays",
  "akola-jalgaon-shegaon-route-guide",
  "vidarbha-temple-stay-network",
  "mumbai-to-shegaon-weekend-guide",
  "pune-shegaon-pandharpur-circuit",
  "hyderabad-to-omkareshwar-route",
  "indore-omkareshwar-shegaon-yatra",
  "all-12-jyotirlinga-planning",
  "mahaprasad-and-food-guide",
  "temple-volunteer-seva-guide",
  "pilgrimage-photo-documentation",
  // Plan 4: 20 more for 78 total
  "gajanan-maharaj-sansthan-complete-guide",
  "bhakta-niwas-complete-booking-guide",
  "bhakta-niwas-frequently-asked-questions",
  "bhakta-niwas-refund-and-cancellation-policy",
  "how-to-book-bhakta-niwas-online",
  "whatsapp-booking-step-by-step-guide",
  "phone-booking-process-detailed-guide",
  "last-minute-booking-success-tips",
  "group-booking-for-50-plus-devotees",
  "sheogaon-travel-guide",
  "sheogaon-accommodation-guide",
  "sheogaon-bhakta-niwas-booking",
  "sheogaon-darshan-timing-guide",
  "triambakeshwar-travel-guide",
  "triambakeshwar-accommodation-guide",
  "triambakeshwar-darshan-timing-guide",
  "triambakeshwar-best-time-to-visit",
  "all-sansthan-contact-numbers-complete-list",
  "how-to-reach-sansthan-office-shegaon",
  "emergency-contact-during-pilgrimage",
  // Plan 5: 15 more for 93 total
  "shegaon-and-ajanta-ellora-combined-trip",
  "vidarbha-spiritual-tourism-guide",
  "planning-a-one-week-maharashtra-yatra",
  "bhakta-niwas-booking-for-nris",
  "how-to-manage-luggage-during-yatra",
  "understanding-sansthan-accommodation-rules",
  "best-travel-apps-for-maharashtra-pilgrimage",
  "handling-medical-emergencies-on-yatra",
  "temple-trust-accommodation-benefits",
  "complete-transport-guide-for-devotees",
  "whatsapp-booking-troubleshooting",
  "how-to-verify-official-sansthan-contacts",
  "packing-light-for-weekend-darshan",
  "shegaon-to-ajmer-spiritual-route",
  "eco-friendly-pilgrimage-practices",
];

const SPIRITUAL_POST_VARIANTS = [
  "teachings-of-shri-gajanan-maharaj-for-modern-families",
  "daily-devotional-routine-for-pilgrimage-travelers",
  "importance-of-seva-in-sansthan-tradition",
  "how-devotees-can-prepare-mindfully-for-darshan",
  "spiritual-benefits-of-disciplined-yatra-planning",
  "gajanan-maharaj-mantra-and-prayer-guide",
  "significance-of-temple-stay-in-devotion",
  "mindful-pilgrimage-preparation-tips",
  "devotional-discipline-for-family-yatra",
  "spiritual-meaning-of-bhakta-niwas",
  "connecting-with-sansthan-tradition",
  // Plan 2: Additional spiritual for 19 total
  "bhakti-and-surrender-in-pilgrimage",
  "importance-of-sankalp-before-yatra",
  "meditation-and-darshan-preparation",
  "family-values-in-sansthan-tradition",
  "gratitude-practices-for-devotees",
  "overcoming-travel-anxiety-spiritually",
  "community-and-sangha-in-pilgrimage",
  "legacy-of-shri-gajanan-maharaj",
  // Plan 3: 5 more for 24 total
  "sankalp-and-vow-during-yatra",
  "prasad-distribution-etiquette",
  "morning-prayer-routine-for-travelers",
  "evening-aarti-participation-guide",
  "pilgrimage-as-spiritual-retreat",
  // Plan 4: 8 more for 32 total
  "bhakta-niwas-spiritual-significance",
  "spiritual-benefits-of-bhakta-niwas-stay",
  "seva-and-devotion-in-sansthan-tradition",
  "devotional-discipline-during-temple-stay",
  "pilgrimage-as-spiritual-transformation",
  "mindful-darshan-preparation-spiritual-guide",
  "gajanan-maharaj-teachings-for-daily-life",
  "gratitude-and-seva-during-yatra",
  // Plan 5: 10 more for 42 total
  "finding-peace-in-temple-queues",
  "spiritual-importance-of-anand-sagar",
  "gajanan-vijay-granth-reading-guide",
  "chanting-during-travel-and-waiting",
  "teaching-children-about-gajanan-maharaj",
  "the-power-of-mahaprasad-in-devotion",
  "maintaining-spiritual-focus-in-crowds",
  "daily-reflections-during-pilgrimage",
  "understanding-the-gajanan-maharaj-lineage",
  "silent-meditation-spots-in-shegaon",
];

const EVENT_POST_VARIANTS = [
  "ram-navami-devotee-planning-guide",
  "rishi-panchami-visit-preparation-guide",
  "major-utsav-crowd-planning-checklist",
  "festival-darshan-timing-awareness-guide",
  "community-seva-event-participation-guide",
  "gudi-padwa-sansthan-visit-guide",
  "diwali-darshan-planning-tips",
  "special-darshan-days-calendar",
  "utsav-accommodation-booking-tips",
  "festival-season-what-to-expect",
  "crowd-management-during-peak-days",
  // Plan 2: Additional events for 21 total
  "ram-navami-special-darshan-guide",
  "gudi-padwa-visit-planning",
  "diwali-darshan-and-accommodation",
  "makar-sankranti-pilgrimage-tips",
  "shivaratri-night-darshan-planning",
  "chaitra-navratri-crowd-guide",
  "guru-purnima-devotee-planning",
  "janmashtami-sansthan-visit",
  "anniversary-utsav-booking-tips",
  "special-darshan-dates-calendar",
  // Plan 3: 3 more for 24 total
  "maha-shivaratri-sansthan-visit",
  "guru-purnima-darshan-planning",
  "sankranti-pilgrimage-tips",
  // Plan 4: 7 more for 31 total
  "ashadhi-ekadashi-pandharpur-wari-guide",
  "kartik-ekadashi-pandharpur-darshan-guide",
  "ganesh-chaturthi-sansthan-visit-planning",
  "navratri-festival-season-booking-guide",
  "summer-holiday-rush-booking-guide",
  "monsoon-festival-calendar-pilgrimage-planning",
  "new-year-weekend-darshan-planning-guide",
  // Plan 5: 10 more for 41 total
  "gajanan-maharaj-pragat-din-utsav-guide",
  "punyatithi-utsav-darshan-planning",
  "managing-accommodation-during-pragat-din",
  "dussehra-celebrations-at-sansthan",
  "holi-festival-darshan-and-stay",
  "datta-jayanti-visit-planning",
  "vasant-panchami-temple-events",
  "hanuman-jayanti-crowd-management",
  "navratri-fasting-food-options-in-shegaon",
  "winter-festival-packing-for-devotees",
];

function formatDateByOffset(offset) {
  const value = new Date(BASE_DATE);
  value.setDate(value.getDate() - offset);
  return value.toISOString().slice(0, 10);
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function isSafeBlogChildPath(candidatePath) {
  const resolvedRoot = path.resolve(BLOG_ROOT);
  const resolvedPath = path.resolve(candidatePath);
  return resolvedPath === resolvedRoot || resolvedPath.startsWith(`${resolvedRoot}${path.sep}`);
}

/**
 * Read the previous generated-file manifest.
 * Keeps generator deterministic across count changes by cleaning stale files before writing.
 */
function readPreviousManifest() {
  if (!fs.existsSync(GENERATOR_MANIFEST_PATH)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(GENERATOR_MANIFEST_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.generatedFiles)) {
      return [];
    }

    return parsed.generatedFiles.filter((entry) => typeof entry === "string");
  } catch (error) {
    console.warn("seo-blog-generator-warning", {
      timestamp: Date.now(),
      message: "Unable to parse previous generator manifest. Continuing with empty cleanup set.",
      manifestPath: GENERATOR_MANIFEST_PATH,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

function cleanupPreviouslyGeneratedFiles(previousGeneratedFiles) {
  if (previousGeneratedFiles.length === 0) {
    console.info("seo-blog-generator-cleanup", {
      timestamp: Date.now(),
      removedFileCount: 0,
      message: "No prior generated files to clean.",
    });
    return;
  }

  let removedFileCount = 0;
  for (const relativePath of previousGeneratedFiles) {
    const absolutePath = path.join(BLOG_ROOT, relativePath);
    if (!isSafeBlogChildPath(absolutePath)) {
      console.warn("seo-blog-generator-warning", {
        timestamp: Date.now(),
        message: "Skipped cleanup for unsafe path from manifest.",
        relativePath,
      });
      continue;
    }

    if (fs.existsSync(absolutePath)) {
      fs.rmSync(absolutePath);
      removedFileCount += 1;
    }
  }

  console.info("seo-blog-generator-cleanup", {
    timestamp: Date.now(),
    removedFileCount,
    previousManifestCount: previousGeneratedFiles.length,
  });
}

function writeGenerationManifest(generatedFiles) {
  ensureDirectory(path.dirname(GENERATOR_MANIFEST_PATH));
  const normalizedGeneratedFiles = generatedFiles
    .map((entry) => entry.replace(/\\/g, "/"))
    .sort();
  const generatedFileChecksums = Object.fromEntries(
    normalizedGeneratedFiles.map((relativePath) => {
      const absolutePath = path.join(BLOG_ROOT, relativePath);
      const fileContent = fs.readFileSync(absolutePath, "utf-8");
      const checksum = crypto.createHash("sha256").update(fileContent).digest("hex");
      return [relativePath, checksum];
    })
  );

  const payload = {
    manifestVersion: 2,
    configFingerprint: CLUSTER_CONFIG_FINGERPRINT,
    generatedFileCount: normalizedGeneratedFiles.length,
    generatedFiles: normalizedGeneratedFiles,
    generatedFileChecksums,
  };
  fs.writeFileSync(GENERATOR_MANIFEST_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

/**
 * Fail fast if generator config drifts from available topic variants.
 */
function assertGeneratorConfiguration() {
  for (const locationConfig of LOCATION_CONFIGS) {
    if (locationConfig.count > LOCATION_TOPIC_VARIANTS.length) {
      throw new Error(
        `Location "${locationConfig.key}" count (${locationConfig.count}) exceeds topic variants (${LOCATION_TOPIC_VARIANTS.length}).`
      );
    }

    const expectedClusterCount = LOCATION_CLUSTER_TARGETS[locationConfig.key];
    if (locationConfig.count !== expectedClusterCount) {
      throw new Error(
        `Location "${locationConfig.key}" count (${locationConfig.count}) does not match shared cluster target (${expectedClusterCount}).`
      );
    }
  }

  if (CROSS_LOCATION_GUIDE_VARIANTS.length !== NON_LOCATION_CLUSTER_TARGETS.guides) {
    throw new Error(
      `Guide cluster size mismatch. Found ${CROSS_LOCATION_GUIDE_VARIANTS.length}, expected ${NON_LOCATION_CLUSTER_TARGETS.guides}.`
    );
  }

  if (SPIRITUAL_POST_VARIANTS.length !== NON_LOCATION_CLUSTER_TARGETS.spiritual) {
    throw new Error(
      `Spiritual cluster size mismatch. Found ${SPIRITUAL_POST_VARIANTS.length}, expected ${NON_LOCATION_CLUSTER_TARGETS.spiritual}.`
    );
  }

  if (EVENT_POST_VARIANTS.length !== NON_LOCATION_CLUSTER_TARGETS.events) {
    throw new Error(
      `Event cluster size mismatch. Found ${EVENT_POST_VARIANTS.length}, expected ${NON_LOCATION_CLUSTER_TARGETS.events}.`
    );
  }
}

function toTitleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() || ""}${part.slice(1)}`)
    .join(" ");
}

function toSentenceKeyword(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeSlugs(slugs) {
  return [...new Set(slugs.filter(Boolean))];
}

/**
 * Extended neighbors (index ± 1 and ± 2) for denser cluster graphs. Returns up to 4 slugs.
 */
function getExtendedNeighborSlugs(slugs, index) {
  if (slugs.length <= 1) {
    return [];
  }

  const indices = [
    (index - 2 + slugs.length) % slugs.length,
    (index - 1 + slugs.length) % slugs.length,
    (index + 1) % slugs.length,
    (index + 2) % slugs.length,
  ];
  const neighborSlugs = indices
    .filter((i) => i !== index)
    .map((i) => slugs[i])
    .filter(Boolean);
  return dedupeSlugs(neighborSlugs);
}

function getBlogLinkLabel(slug) {
  return CORE_RELATED_LINK_LABELS[slug] || toTitleCase(slug);
}

const LOCATION_LINK_LABELS = {
  "shegaon-bhakt-niwas": "Shegaon Bhakt Niwas",
  "omkareshwar-temple": "Omkareshwar Temple",
  "pandharpur-math": "Pandharpur Temple",
  "trimbakeshwar-temple": "Trimbakeshwar Temple",
};

function getLocationLinkLabel(locationId) {
  return LOCATION_LINK_LABELS[locationId] || toTitleCase(locationId);
}

function buildFrontmatter({
  title,
  description,
  date,
  slug,
  image,
  keywords,
  tags,
  category,
  locationIds,
  relatedSlugs,
}) {
  const lines = [
    "---",
    `title: "${title}"`,
    `description: "${description}"`,
    `date: "${date}"`,
    `slug: "${slug}"`,
    `image: "${image}"`,
    "keywords:",
    ...keywords.map((keyword) => `  - "${keyword}"`),
    `author: "${AUTHOR_NAME}"`,
    "tags:",
    ...tags.map((tag) => `  - "${tag}"`),
    `category: "${category}"`,
    "locationIds:",
    ...locationIds.map((locationId) => `  - "${locationId}"`),
    "relatedSlugs:",
    ...relatedSlugs.map((relatedSlug) => `  - "${relatedSlug}"`),
    "---",
    "",
  ];

  return lines.join("\n");
}

function buildLocationPostContent({
  city,
  slug,
  locationKey,
  locationPage,
  topicTitle,
  relatedBlogLinks,
  inlineLink1,
  inlineLink2,
  inlineLink3,
  intent,
  category = "locations",
  primaryTag = "shegaon",
}) {
  const inlineParts = [inlineLink1, inlineLink2, inlineLink3].filter(Boolean);
  const inlineParagraph =
    inlineParts.length > 0
      ? ` For related planning, see our ${inlineParts
          .map((l) => `[${l.label}](/blog/${l.slug})`)
          .join(", ")}.`
      : "";

  const checklist1 = getVariantForIntent(intent, 'checklist', `${slug}:1`);
  const checklist2 = getVariantForIntent(intent, 'checklist', `${slug}:2`);
  const checklist3 = getVariantForIntent(intent, 'checklist', `${slug}:3`);
  const tip1 = getVariantForIntent(intent, 'tips', `${slug}:1`);
  const tip2 = getVariantForIntent(intent, 'tips', `${slug}:2`);
  const tip3 = getVariantForIntent(intent, 'tips', `${slug}:3`);
  const tip4 = getVariantForIntent(intent, 'tips', `${slug}:4`);
  const tip5 = getVariantForIntent(intent, 'tips', `${slug}:5`);
  const factBlock = getLocationFact(locationKey, slug);
  const faqA = getFaqVariant(`${slug}:faq-a`) ?? FAQ_VARIANTS[0];
  const faqB = getFaqVariant(`${slug}:faq-b`) ?? FAQ_VARIANTS[1];
  const faqC = getFaqVariant(`${slug}:faq-c`) ?? FAQ_VARIANTS[2];
  const faqD = getFaqVariant(`${slug}:faq-d`) ?? FAQ_VARIANTS[3];
  const faqE = getFaqVariant(`${slug}:faq-e`) ?? FAQ_VARIANTS[4];

  return `# ${city} ${topicTitle}

${city} remains one of the most searched pilgrimage destinations by devotees looking for trusted temple guidance, darshan clarity, and Sansthan accommodation support. This guide on **${city} ${topicTitle.toLowerCase()}** is written for families who want a practical and peaceful yatra experience, and is reviewed against the latest on-ground conditions by the Sansthan office.${inlineParagraph}

## Why this ${city} guide matters for devotees

When devotees search for terms like “Shri Gajanan Maharaj Sansthan ${city}”, “Shree Gajanan Maharaj Sansthan ${city}”, or “${city} temple accommodation”, they usually need clear, reliable, and actionable guidance — not a third-party blog that recycles old information. This article consolidates travel intent, accommodation intent, and darshan intent in one place, and points you to the official Sansthan channels for final confirmation.

The Sansthan digital desk receives hundreds of queries every week for ${city} planning. The most common themes are: which dates have lighter darshan queues, which Bhakta Niwas rooms are most suitable for senior citizens, how to reach ${city} by train from Mumbai, Pune, Nagpur, and Hyderabad, and what the local code of conduct is during festival days. We have built the sections below to address each of those themes directly, and the article ends with a devotee takeaway and the most frequently asked questions on this specific ${city} route.

## Accommodation and booking support

- Explore official location details: [${city} Sansthan Accommodation](${locationPage})
- Start your request flow: [Accommodation Booking Request](/booking)
- Need direct office help? [Contact Sansthan Team](/contact)
- Read the [Bhakta Niwas Complete Booking Guide](/blog/bhakta-niwas-complete-booking-guide) for step-by-step support
- Learn [Phone and WhatsApp Booking Best Practices](/blog/phone-and-whatsapp-booking-best-practices) for fast confirmations

## About ${city} and what makes it distinctive

${factBlock}

## Darshan and visit planning checklist — Part 1

${checklist1.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## Darshan and visit planning checklist — Part 2

${checklist2.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## Darshan and visit planning checklist — Part 3

${checklist3.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## Location-specific tips for devotees — Arrival and movement

${tip1}

Families visiting ${city} often benefit from arriving early to avoid peak queues, especially on weekends and festival days. The temple complex and accommodation areas are well-maintained, with clear signage and helpful staff. Keep a copy of your booking confirmation handy, and carry light snacks and water for children.

## Location-specific tips for devotees — Daily routine and conduct

${tip2}

## Location-specific tips for devotees — Senior citizens and children

${tip3}

## Location-specific tips for devotees — On the day of darshan

${tip4}

## Location-specific tips for devotees — Returning home

${tip5}

Senior citizens should carry their primary medical documents and a small personal medicine kit. Children should carry an ID card or a note from a parent with contact numbers, in case the family gets separated in a crowd. The Sansthan office maintains a lost-and-found desk near the main entrance; ask any volunteer or Sansthan staff member to direct you there. On the day of darshan, plan to arrive at least 90 minutes before the published window to allow for queue, security, and prasad collection. As you return home, give yourself a quiet day to integrate the experience.

## Frequently asked questions

**${faqA.question}** ${faqA.answer}

**${faqB.question}** ${faqB.answer}

**${faqC.question}** ${faqC.answer}

**${faqD.question}** ${faqD.answer}

**${faqE.question}** ${faqE.answer}

## Related guides for deeper planning

${relatedBlogLinks
  .map((entry) => `- [${entry.label}](/blog/${entry.slug})`)
  .join("\n")}

## Practical conclusion for ${city} devotees

This ${city} planning resource is built to make your pilgrimage smoother, more spiritual, and better organized. For best outcomes, complete your route planning early, confirm accommodation through official support, and keep your itinerary realistic for all age groups. A yatra planned with a small margin of rest and a clear daily intention is a yatra in which the darshan, prasad, and satsang all land with greater impact.

If you are also planning a wider pilgrimage circuit that includes one or more of the Jyotirlinga sites, our cross-location guides below outline the route, the typical duration, and the points where most families add an extra day's buffer for elders.

---

Browse more in [${category.charAt(0).toUpperCase() + category.slice(1)}](/blog/category/${category}). Tags: [${primaryTag}](/blog/tag/${primaryTag})
`;
}

function buildCrossLocationGuideContent({ title, slug, relatedBlogLinks }) {
  const tip1 = getVariantForIntent('travel-guide', 'tips', `${slug}:1`);
  const tip2 = getVariantForIntent('travel-guide', 'tips', `${slug}:2`);
  const tip3 = getVariantForIntent('travel-guide', 'tips', `${slug}:3`);
  const tip4 = getVariantForIntent('travel-guide', 'tips', `${slug}:4`);
  const tip5 = getVariantForIntent('travel-guide', 'tips', `${slug}:5`);
  const tip6 = getVariantForIntent('travel-guide', 'tips', `${slug}:6`);
  const checklist1 = getVariantForIntent('travel-guide', 'checklist', `${slug}:1`);
  const checklist2 = getVariantForIntent('travel-guide', 'checklist', `${slug}:2`);
  const checklist3 = getVariantForIntent('travel-guide', 'checklist', `${slug}:3`);
  const faqA = getFaqVariant(`${slug}:faq-a`) ?? FAQ_VARIANTS[0];
  const faqB = getFaqVariant(`${slug}:faq-b`) ?? FAQ_VARIANTS[1];
  const faqC = getFaqVariant(`${slug}:faq-c`) ?? FAQ_VARIANTS[2];
  const faqD = getFaqVariant(`${slug}:faq-d`) ?? FAQ_VARIANTS[3];
  const faqE = getFaqVariant(`${slug}:faq-e`) ?? FAQ_VARIANTS[4];
  const faqF = getFaqVariant(`${slug}:faq-f`) ?? FAQ_VARIANTS[5];

  return `# ${title}

This guide helps devotees compare multiple locations connected to Shri Gajanan Maharaj Sansthan and related pilgrimage circuits. It is ideal for families planning a structured trip across Shegaon, Omkareshwar, Pandharpur, and Trimbakeshwar, and is built to give you a single source of truth for route, transport, accommodation, and darshan planning — backed by the Sansthan office for the most schedule-sensitive details.

A multi-location yatra is a meaningful undertaking, and the differences between these four primary sites are not always obvious to first-time visitors. Shegaon is a compact, walkable town with the Samadhi Mandir at its centre, Omkareshwar is on Mandhata island in the Narmada and is best reached via Indore, Pandharpur lies on the Bhima in Solapur district and is the focal point of the Ashadhi and Kartik wari processions, and Trimbakeshwar sits in the Sahyadri range near Nashik. Each has a distinct seasonal rhythm, transport reality, and code of conduct, and the sections below address each in turn.

## Core planning actions — Part 1

${checklist1.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## Core planning actions — Part 2

${checklist2.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## Core planning actions — Part 3

${checklist3.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## Cross-location travel tips — Routing and sequencing

${tip1}

When visiting multiple Sansthan locations, allow buffer time between cities for rest and local travel. Shegaon, Omkareshwar, Pandharpur, and Trimbakeshwar each have distinct peak hours and crowd patterns. Book accommodation for each stop in advance through official channels.

## Cross-location travel tips — Family logistics

${tip2}

## Cross-location travel tips — Budget and packing

${tip3}

## Cross-location travel tips — Spiritual alignment and discipline

${tip4}

## Cross-location travel tips — Senior citizen and child comfort

${tip5}

## Cross-location travel tips — Contingency and weather

${tip6}

## Official pages to use during planning

- [All Sansthan Locations](/locations)
- [Shegaon Bhakt Niwas](/locations/shegaon-bhakt-niwas)
- [Omkareshwar Accommodation](/locations/omkareshwar)
- [Pandharpur Temple](/locations/pandharpur-math)
- [Trimbakeshwar Temple](/locations/trimbakeshwar)
- [Booking Request Page](/booking)
- [Contact Sansthan Support](/contact)
- [Bhakta Niwas Complete Booking Guide](/blog/bhakta-niwas-complete-booking-guide)
- [Gajanan Maharaj Sansthan Complete Guide](/blog/gajanan-maharaj-sansthan-complete-guide)
- [Phone and WhatsApp Booking Best Practices](/blog/phone-and-whatsapp-booking-best-practices)

## Frequently asked questions

**${faqA.question}** ${faqA.answer}

**${faqB.question}** ${faqB.answer}

**${faqC.question}** ${faqC.answer}

**${faqD.question}** ${faqD.answer}

**${faqE.question}** ${faqE.answer}

**${faqF.question}** ${faqF.answer}

## Related reading

${relatedBlogLinks
  .map((entry) => `- [${entry.label}](/blog/${entry.slug})`)
  .join("\n")}

## Final note

For the best pilgrimage experience, keep your plan devotional but practical: focus on darshan flow, family comfort, and official communication clarity at every stage. The four primary Sansthan-supported locations — Shegaon, Omkareshwar, Pandharpur, and Trimbakeshwar — each reward the devotee who arrives prepared, calm, and open. Plan once, travel slow, and let the darshan do its work.

---

Browse more in [Guides](/blog/category/guides). Tags: [guides](/blog/tag/guides)
`;
}

function buildSpiritualOrEventContent({ title, slug, focusKeyword, category, relatedBlogLinks, locationId }) {
  const headingLabel =
    category === "events" ? "Festival and event planning insights" : "Spiritual preparation insights";

  const intent = category === "events" ? "darshan" : "travel-guide";
  const tip1 = getVariantForIntent(intent, 'tips', `${slug}:1`);
  const tip2 = getVariantForIntent(intent, 'tips', `${slug}:2`);
  const tip3 = getVariantForIntent(intent, 'tips', `${slug}:3`);
  const tip4 = getVariantForIntent(intent, 'tips', `${slug}:4`);
  const tip5 = getVariantForIntent(intent, 'tips', `${slug}:5`);
  const checklist1 = getVariantForIntent(intent, 'checklist', `${slug}:1`);
  const checklist2 = getVariantForIntent(intent, 'checklist', `${slug}:2`);
  const checklist3 = getVariantForIntent(intent, 'checklist', `${slug}:3`);
  const faqA = getFaqVariant(`${slug}:faq-a`) ?? FAQ_VARIANTS[0];
  const faqB = getFaqVariant(`${slug}:faq-b`) ?? FAQ_VARIANTS[1];
  const faqC = getFaqVariant(`${slug}:faq-c`) ?? FAQ_VARIANTS[2];
  const faqD = getFaqVariant(`${slug}:faq-d`) ?? FAQ_VARIANTS[3];
  const faqE = getFaqVariant(`${slug}:faq-e`) ?? FAQ_VARIANTS[4];

  const locationLink = locationId
    ? { slug: locationId, label: getLocationLinkLabel(locationId) }
    : { slug: "shegaon-bhakt-niwas", label: "Shegaon Bhakt Niwas" };
  const locationHref = `/locations/${locationLink.slug}`;

  return `# ${title}

${focusKeyword} is frequently searched by devotees who want both spiritual clarity and practical planning support. This article provides structured guidance aligned with Sansthan discipline and family-friendly travel needs, and is intended to complement — not replace — direct confirmation with the Sansthan office for the most schedule-sensitive details (token timings, accommodation availability, transport disruptions, and weather advisories).

The Sansthan office receives a steady stream of ${category === "events" ? "festival-week" : "yatra-prep"} questions every season, and the patterns are remarkably consistent. Most families want to know: how early to arrive, what to pack, how to coordinate with elders and children, what the local transport situation is, and how to remain spiritually focused despite the logistical pressure of a busy pilgrimage. The sections below address each of those patterns, and end with a devotee takeaway and five of the most frequently asked questions on this topic.

## ${headingLabel} — Part 1

${checklist1.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## ${headingLabel} — Part 2

${checklist2.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## ${headingLabel} — Part 3

${checklist3.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## Practical preparation — Daily routine

${tip1}

## Practical preparation — Family coordination

${tip2}

## Practical preparation — Spiritual focus

${tip3}

## Practical preparation — On the day

${tip4}

## Practical preparation — Returning home and integration

${tip5}

Devotees often find that a few days of light fasting or simplified meals before travel helps maintain energy and focus during the yatra. Pack modest, comfortable clothing suitable for temple visits and varying weather. Arrive at each location with an open heart and flexible schedule, allowing the divine to guide your pace. If travelling with elders, build an extra buffer day at the start of your itinerary so that jet lag, heat, or unexpected train delays do not push the darshan into a rushed window. On the day of the festival or darshan, arrive at least 90 minutes before the published window, and plan to remain for the full morning rather than the rushed one-hour slot that most first-time visitors default to.

## Helpful official links

- [${locationLink.label} location page](${locationHref})
- [All Sansthan Locations](/locations)
- [Accommodation Booking Request](/booking)
- [Contact Sansthan Office](/contact)
- [Bhakta Niwas Complete Booking Guide](/blog/bhakta-niwas-complete-booking-guide)
- [Gajanan Maharaj Sansthan Complete Guide](/blog/gajanan-maharaj-sansthan-complete-guide)

## Continue reading

${relatedBlogLinks
  .map((entry) => `- [${entry.label}](/blog/${entry.slug})`)
  .join("\n")}

## Frequently asked questions

**${faqA.question}** ${faqA.answer}

**${faqB.question}** ${faqB.answer}

**${faqC.question}** ${faqC.answer}

**${faqD.question}** ${faqD.answer}

**${faqE.question}** ${faqE.answer}

## Devotee takeaway

Use this guidance as a planning companion, and rely on official channels for final operational details, availability, and schedule-sensitive updates. The ${category === "events" ? "festival" : "spiritual practice"} you are preparing for is best received with a calm mind, a light schedule, and a clear sense of what the Sansthan office has already arranged for you on arrival. The rest — the darshan, the prasad, the satsang — will follow. As you return home, give yourself two or three days to integrate the experience — speak with family about the trip, write down the small moments that stood out, and plan the next visit while the inspiration is fresh.

---

Browse more in [${category.charAt(0).toUpperCase() + category.slice(1)}](/blog/category/${category}). Tags: [${category}](/blog/tag/${category})
`;
}

function writePostFile(relativePath, content) {
  const absolutePath = path.join(BLOG_ROOT, relativePath);
  ensureDirectory(path.dirname(absolutePath));
  fs.writeFileSync(absolutePath, content, "utf-8");
}

function generateLocationClusterPosts() {
  const generated = [];
  let globalOffset = 0;

  for (const config of LOCATION_CONFIGS) {
    const topicEntries = LOCATION_TOPIC_VARIANTS.slice(0, config.count).map((topic) => ({
      topic,
      slug: `${config.key}-${topic.suffix}`,
    }));
    const locationClusterSlugs = topicEntries.map((entry) => entry.slug);

    for (const [index, entry] of topicEntries.entries()) {
      const { topic, slug } = entry;
      const title = `${toTitleCase(config.key)} ${topic.title} | Shri Gajanan Maharaj Sansthan`;
      const description = `Detailed ${config.city.toLowerCase()} ${topic.title.toLowerCase()} for devotees searching Shri/Shree/Sri Gajanan Maharaj Sansthan ${config.city}. Includes booking links, travel tips, and internal route guidance.`;
      const date = formatDateByOffset(globalOffset);
      globalOffset += 1;

      const keywords = [
        `${config.city.toLowerCase()} ${toSentenceKeyword(topic.title)}`,
        `${config.city.toLowerCase()} pilgrimage`,
        `${config.city.toLowerCase()} sansthan`,
        ...config.keywordSeed,
      ].slice(0, 10);
      const tags = [
        config.key,
        topic.intent,
        "sansthan-seo",
        "pilgrimage-guide",
      ];

      const extendedNeighbors = getExtendedNeighborSlugs(locationClusterSlugs, index);
      const crossClusterPillars = CROSS_CLUSTER_PILLAR_MAP[config.key] || [];
      const tertiaryPillars = TERTIARY_PILLAR_SLUGS.slice(0, 2);
      const pillarSlugs = PILLAR_GUIDE_SLUGS.slice(0, 2);
      const relatedSlugs = dedupeSlugs([
        ...extendedNeighbors.slice(0, 4),
        ...pillarSlugs,
        ...CORE_RELATED_SLUGS.slice(0, 2),
        ...crossClusterPillars.slice(0, 3),
        ...tertiaryPillars,
      ]).slice(0, 10);
      const relatedBlogLinks = relatedSlugs.map((relatedSlug) => ({
        slug: relatedSlug,
        label: getBlogLinkLabel(relatedSlug),
      }));

      const inlineLink1 = crossClusterPillars[0]
        ? { slug: crossClusterPillars[0], label: getBlogLinkLabel(crossClusterPillars[0]) }
        : null;
      const inlineLink2 =
        locationClusterSlugs[index + 1] || locationClusterSlugs[index - 1]
          ? {
              slug: locationClusterSlugs[index + 1] || locationClusterSlugs[index - 1],
              label: getBlogLinkLabel(
                locationClusterSlugs[index + 1] || locationClusterSlugs[index - 1]
              ),
            }
          : null;
      const inlineLink3 = pillarSlugs[0]
        ? { slug: pillarSlugs[0], label: getBlogLinkLabel(pillarSlugs[0]) }
        : tertiaryPillars[0]
          ? { slug: tertiaryPillars[0], label: getBlogLinkLabel(tertiaryPillars[0]) }
        : null;

      const frontmatter = buildFrontmatter({
        title,
        description,
        date,
        slug,
        image: config.image,
        keywords,
        tags,
        category: "locations",
        locationIds: config.locationIds,
        relatedSlugs,
      });

      const content = buildLocationPostContent({
        city: config.city,
        slug,
        locationKey: config.key,
        locationPage: config.locationPage,
        topicTitle: topic.title,
        relatedBlogLinks,
        inlineLink1,
        inlineLink2,
        inlineLink3,
        intent: topic.intent,
        category: "locations",
        primaryTag: config.key,
      });

      const relativePath = `${config.directory}/${slug}.md`;
      writePostFile(relativePath, `${frontmatter}${content}`);
      generated.push(relativePath);
    }
  }

  return generated;
}

function generateCrossLocationGuides() {
  const generated = [];
  const guideSlugs = [...CROSS_LOCATION_GUIDE_VARIANTS];

  for (const [index, variant] of CROSS_LOCATION_GUIDE_VARIANTS.entries()) {
    const slug = variant;
    const title = `${toTitleCase(variant)} | Shri Gajanan Maharaj Sansthan`;
    const description =
      "Cross-location pilgrimage planning guide for devotees searching Shegaon, Omkareshwar, Pandharpur, and Trimbakeshwar accommodation and route support.";
    const date = formatDateByOffset(120 + index);
    const extendedNeighbors = getExtendedNeighborSlugs(guideSlugs, index);
    const crossPillars = ["shegaon-travel-guide", "omkareshwar-darshan-timings"];
    const tertiaryPillars = TERTIARY_PILLAR_SLUGS.slice(0, 2);
    const pillarSlugs = PILLAR_GUIDE_SLUGS.slice(0, 2);
    const relatedSlugs = dedupeSlugs([
      ...extendedNeighbors.slice(0, 4),
      ...pillarSlugs,
      ...CORE_RELATED_SLUGS.slice(0, 2),
      ...crossPillars,
      ...tertiaryPillars,
    ]).slice(0, 10);
    const relatedBlogLinks = relatedSlugs.map((relatedSlug) => ({
      slug: relatedSlug,
      label: getBlogLinkLabel(relatedSlug),
    }));

    const frontmatter = buildFrontmatter({
      title,
      description,
      date,
      slug,
      image: "/images/shegaon-temple.svg",
      keywords: [
        `${toSentenceKeyword(variant).replace(/-/g, " ")} pilgrimage guide`,
        "shree gajanan maharaj sansthan pilgrimage",
        "shri gajanan maharaj sanstan pilgrimage",
        "sri gajanan maharaj sansthan route planning",
        "multi location temple accommodation guide",
      ],
      tags: ["guides", "multi-location", "travel-planning", "sansthan-seo"],
      category: "guides",
      locationIds: ["shegaon-bhakt-niwas", "omkareshwar", "pandharpur-math", "trimbakeshwar"],
      relatedSlugs,
    });

    const content = buildCrossLocationGuideContent({ title, slug, relatedBlogLinks });
    const relativePath = `guides/${slug}.md`;
    writePostFile(relativePath, `${frontmatter}${content}`);
    generated.push(relativePath);
  }

  return generated;
}

function generateSpiritualPosts() {
  const generated = [];
  const spiritualSlugs = [...SPIRITUAL_POST_VARIANTS];

  for (const [index, variant] of SPIRITUAL_POST_VARIANTS.entries()) {
    const slug = variant;
    const title = `${toTitleCase(variant)} | Spiritual Guidance`;
    const description =
      "Spiritual and practical devotional guidance for Sansthan devotees planning darshan and accommodation with discipline.";
    const date = formatDateByOffset(160 + index);
    const extendedNeighbors = getExtendedNeighborSlugs(spiritualSlugs, index);
    const crossPillars = ["shegaon-travel-guide", "shegaon-accommodation-guide"];
    const tertiaryPillars = TERTIARY_PILLAR_SLUGS.slice(0, 2);
    const pillarSlugs = PILLAR_GUIDE_SLUGS.slice(0, 2);
    const relatedSlugs = dedupeSlugs([
      ...extendedNeighbors.slice(0, 4),
      ...pillarSlugs,
      ...CORE_RELATED_SLUGS.slice(0, 2),
      ...crossPillars,
      ...tertiaryPillars,
    ]).slice(0, 10);
    const relatedBlogLinks = relatedSlugs.map((relatedSlug) => ({
      slug: relatedSlug,
      label: getBlogLinkLabel(relatedSlug),
    }));

    const frontmatter = buildFrontmatter({
      title,
      description,
      date,
      slug,
      image: "/images/shegaon-temple.svg",
      keywords: [
        `${toSentenceKeyword(variant).replace(/-/g, " ")}`,
        "shree gajanan maharaj spiritual guidance",
        "shri gajanan maharaj sanstan spiritual guidance",
        "sri gajanan maharaj devotee planning",
        "sansthan devotional discipline",
      ],
      tags: ["spiritual", "teachings", "devotion", "sansthan-seo"],
      category: "spiritual",
      locationIds: ["shegaon-bhakt-niwas"],
      relatedSlugs,
    });

    const content = buildSpiritualOrEventContent({
      title,
      slug,
      focusKeyword: "Shri Gajanan Maharaj spiritual planning",
      category: "spiritual",
      relatedBlogLinks,
      locationId: "shegaon-bhakt-niwas",
    });

    const relativePath = `spiritual/${slug}.md`;
    writePostFile(relativePath, `${frontmatter}${content}`);
    generated.push(relativePath);
  }

  return generated;
}

function generateEventPosts() {
  const generated = [];
  const eventSlugs = [...EVENT_POST_VARIANTS];

  for (const [index, variant] of EVENT_POST_VARIANTS.entries()) {
    const slug = variant;
    const title = `${toTitleCase(variant)} | Devotee Event Guide`;
    const description =
      "Festival/event support guide for devotees searching Sansthan darshan timing and accommodation planning during high-rush periods.";
    const date = formatDateByOffset(180 + index);
    const extendedNeighbors = getExtendedNeighborSlugs(eventSlugs, index);
    const crossPillars = ["shegaon-travel-guide", "major-utsav-crowd-planning-checklist"];
    const tertiaryPillars = TERTIARY_PILLAR_SLUGS.slice(0, 2);
    const pillarSlugs = PILLAR_GUIDE_SLUGS.slice(0, 2);
    const relatedSlugs = dedupeSlugs([
      ...extendedNeighbors.slice(0, 4),
      ...pillarSlugs,
      ...CORE_RELATED_SLUGS.slice(0, 2),
      ...crossPillars,
      ...tertiaryPillars,
    ]).slice(0, 10);
    const relatedBlogLinks = relatedSlugs.map((relatedSlug) => ({
      slug: relatedSlug,
      label: getBlogLinkLabel(relatedSlug),
    }));

    const frontmatter = buildFrontmatter({
      title,
      description,
      date,
      slug,
      image: "/images/shegaon-temple.svg",
      keywords: [
        `${toSentenceKeyword(variant).replace(/-/g, " ")}`,
        "shree gajanan maharaj sansthan event planning",
        "shri gajanan maharaj sanstan event planning",
        "sri gajanan maharaj darshan festival season",
        "festival accommodation planning shegaon",
      ],
      tags: ["events", "festival", "darshan", "sansthan-seo"],
      category: "events",
      locationIds: ["shegaon-bhakt-niwas"],
      relatedSlugs,
    });

    const content = buildSpiritualOrEventContent({
      title,
      slug,
      focusKeyword: "Sansthan festival darshan planning",
      category: "events",
      relatedBlogLinks,
      locationId: "shegaon-bhakt-niwas",
    });

    const relativePath = `events/${slug}.md`;
    writePostFile(relativePath, `${frontmatter}${content}`);
    generated.push(relativePath);
  }

  return generated;
}

function main() {
  ensureDirectory(BLOG_ROOT);
  assertGeneratorConfiguration();
  console.info("seo-blog-generator-start", {
    timestamp: Date.now(),
    blogRoot: BLOG_ROOT,
    configFingerprint: CLUSTER_CONFIG_FINGERPRINT,
  });

  const previousGeneratedFiles = readPreviousManifest();
  cleanupPreviouslyGeneratedFiles(previousGeneratedFiles);

  const generatedLocationPosts = generateLocationClusterPosts();
  const generatedGuidePosts = generateCrossLocationGuides();
  const generatedSpiritualPosts = generateSpiritualPosts();
  const generatedEventPosts = generateEventPosts();

  const generatedTotal =
    generatedLocationPosts.length +
    generatedGuidePosts.length +
    generatedSpiritualPosts.length +
    generatedEventPosts.length;
  const generatedFiles = [
    ...generatedLocationPosts,
    ...generatedGuidePosts,
    ...generatedSpiritualPosts,
    ...generatedEventPosts,
  ];

  if (generatedTotal !== EXPECTED_GENERATED_TOTAL) {
    throw new Error(
      `Generated post total mismatch. Found ${generatedTotal}, expected ${EXPECTED_GENERATED_TOTAL}.`
    );
  }

  writeGenerationManifest(generatedFiles);

  console.info("seo-blog-generator-complete", {
    timestamp: Date.now(),
    configFingerprint: CLUSTER_CONFIG_FINGERPRINT,
    generatedTotal,
    locationPosts: generatedLocationPosts.length,
    guidePosts: generatedGuidePosts.length,
    spiritualPosts: generatedSpiritualPosts.length,
    eventPosts: generatedEventPosts.length,
  });
}

try {
  if (process.argv.includes("--regen-spiritual-events")) {
    ensureDirectory(BLOG_ROOT);
    assertGeneratorConfiguration();
    const spiritual = generateSpiritualPosts();
    const events = generateEventPosts();
    const all = [...spiritual, ...events];
    writeGenerationManifest(all);
    console.info("seo-blog-regen-spiritual-events", {
      timestamp: Date.now(),
      spiritual: spiritual.length,
      events: events.length,
    });
  } else {
    main();
  }
} catch (error) {
  console.error("seo-blog-generator-error", {
    timestamp: Date.now(),
    message: "Failed to generate deterministic SEO blog cluster.",
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
