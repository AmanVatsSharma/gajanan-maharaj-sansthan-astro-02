/**
 * @file rooms.ts
 * @module data
 * @description Room types and pricing data for Shri Gajanan Maharaj Sansthan accommodations
 * @author BharatERP
 * @created 2026-02-12
 */

// Room types and data for Shri Gajanan Maharaj Sansthan

export interface RoomType {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  badge: string;
  badgeColor: string;
  features: string[];
  images: string[];
  ac: boolean;
  capacity: number;
}

export const ROOMS: RoomType[] = [
  {
    id: "4-bed-ac",
    title: "4 Bed AC",
    description: "Spacious room with air conditioning",
    price: 2550,
    currency: "₹",
    image: "/rooms/4-Bed-01.jpg",
    badge: "AC",
    badgeColor: "bg-brand-saffron",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/4-Bed-01.jpg", "/rooms/4-Bed-02.jpg", "/rooms/4-Bed-01.jpg"],
    ac: true,
    capacity: 4,
  },
  {
    id: "4-bed-non-ac",
    title: "4 Bed Non-AC",
    description: "Spacious room with natural ventilation",
    price: 2250,
    currency: "₹",
    image: "/rooms/4-Bed-02.jpg",
    badge: "Non-AC",
    badgeColor: "bg-blue-600",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/4-Bed-02.jpg", "/rooms/4-Bed-01.jpg", "/rooms/4-Bed-02.jpg"],
    ac: false,
    capacity: 4,
  },
  {
    id: "3-bed-ac",
    title: "3 Bed AC",
    description: "Comfortable room with AC",
    price: 2050,
    currency: "₹",
    image: "/rooms/3-Bed-01.jpg",
    badge: "AC",
    badgeColor: "bg-brand-saffron",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/3-Bed-01.jpg", "/rooms/3-Bed-02.jpg", "/rooms/3-Bed-01.jpg"],
    ac: true,
    capacity: 3,
  },
  {
    id: "3-bed-non-ac",
    title: "3 Bed Non-AC",
    description: "Comfortable room with natural ventilation",
    price: 1750,
    currency: "₹",
    image: "/rooms/3-Bed-02.jpg",
    badge: "Non-AC",
    badgeColor: "bg-blue-600",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/3-Bed-02.jpg", "/rooms/3-Bed-01.jpg", "/rooms/3-Bed-02.jpg"],
    ac: false,
    capacity: 3,
  },
  {
    id: "2-bed-ac",
    title: "2 Bed AC",
    description: "Cozy room with air conditioning",
    price: 1650,
    currency: "₹",
    image: "/rooms/2-Bed-01.jpg",
    badge: "AC",
    badgeColor: "bg-brand-saffron",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/2-Bed-01.jpg", "/rooms/2-Bed-02.jpg", "/rooms/2-Bed-01.jpg"],
    ac: true,
    capacity: 2,
  },
  {
    id: "2-bed-non-ac",
    title: "2 Bed Non-AC",
    description: "Cozy room with natural ventilation",
    price: 1250,
    currency: "₹",
    image: "/rooms/2-Bed-02.jpg",
    badge: "Non-AC",
    badgeColor: "bg-blue-600",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/2-Bed-02.jpg", "/rooms/2-Bed-01.jpg", "/rooms/2-Bed-02.jpg"],
    ac: false,
    capacity: 2,
  },
  {
    id: "deluxe-suite",
    title: "Deluxe Suite",
    description: "Elegant suite with premium features",
    price: 3150,
    currency: "₹",
    image: "/rooms/Deluxe.jpg",
    badge: "Deluxe",
    badgeColor: "bg-brand-gold",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/Deluxe.jpg", "/rooms/Deluxe.jpg", "/rooms/Deluxe.jpg"],
    ac: true,
    capacity: 4,
  },
  {
    id: "luxury-suite",
    title: "Luxury Suite",
    description: "Premium suite with all amenities",
    price: 4150,
    currency: "₹",
    image: "/rooms/Suit-Luxury.jpg",
    badge: "Luxury",
    badgeColor: "bg-purple-600",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/Suit-Luxury.jpg", "/rooms/Suit-Luxury.jpg", "/rooms/Suit-Luxury.jpg"],
    ac: true,
    capacity: 4,
  },
  {
    id: "family-room",
    title: "Family Room",
    description: "Spacious room perfect for families",
    price: 3850,
    currency: "₹",
    image: "/rooms/IMG-20251018-WA0003.jpg",
    badge: "Family",
    badgeColor: "bg-green-600",
    features: [
      "Clean and well-maintained rooms",
      "Comfortable bedding and pillows",
      "Attached bathroom with hot water",
      "24/7 customer support",
      "Peaceful spiritual environment",
    ],
    images: ["/rooms/IMG-20251018-WA0003.jpg", "/rooms/IMG-20251018-WA0003.jpg", "/rooms/IMG-20251018-WA0003.jpg"],
    ac: true,
    capacity: 6,
  },
] as const;

export const PRICING_TRANSPARENCY = {
  disclaimer: "All prices include: Room accommodation + All meals (Breakfast, Lunch, Dinner) + Applicable taxes + Hot water facilities",
  noHiddenCharges: "No hidden charges. Final price is exactly as shown.",
  checkInOut: "Check-in: 24 Hours | Check-out: 24 Hours",
} as const;
