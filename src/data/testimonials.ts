/**
 * File: src/data/testimonials.ts
 * Module: data
 * Purpose: Devotee testimonials and experiences.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 */

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  date?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "The peace and serenity I experienced at Shegaon is beyond words. The accommodation was clean, staff was helpful, and the spiritual atmosphere touched my heart deeply. Jai Gajanan Maharaj!",
    author: "Smt. Priya Deshmukh",
    location: "Mumbai, Maharashtra",
  },
  {
    id: "2",
    quote: "Our family has been visiting Shegaon for three generations. The Sansthan's dedication to cleanliness, discipline, and devotee service is exemplary. The Mahaprasad distribution and free bus service are great examples of selfless seva.",
    author: "Shri Ramesh Kulkarni",
    location: "Pune, Maharashtra",
  },
  {
    id: "3",
    quote: "Anand Sagar is a divine oasis of tranquility. The beautiful gardens, meditation centers, and peaceful atmosphere provide the perfect setting for spiritual contemplation. A must-visit for every devotee.",
    author: "Smt. Anjali Patil",
    location: "Nagpur, Maharashtra",
  },
  {
    id: "4",
    quote: "The accommodation booking process was smooth, and the rooms at Bhakta Niwas exceeded our expectations. The Sansthan truly lives by the principle of 'Atithi Devo Bhava'. We felt blessed and welcome.",
    author: "Shri Vikram Sharma",
    location: "Delhi",
  },
  {
    id: "5",
    quote: "Attending the Kakad Aarti and Shejarti at the Shegaon temple was a profoundly moving experience. The rhythmic chanting, the fragrance of incense, and the sight of thousands of devotees absorbed in devotion left me speechless. Gajanan Maharaj's blessings are truly felt the moment you step inside.",
    author: "Smt. Sudha Joglekar",
    location: "Aurangabad, Maharashtra",
    date: "2026-03-14",
  },
  {
    id: "6",
    quote: "We visited Shegaon during Ashadhi Ekadashi with our elderly parents and were overwhelmed by the Sansthan's thoughtfulness — dedicated queues for senior citizens, wheelchair access near the garbhagriha, and volunteers guiding devotees at every turn. The Mahaprasad hall served thousands without a moment's delay. True seva in every sense.",
    author: "Shri Ganesh Bhosale",
    location: "Kolhapur, Maharashtra",
    date: "2026-04-02",
  },
  {
    id: "7",
    quote: "From Hyderabad we travelled overnight and reached Shegaon by morning. The free Sansthan bus from the railway station made the journey effortless. After darshan, spending the afternoon at Anand Sagar with children felt like a blessing in itself — the boat rides, lush gardens, and serene water body are unlike anything we have seen at any pilgrimage site.",
    author: "Smt. Kavitha Reddy",
    location: "Hyderabad, Telangana",
    date: "2026-04-21",
  },
];
