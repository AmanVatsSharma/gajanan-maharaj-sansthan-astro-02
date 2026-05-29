/**
 * File: src/data/visit-info.ts
 * Module: data
 * Purpose: Visit planning information for devotees.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 */

export interface DarshanTiming {
  type: string;
  time: string;
  description?: string;
}

export interface TransportOption {
  mode: string;
  description: string;
  icon: string;
}

export interface VisitTip {
  season: string;
  description: string;
  months: string;
}

export const darshanTimings: DarshanTiming[] = [
  {
    type: "Morning Darshan",
    time: "5:00 AM - 12:00 PM",
    description: "Temple opens for morning prayers and darshan",
  },
  {
    type: "Evening Darshan",
    time: "4:00 PM - 10:00 PM",
    description: "Evening aarti and darshan available",
  },
];

export const transportOptions: TransportOption[] = [
  {
    mode: "By Train",
    description: "Shegaon Railway Station is well-connected to major cities. Free bus service available from station to temple.",
    icon: "train",
  },
  {
    mode: "By Road",
    description: "Well-connected by state highways. Regular bus services from Nagpur (150 km), Akola (80 km), and nearby cities.",
    icon: "bus",
  },
  {
    mode: "By Air",
    description: "Nearest airport: Dr. Babasaheb Ambedkar International Airport, Nagpur (165 km). Taxi and bus services available.",
    icon: "plane",
  },
];

export const visitTips: VisitTip[] = [
  {
    season: "Winter",
    months: "October to February",
    description: "Pleasant weather, ideal for darshan and exploring Anand Sagar",
  },
  {
    season: "Monsoon",
    months: "July to September",
    description: "Lush greenery at Anand Sagar, moderate crowds",
  },
  {
    season: "Summer",
    months: "March to June",
    description: "Hot weather, but less crowded. AC accommodations available",
  },
];

export const importantNotes = [
  "ID proof is mandatory for accommodation booking",
  "Advance booking recommended during festivals and weekends",
  "Mahaprasad (lunch) available daily at nominal charges",
  "Free Wi-Fi available at main complex",
  "Photography restricted inside temple premises",
];
