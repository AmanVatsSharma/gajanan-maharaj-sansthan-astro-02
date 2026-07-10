/**
 * File: src/data/faq.ts
 * Module: data
 * Purpose: FAQ content for booking and temple visit questions
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-05-15
 * Notes:
 * - Booking-focused questions for better SEO
 * - Used with FAQ schema markup
 * - Addresses common devotee queries
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "booking" | "facilities" | "rules" | "visit";
}

export const bookingFAQs: FAQItem[] = [
  {
    id: "how-to-book",
    question: "How do I book accommodation at Shri Gajanan Maharaj Sansthan?",
    answer:
      "To book accommodation, fill out the booking request form on our website. After submission, you can send the request via WhatsApp to our booking helpline or call directly. Final confirmation is provided by the Sansthan office based on availability and booking rules.",
    category: "booking",
  },
  {
    id: "booking-advance",
    question: "How far in advance can I book accommodation?",
    answer:
      "Accommodation booking is typically accepted up to 30 days in advance. However, during special occasions and festivals, advance booking periods may vary. We recommend contacting the office directly for major festivals.",
    category: "booking",
  },
  {
    id: "family-only",
    question: "Can unmarried couples or groups of friends book rooms?",
    answer:
      "No, accommodation is strictly for families only. Rooms are allocated only to married couples with valid proof of marriage. Unmarried couples and groups of friends may be directed to dormitory facilities. Valid government ID is mandatory for all guests.",
    category: "rules",
  },
  {
    id: "minimum-occupancy",
    question: "What is the minimum number of people required to book a room?",
    answer:
      "A minimum of 3 family members is usually required to book a private room. This ensures optimal utilization of our limited accommodation resources for families visiting for darshan.",
    category: "booking",
  },
  {
    id: "accommodation-cost",
    question: "What is the cost of accommodation?",
    answer:
      "Accommodation at Shri Gajanan Maharaj Sansthan is provided on a donation basis. There is no fixed charge, and devotees can contribute as per their capacity. The Sansthan operates on the principle of serving all devotees equally.",
    category: "facilities",
  },
  {
    id: "check-in-duration",
    question: "How long can I stay at the Bhakta Niwas?",
    answer:
      "Accommodation is typically allotted for 24 hours from the time of check-in. Extensions may be considered based on availability, but you should inform the office staff if you need to stay longer.",
    category: "rules",
  },
  {
    id: "facilities-available",
    question: "What facilities are provided in the accommodation?",
    answer:
      "Facilities vary by location but generally include: hot water (morning hours), Mahaprasad canteen, free bus service to temple, parking, and basic room amenities. Some locations offer AC rooms, dormitories, and deluxe options. Check individual location pages for specific details.",
    category: "facilities",
  },
  {
    id: "id-proof-required",
    question: "What documents do I need to bring for check-in?",
    answer:
      "Valid government-issued ID proof is mandatory for all guests. This includes Aadhar Card, Voter ID, Passport, or Driving License. Married couples may be asked to provide proof of marriage (marriage certificate or relevant documents).",
    category: "rules",
  },
  {
    id: "multiple-locations",
    question: "Can I book accommodation at multiple locations?",
    answer:
      "Yes, Shri Gajanan Maharaj Sansthan manages accommodation at multiple holy places including Shri Gajanan Maharaj Sansthan Shegaon, Shri Gajanan Maharaj Sansthan Pandharpur, Shri Gajanan Maharaj Sansthan Trimbakeshwar, and Shri Gajanan Maharaj Sansthan Omkareshwar. You can book at any location based on your pilgrimage plans, subject to availability.",
    category: "booking",
  },
  {
    id: "cancellation-policy",
    question: "What is the cancellation policy?",
    answer:
      "If you need to cancel your booking, please inform the Sansthan office as soon as possible via phone or WhatsApp. This helps us allocate the accommodation to other devotees waiting for rooms. There are no cancellation charges.",
    category: "booking",
  },
  {
    id: "food-available",
    question: "Is food available at the accommodation?",
    answer:
      "Yes, most locations have Mahaprasad canteen or Bhojan Kaksha where simple, satvik meals are provided to devotees. The timing and availability may vary by location. Some locations also offer prasad distribution.",
    category: "facilities",
  },
  {
    id: "temple-timings",
    question: "What are the temple darshan timings?",
    answer:
      "The main temple in Shegaon is open for darshan throughout the day from early morning till late evening. Specific timings may vary for aarti and special ceremonies. Free bus service is often provided from accommodation to the main temple.",
    category: "visit",
  },
  // --- Room type & pricing FAQs ---
  {
    id: "room-types-available",
    question: "What room types are available at Bhakta Niwas Shegaon?",
    answer:
      "Bhakta Niwas Shegaon offers multiple room types: 2-Bed AC (₹1,650), 2-Bed Non-AC (₹1,250), 3-Bed AC (₹2,050), 3-Bed Non-AC (₹1,750), 4-Bed AC (₹2,550), 4-Bed Non-AC (₹2,250), Deluxe Suite (₹3,150), Luxury Suite (₹4,150), and Family Room (₹3,850). All prices are suggested donations and include room accommodation, all meals (breakfast, lunch, dinner), hot water, and applicable taxes. There are no hidden charges.",
    category: "facilities",
  },
  {
    id: "room-price-bhakt-niwas",
    question: "What is the room price at Bhakt Niwas Shegaon?",
    answer:
      "Room prices (suggested donation) at Bhakta Niwas Shegaon start from ₹1,250 for a 2-bed non-AC room and go up to ₹4,150 for a Luxury Suite. AC rooms are available from ₹1,650 (2-bed) to ₹2,550 (4-bed). Deluxe Suites are ₹3,150 and Family Rooms are ₹3,850. All room rates include meals and hot water. Accommodation is provided on a donation basis — there is no mandatory charge.",
    category: "facilities",
  },
  {
    id: "ac-room-available",
    question: "Are AC rooms available at Bhakta Niwas Shegaon?",
    answer:
      "Yes, air-conditioned (AC) rooms are available at Bhakta Niwas Shegaon. AC room options include: 2-Bed AC (suggested donation ₹1,650), 3-Bed AC (₹2,050), 4-Bed AC (₹2,550), Deluxe Suite (₹3,150), Luxury Suite (₹4,150), and Family Room (₹3,850). AC rooms are also available at Shegaon Anand Vihar. Book in advance as AC rooms fill up quickly during peak seasons.",
    category: "facilities",
  },
  {
    id: "deluxe-suite-booking",
    question: "How can I book a Deluxe or Luxury Suite at Bhakta Niwas Shegaon?",
    answer:
"Deluxe Suites (₹3,150) and Luxury Suites (₹4,150) at Bhakta Niwas Shegaon can be booked by contacting the Sansthan office via WhatsApp or phone at +918053190691. Use the booking form on our website to send your request, specifying the Deluxe or Luxury Suite preference, check-in date, and guest count. These rooms are limited and should be booked well in advance.",
    category: "booking",
  },
  {
    id: "meals-included",
    question: "Are meals included in the accommodation price?",
    answer:
      "Yes, all meal charges are included in the suggested donation amount for Bhakta Niwas rooms. Breakfast, lunch, and dinner (Mahaprasad) are provided at the Sansthan canteen. Hot water facilities are also included. There are no hidden charges — the price shown is the complete cost.",
    category: "facilities",
  },
  // --- WhatsApp & contact FAQs ---
  {
    id: "whatsapp-booking-number",
    question: "What is the WhatsApp number for Bhakta Niwas Shegaon booking?",
    answer:
      "The WhatsApp booking number for Shri Gajanan Maharaj Sansthan is +918053190691. You can send your accommodation booking request via WhatsApp with your preferred location, check-in date, check-out date, and number of guests. The Sansthan office will confirm availability and complete your booking.",
    category: "booking",
  },
  {
    id: "booking-by-phone",
    question: "Can I book Bhakta Niwas accommodation over the phone?",
    answer:
      "Yes, you can call the Sansthan booking helpline at +918053190691 to make an accommodation booking request. Office hours are Monday to Sunday, 9:00 AM to 6:00 PM. For convenience, WhatsApp booking is also available on the same number.",
    category: "booking",
  },
  {
    id: "online-booking-available",
    question: "Is online booking available for Bhakta Niwas Shegaon?",
    answer:
      "Yes, you can submit an accommodation booking request online using the booking form on the official Shri Gajanan Maharaj Sansthan website. Fill in your preferred location, check-in date, check-out date, and number of guests. The form automatically generates a WhatsApp message which you send to the Sansthan office at +918053190691 for confirmation.",
    category: "booking",
  },
  // --- Festival / peak season FAQs ---
  {
    id: "ashadhi-ekadashi-booking",
    question: "How do I book accommodation for Ashadhi Ekadashi at Pandharpur?",
    answer:
      "For Ashadhi Ekadashi at Pandharpur, book your Bhakta Niwas accommodation at Shri Gajanan Maharaj Sansthan Pandharpur several months in advance. Contact the Sansthan office at +918053190691 via WhatsApp or call. Rooms fill up months before the Ekadashi date. The Sansthan provides accommodation near the Vitthal temple for warkari families visiting during the Ashadha wari.",
    category: "booking",
  },
  {
    id: "kartik-ekadashi-booking",
    question: "How do I book accommodation for Kartik Ekadashi at Pandharpur?",
    answer:
      "For Kartik Ekadashi (Dev Uthani Ekadashi) at Pandharpur, advance booking at Shri Gajanan Maharaj Sansthan Pandharpur is essential — rooms book out quickly. Contact the Sansthan office at +918053190691 as early as possible, ideally 3–4 months before the Kartik Ekadashi date. The Sansthan provides family accommodation for Vitthal devotees visiting Pandharpur during the Kartik wari.",
    category: "booking",
  },
  {
    id: "shivaratri-trimbakeshwar-booking",
    question: "How do I book accommodation at Trimbakeshwar for Maha Shivaratri?",
    answer:
      "For Maha Shivaratri at Trimbakeshwar Jyotirlinga, book your accommodation at Shri Gajanan Maharaj Sansthan Trimbakeshwar at least 2–3 months in advance. Contact the Sansthan booking helpline at +918053190691 via WhatsApp or phone. The Sansthan provides overnight accommodation for families visiting the Trimbakeshwar Jyotirlinga during Maha Shivaratri.",
    category: "booking",
  },
  {
    id: "peak-season-festival",
    question: "When is the peak booking season at Bhakta Niwas Shegaon?",
    answer:
      "Peak booking seasons at Shegaon Bhakta Niwas are: (1) Gajanan Vijay Utsav / Punyatithi (September 8 each year) — the busiest day, lakhs of devotees visit. (2) Ganesh Chaturthi (August–September). (3) Navratri (October). (4) Diwali (October–November). (5) Makar Sankranti (January 14). During these periods, rooms fill weeks to months in advance. Early WhatsApp booking at +918053190691 is strongly recommended.",
    category: "booking",
  },
  // --- Darshan & visit FAQs ---
  {
    id: "darshan-timings-shegaon",
    question: "What are the exact darshan timings at Shri Gajanan Maharaj Sansthan Shegaon?",
    answer:
      "Shri Gajanan Maharaj Sansthan Shegaon is open for darshan in two sessions: Morning Darshan 5:00 AM – 12:00 PM (Kakad Aarti at 5:00 AM, Madhyan Aarti at ~11:30 AM), and Evening Darshan 4:00 PM – 10:00 PM (Saptashringi Aarti at ~4:00 PM, Shej Aarti at ~9:30 PM). The temple is closed from 12:00 PM to 4:00 PM for afternoon break. The temple is open every day of the year.",
    category: "visit",
  },
  {
    id: "free-entry-darshan",
    question: "Is darshan at Shri Gajanan Maharaj Sansthan Shegaon free?",
    answer:
      "Yes, darshan at Shri Gajanan Maharaj Sansthan Shegaon is completely free of charge. There is no entry ticket or darshan fee. The temple is open to all devotees regardless of caste, religion, or financial status. Anand Sagar (Anand Vihar) park may have a nominal entry fee — please check with the Sansthan office.",
    category: "visit",
  },
  {
    id: "free-bus-station",
    question: "Is there a free bus from Shegaon Railway Station to the temple?",
    answer:
      "Yes, Shri Gajanan Maharaj Sansthan operates a free bus service between Shegaon Railway Station (SGO) and the main temple complex. The bus runs at regular intervals throughout the day. Devotees arriving by train can board the Sansthan bus at the main exit of Shegaon Railway Station. This is the most convenient and cost-free way to reach the temple from the station.",
    category: "visit",
  },
  {
    id: "mahaprasad-availability",
    question: "Is Mahaprasad available at Shegaon temple?",
    answer:
      "Yes, Mahaprasad (sacred community meal) is available at Shri Gajanan Maharaj Sansthan Shegaon. The Sansthan's Mahaprasad canteen serves simple, satvik meals to thousands of devotees daily. Mahaprasad is also distributed on special festival occasions. For Bhakta Niwas guests, all meals (breakfast, lunch, dinner) are included in the accommodation donation.",
    category: "facilities",
  },
  {
    id: "anand-sagar-visit",
    question: "Can we visit Anand Sagar (Anand Vihar) during our stay at Shegaon?",
    answer:
      "Yes, Anand Sagar (also known as Anand Vihar) is a beautiful spiritual and recreational park managed by Shri Gajanan Maharaj Sansthan, located near the main temple complex in Shegaon. It features gardens, water features, meditation zones, and is ideal for families. It is best visited during the afternoon break (12:00 PM – 4:00 PM) when the main temple is closed for darshan. Bhakta Niwas Anand Vihar accommodation is also available here.",
    category: "visit",
  },
  // --- Puja, Anand Sagar entry, and bus schedule FAQs (added 2026-05-07) ---
  {
    id: "puja-services-shegaon",
    question: "Are puja or abhishek services available at Shri Gajanan Maharaj Sansthan Shegaon?",
    answer:
      "Yes, puja and abhishek services are performed at Shri Gajanan Maharaj Sansthan Shegaon as part of the temple's daily rituals. The Sansthan conducts Kakad Aarti (5:00 AM), Madhyan Aarti (~11:30 AM), Saptashringi Aarti (~4:00 PM), and Shej Aarti (~9:30 PM) every day. Devotees can participate in these aartis without prior registration. For special pujas or offerings (naivedya), please contact the Sansthan office at +918053190691 to confirm current availability and procedures.",
    category: "visit",
  },
  {
    id: "anand-sagar-entry-timing",
    question: "What are the entry timings and entry fee for Anand Sagar Shegaon?",
    answer:
      "Anand Sagar (Anand Vihar) at Shegaon is typically open from 9:00 AM to 9:00 PM, though timings may vary on festival days. A nominal entry fee is charged per person; rates may differ for children and adults. Boat rides and garden areas within Anand Sagar may have separate nominal charges. Since fees are subject to periodic revision by the Sansthan, please confirm the current entry fee at the Anand Sagar gate or by calling the Sansthan office at +918053190691 before your visit.",
    category: "visit",
  },
  {
    id: "free-bus-schedule",
    question: "What is the free Sansthan bus schedule and route from Shegaon Railway Station to the temple?",
    answer:
      "Shri Gajanan Maharaj Sansthan operates a free shuttle bus between Shegaon Railway Station (SGO) and the main temple complex throughout the day. Buses depart from the main exit of Shegaon Railway Station at regular intervals — approximately every 15–30 minutes during peak hours (5:00 AM to 10:00 PM). The journey takes around 5–10 minutes. No ticket or payment is required — simply board at the station bus stand marked 'Sansthan Bus'. Return buses from the temple complex to the station run on the same schedule. For late-night arrivals, auto-rickshaws are available from the station.",
    category: "visit",
  },
];

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(
  category: FAQItem["category"]
): FAQItem[] {
  return bookingFAQs.filter((faq) => faq.category === category);
}

/**
 * Get all booking-related FAQs
 */
export function getBookingFAQs(): FAQItem[] {
  return getFAQsByCategory("booking");
}

/**
 * Generate location-specific FAQs for a given Sansthan location.
 * Used to inject FAQPage JSON-LD schema on individual location pages
 * to win FAQ rich snippet accordion results for booking queries.
 */
export function getLocationFAQs(
  locationName: string,
  locationCity: string,
  contactNumber: string,
  totalCapacity = 0
): FAQItem[] {
  return [
    {
      id: `${locationCity.toLowerCase()}-how-to-book`,
      question: `How do I book accommodation at ${locationName}?`,
      answer: `To book accommodation at ${locationName}, ${locationCity}, fill in the booking request form on our website with your preferred dates and guest count. Then contact the Sansthan office at ${contactNumber} via WhatsApp or phone. The office confirms availability and completes the booking.`,
      category: "booking",
    },
    {
      id: `${locationCity.toLowerCase()}-checkin`,
      question: `What are the check-in and check-out timings at ${locationCity} Bhakta Niwas?`,
      answer: `Accommodation at ${locationName} is allotted for 24 hours from the time of check-in. There is no fixed check-in time — rooms are assigned as they become available. Please coordinate with the office at ${contactNumber} for your specific arrival time.`,
      category: "visit",
    },
    {
      id: `${locationCity.toLowerCase()}-family-only`,
      question: `Can single persons or groups of friends book accommodation at ${locationCity}?`,
      answer: `No. Accommodation at ${locationName} is strictly for families only. Rooms are allocated to married couples with valid ID proof. Unmarried couples are not permitted. A minimum of 3 family members is usually required for a private room. Dormitory options may be available for individuals.`,
      category: "rules",
    },
    {
      id: `${locationCity.toLowerCase()}-cost`,
      question: `What is the cost of accommodation at ${locationName}?`,
      answer: `Accommodation at ${locationName}, ${locationCity} is provided on a donation basis. There is no fixed price. Devotees may contribute as per their capacity. The Sansthan operates on the principle of serving all devotees equally, regardless of their financial means.`,
      category: "facilities",
    },
    {
      id: `${locationCity.toLowerCase()}-documents`,
      question: `What documents are required for check-in at ${locationCity}?`,
      answer: `Valid government-issued photo ID is mandatory for all guests — Aadhar Card, Voter ID, Passport, or Driving License. Married couples may be asked to provide proof of marriage. Please carry original documents for verification at check-in.`,
      category: "rules",
    },
    {
      id: `${locationCity.toLowerCase()}-bhakta-niwas-exists`,
      question: `Is there a Bhakta Niwas at ${locationCity} managed by Shri Gajanan Maharaj Sansthan?`,
      answer: `Yes. Shri Gajanan Maharaj Sansthan manages a Bhakta Niwas (devotee accommodation) at ${locationCity}. The facility — ${locationName} — provides rooms for pilgrims on a donation basis. To check availability or make a booking request, contact the Sansthan office at ${contactNumber} via WhatsApp or phone.`,
      category: "facilities",
    },
    ...(totalCapacity > 0
      ? [
          {
            id: `${locationCity.toLowerCase()}-capacity`,
            question: `How many devotees can stay at the ${locationCity} Bhakta Niwas at a time?`,
            answer: `The ${locationName} can accommodate up to ${totalCapacity} devotees at a time across all room types. During peak festival seasons and major pilgrimage dates, rooms fill up quickly. Advance booking through WhatsApp at ${contactNumber} is strongly recommended.`,
            category: "facilities" as const,
          },
        ]
      : []),
  ];
}
