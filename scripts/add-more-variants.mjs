import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'scripts/generate-seo-blog-cluster.mjs');
let content = fs.readFileSync(file, 'utf-8');

const newLocationVariants = `  // Plan 5: 20 more for 155 Shegaon posts
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
];`;

const newGuideVariants = `  // Plan 5: 15 more for 93 total
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
];`;

const newSpiritualVariants = `  // Plan 5: 10 more for 42 total
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
];`;

const newEventVariants = `  // Plan 5: 10 more for 41 total
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
];`;

content = content.replace('];\n\nconst CROSS_LOCATION_GUIDE_VARIANTS', newLocationVariants + '\n\nconst CROSS_LOCATION_GUIDE_VARIANTS');
content = content.replace('];\n\nconst SPIRITUAL_POST_VARIANTS', newGuideVariants + '\n\nconst SPIRITUAL_POST_VARIANTS');
content = content.replace('];\n\nconst EVENT_POST_VARIANTS', newSpiritualVariants + '\n\nconst EVENT_POST_VARIANTS');
content = content.replace('];\n\nfunction formatDateByOffset', newEventVariants + '\n\nfunction formatDateByOffset');

fs.writeFileSync(file, content, 'utf-8');
console.log('Added new variants to generate-seo-blog-cluster.mjs');
