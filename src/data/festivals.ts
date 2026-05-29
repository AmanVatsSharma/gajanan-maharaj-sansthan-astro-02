/**
 * File: src/data/festivals.ts
 * Module: data
 * Purpose: Major Hindu festival and Sansthan utsav data for Event structured data schema.
 * Author: Aman Sharma / Novologic / Cursor AI
 * Last-updated: 2026-03-26
 * Notes:
 * - Used to generate Event JSON-LD schemas on the home page.
 * - Festival rich results appear prominently in Google SERP above organic listings.
 * - Drives 3–5x booking traffic spikes during pilgrimage seasons.
 * - Update dates annually for the new year.
 */

export interface FestivalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
  isAccessibleForFree: boolean;
}

/**
 * Major upcoming Hindu festivals and Sansthan utsavs — 2026.
 * Sorted chronologically. Past events are included for schema completeness
 * but upcoming events receive priority in Google rich results.
 */
export const sansthanFestivals: FestivalEvent[] = [
  {
    id: "gudi-padwa-2026",
    name: "Gudi Padwa — Shri Gajanan Maharaj Sansthan Shegaon",
    description:
      "Celebrate Gudi Padwa, the Maharashtrian New Year, with special prayers and darshan at Shri Gajanan Maharaj Temple, Shegaon. Devotees from across Maharashtra visit for blessings and darshan. Book Bhakta Niwas accommodation in advance.",
    startDate: "2026-03-30",
    endDate: "2026-03-30",
    locationName: "Shri Gajanan Maharaj Temple, Shegaon",
    locationAddress: "Shri Gajanan Maharaj Temple Complex, Shegaon, Dist. Buldhana, Maharashtra 444203",
    isAccessibleForFree: true,
  },
  {
    id: "ram-navami-2026",
    name: "Ram Navami — Shri Gajanan Maharaj Sansthan",
    description:
      "Ram Navami special darshan and prayer at Shri Gajanan Maharaj Sansthan. Join thousands of devotees for bhajans, prayers, and Mahaprasad at all Sansthan locations including Shegaon, Pandharpur, Trimbakeshwar, and Omkareshwar.",
    startDate: "2026-04-06",
    endDate: "2026-04-06",
    locationName: "Shri Gajanan Maharaj Sansthan, Shegaon",
    locationAddress: "Shri Gajanan Maharaj Temple Complex, Shegaon, Dist. Buldhana, Maharashtra 444203",
    isAccessibleForFree: true,
  },
  {
    id: "ashadhi-ekadashi-2026",
    name: "Ashadhi Ekadashi — Shri Gajanan Maharaj Sansthan Pandharpur",
    description:
      "Ashadhi Ekadashi (Deva Shayani Ekadashi) is the most sacred day for Vitthal devotees. Millions of warkaris travel to Pandharpur. Shri Gajanan Maharaj Sansthan Pandharpur provides accommodation and services for devotees. Book accommodation well in advance as rooms fill up months ahead.",
    startDate: "2026-07-06",
    endDate: "2026-07-07",
    locationName: "Shri Gajanan Maharaj Sansthan Pandharpur",
    locationAddress: "Near Sant Kaikadi Maharaj Math, Pandharpur, Solapur, Maharashtra",
    isAccessibleForFree: true,
  },
  {
    id: "ganesh-chaturthi-2026",
    name: "Ganesh Chaturthi — Shri Gajanan Maharaj Sansthan",
    description:
      "Ganesh Chaturthi celebrations at Shri Gajanan Maharaj Sansthan with special utsav prayers, bhajans, and Mahaprasad. Devotees from Vidarbha and across Maharashtra visit Shegaon during this festive period. Bhakta Niwas accommodation available — book early.",
    startDate: "2026-08-26",
    endDate: "2026-09-05",
    locationName: "Shri Gajanan Maharaj Temple, Shegaon",
    locationAddress: "Shri Gajanan Maharaj Temple Complex, Shegaon, Dist. Buldhana, Maharashtra 444203",
    isAccessibleForFree: true,
  },
  {
    id: "navratri-2026",
    name: "Navratri — Shri Gajanan Maharaj Sansthan",
    description:
      "Nine nights of devotional celebration during Navratri at Shri Gajanan Maharaj Sansthan. Special prayers, cultural programs, and darshan. Accommodation at Bhakta Niwas Shegaon available for devotee families.",
    startDate: "2026-10-03",
    endDate: "2026-10-12",
    locationName: "Shri Gajanan Maharaj Temple, Shegaon",
    locationAddress: "Shri Gajanan Maharaj Temple Complex, Shegaon, Dist. Buldhana, Maharashtra 444203",
    isAccessibleForFree: true,
  },
  {
    id: "kartik-ekadashi-2026",
    name: "Kartik Ekadashi (Dev Uthani Ekadashi) — Shri Gajanan Maharaj Sansthan Pandharpur",
    description:
      "Kartik Ekadashi marks the awakening of Lord Vishnu. Millions of warkaris converge on Pandharpur for darshan of Vitthal. Shri Gajanan Maharaj Sansthan Pandharpur provides accommodation for devotee families. Advance booking is mandatory during this peak season.",
    startDate: "2026-11-02",
    endDate: "2026-11-03",
    locationName: "Shri Gajanan Maharaj Sansthan Pandharpur",
    locationAddress: "Near Sant Kaikadi Maharaj Math, Pandharpur, Solapur, Maharashtra",
    isAccessibleForFree: true,
  },
  {
    id: "shivaratri-2027",
    name: "Maha Shivaratri — Shri Gajanan Maharaj Sansthan Trimbakeshwar & Omkareshwar",
    description:
      "Maha Shivaratri is the most sacred night for Lord Shiva devotees. Shri Gajanan Maharaj Sansthan provides accommodation at Trimbakeshwar Jyotirlinga and Omkareshwar Jyotirlinga for families visiting for overnight darshan. Book several months in advance.",
    startDate: "2027-02-15",
    endDate: "2027-02-16",
    locationName: "Shri Gajanan Maharaj Sansthan Trimbakeshwar & Omkareshwar",
    locationAddress: "Trimbakeshwar, Dist. Nashik, Maharashtra & Omkareshwar, Madhya Pradesh",
    isAccessibleForFree: true,
  },
  {
    id: "gajanan-vijay-utsav-2026",
    name: "Gajanan Vijay Utsav (Punyatithi) 2026 — Shri Gajanan Maharaj Sansthan Shegaon",
    description:
      "Gajanan Vijay Utsav marks the punyatithi (mahasamadhi) of Shri Gajanan Maharaj on Bhadrapad Shukla Chaturdashi. Lakhs of devotees from across India visit Shegaon for the grand utsav, special darshan, bhajans, and Mahaprasad. Bhakta Niwas accommodation must be booked several months in advance for this peak pilgrimage day.",
    startDate: "2026-09-08",
    endDate: "2026-09-08",
    locationName: "Shri Gajanan Maharaj Temple, Shegaon",
    locationAddress: "Shri Gajanan Maharaj Temple Complex, Shegaon, Dist. Buldhana, Maharashtra 444203",
    isAccessibleForFree: true,
  },
  {
    id: "diwali-2026",
    name: "Diwali — Shri Gajanan Maharaj Sansthan Shegaon",
    description:
      "Diwali celebrations at Shri Gajanan Maharaj Sansthan with special illumination of the temple complex, devotional prayers, and Mahaprasad. Devotees from across Maharashtra and Vidarbha visit Shegaon during Diwali. Book Bhakta Niwas accommodation early for the festive period.",
    startDate: "2026-10-20",
    endDate: "2026-10-24",
    locationName: "Shri Gajanan Maharaj Temple, Shegaon",
    locationAddress: "Shri Gajanan Maharaj Temple Complex, Shegaon, Dist. Buldhana, Maharashtra 444203",
    isAccessibleForFree: true,
  },
  {
    id: "makar-sankranti-2027",
    name: "Makar Sankranti — Shri Gajanan Maharaj Sansthan Shegaon",
    description:
      "Makar Sankranti special darshan and prayers at Shri Gajanan Maharaj Temple, Shegaon. Devotees visit on this auspicious day marking the sun's transition into Capricorn. Bhakta Niwas accommodation available for families — advance booking recommended.",
    startDate: "2027-01-14",
    endDate: "2027-01-14",
    locationName: "Shri Gajanan Maharaj Temple, Shegaon",
    locationAddress: "Shri Gajanan Maharaj Temple Complex, Shegaon, Dist. Buldhana, Maharashtra 444203",
    isAccessibleForFree: true,
  },
  {
    id: "holi-2027",
    name: "Holi — Shri Gajanan Maharaj Sansthan Shegaon",
    description:
      "Holi celebrations at Shri Gajanan Maharaj Sansthan with special prayers, bhajans, and Mahaprasad. Join thousands of devotees at Shegaon temple during the festival of colours. Book Bhakta Niwas accommodation in advance.",
    startDate: "2027-03-01",
    endDate: "2027-03-02",
    locationName: "Shri Gajanan Maharaj Temple, Shegaon",
    locationAddress: "Shri Gajanan Maharaj Temple Complex, Shegaon, Dist. Buldhana, Maharashtra 444203",
    isAccessibleForFree: true,
  },
];
