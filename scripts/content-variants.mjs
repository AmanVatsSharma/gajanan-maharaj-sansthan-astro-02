/**
 * File: scripts/content-variants.mjs
 * Purpose: Provides randomized, intent-specific content blocks for the blog generator.
 * This ensures that even with 500 posts, the internal sections are not identical.
 */

export const INTENT_VARIANTS = {
  darshan: {
    checklist: [
      ["Check the daily darshan timings on the official board.", "Wear modest and comfortable clothing.", "Use the free locker facility for your footwear.", "Join the queue early to avoid the peak heat."],
      ["Keep your ID proof handy for verification.", "Follow the discipline and silence in the darshan queue.", "Identify the nearest exit points for elderly family members.", "Check if there are any special festival queues active."],
      ["Plan for a 2-3 hour window during weekends.", "Carry a small water bottle for children while in queue.", "Respect the temple volunteers and their guidance.", "Exit the complex quietly to maintain the sanctity."]
    ],
    tips: [
      "The morning aarti is a deeply spiritual experience; try to arrive by 4:30 AM for the best chance to participate.",
      "During peak festival seasons, the queue can be long. Use the designated resting areas if traveling with seniors.",
      "Photography is strictly prohibited inside the core temple area. Keep your mobile phones in your bags or lockers."
    ]
  },
  accommodation: {
    checklist: [
      ["Carry a physical copy of your booking confirmation.", "Ensure every adult has a valid government ID.", "Check the 24-hour check-out policy to plan your departure.", "Verify the room type and amenities upon arrival."],
      ["Keep the Sansthan helpline number saved for any assistance.", "Familiarize yourself with the Mahaprasad timings near the stay.", "Request extra blankets or pillows at the reception if needed.", "Observe the cleanliness and discipline rules of the Bhakta Niwas."],
      ["Arrive within the designated check-in window.", "Confirm the number of guests matches your booking request.", "Check for hot water timings which are usually in the early morning.", "Use the safe or lockers provided for your valuables."]
    ],
    tips: [
      "The Bhakta Niwas operates on a service-first model, not a luxury hotel model. Expect cleanliness and simplicity.",
      "Advance booking is highly recommended for weekends. Use the official WhatsApp or phone channels for requests.",
      "Most accommodations are within walking distance to the temple, but free bus services are often available."
    ]
  },
  transport: {
    checklist: [
      ["Confirm the train or bus arrival time at Shegaon station.", "Use the free Sansthan bus from the station to the temple.", "Keep local auto-rickshaw contact numbers for late-night arrivals.", "Check for road conditions if driving from cities like Pune or Nagpur."],
      ["Book your return tickets in advance, especially during holidays.", "Locate the nearest parking facility if you are using a private vehicle.", "Plan your arrival to coincide with the check-in timings of your stay.", "Check for any local traffic diversions during festival processions."],
      ["Carry light snacks and water for the journey to Buldhana district.", "Ensure your vehicle has enough fuel as some routes have fewer stations.", "Use GPS but also verify directions with locals for the final temple approach.", "Keep your booking confirmation handy to show at the entry gates."]
    ],
    tips: [
      "The Shegaon railway station is a major stop; most express trains from Mumbai and Nagpur stop here regularly.",
      "For those driving from Mumbai, the Samruddhi Mahamarg has significantly reduced travel time to the Vidarbha region.",
      "Local transport within Shegaon is easy to find, but walking is often the fastest way during peak crowd hours."
    ]
  },
  'travel-guide': {
    checklist: [
      ["Allocate at least two days to cover the temple and Anand Sagar.", "Check the local weather to pack appropriate clothing.", "Plan your budget for donations and local shopping.", "Inform your family about the itinerary and stay location."],
      ["Keep a list of emergency contacts for the Sansthan office.", "Identify child-friendly zones and resting areas in the complex.", "Plan your visit to nearby attractions like Matoshree Mandir.", "Verify the current operational status of the Anand Sagar park."],
      ["Respect local customs and traditions throughout your visit.", "Keep a physical map or guide of the temple complex.", "Schedule your meals around the Mahaprasad timings for an authentic experience.", "Carry essential medicines as some specific brands may not be available locally."]
    ],
    tips: [
      "Shegaon is not just a temple; it's a spiritual ecosystem. Take time to sit in the meditation halls.",
      "Try the famous Shegaon Kachori at local stalls, but ensure you maintain your health for the pilgrimage.",
      "The best way to experience the Sansthan is to follow the daily routine of the temple, starting with early prayers."
    ]
  }
};

export const FAQ_VARIANTS = [
  {
    question: "Is there an online booking portal for Sansthan accommodation?",
    answer: "Currently, the Sansthan primarily manages bookings through official phone and WhatsApp channels to ensure fair distribution. Be wary of unofficial websites claiming to offer online bookings."
  },
  {
    question: "What are the typical charges for Bhakta Niwas rooms?",
    answer: "The charges are kept very nominal as it is a service for devotees. Prices vary based on room type (AC/Non-AC) and the number of beds, but it is much more affordable than private hotels."
  },
  {
    question: "Are meals provided at the temple accommodation?",
    answer: "While rooms don't usually have room service, the Sansthan operates a massive Mahaprasad Hall and various canteens where healthy, subsidized, or free meals are served."
  },
  {
    question: "Can I book a room for just one person?",
    answer: "Yes, dormitory facilities are often available for solo devotees, while family rooms are reserved for groups. ID proof is mandatory regardless of the group size."
  },
  {
    question: "What is the check-out policy at Shegaon?",
    answer: "Most Sansthan accommodations follow a 24-hour check-out cycle from the time of entry, allowing devotees flexibility based on their arrival."
  }
];

export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getVariantForIntent(intent, type) {
  const category = INTENT_VARIANTS[intent] || INTENT_VARIANTS['travel-guide'];
  return getRandomElement(category[type]);
}
