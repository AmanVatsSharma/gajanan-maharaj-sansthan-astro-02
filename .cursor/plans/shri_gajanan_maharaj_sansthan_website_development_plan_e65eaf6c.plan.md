---
name: Shri Gajanan Maharaj Sansthan Website Development Plan
overview: Develop a premium, spiritual, and official-looking website for Shri Gajanan Maharaj Sansthan using Next.js. The site will feature a directory of Dharmashalas (Shegaon, Pandharpur, etc.), a room booking system with Sansthan-specific rules (e.g., families only), and a rich UI reflecting the spiritual ethos ("Jai Gajanan Maharaj").
todos:
  - id: setup-design
    content: Setup Design System (Tailwind theme, Fonts, Colors) and Folder Structure
    status: completed
  - id: create-data
    content: Create Sansthan Data Module (Locations, Rules, History)
    status: completed
  - id: build-ui-primitives
    content: Build UI Primitives (Button, Card, Input, Dialog, Form)
    status: completed
  - id: develop-home
    content: Develop Home Page (Hero, Features, Footer)
    status: completed
  - id: develop-locations
    content: Develop Locations Directory & Detail Pages
    status: completed
  - id: implement-booking
    content: Implement Booking Wizard with Validation Rules
    status: completed
isProject: false
---

# Shri Gajanan Maharaj Sansthan Website Development Plan

## 1. Project Setup & Architecture

- **Structure**: Reorganize `src` to follow `uirules.mdc`:
  - `src/features/` (auth, booking, locations, info)
  - `src/components/ui/` (Shadcn-like primitives)
  - `src/design-system/` (Tokens, Theme)
  - `src/lib/` (Utils, Logger)
- **Design System**:
  - **Theme**: "Spiritual Serenity" - Saffron (#FF9933), Maroon (#800000), Warm White (#FDFBF7), and Gold accents.
  - **Typography**: Clean, legible sans-serif (Inter/Geist) with traditional serif headings (Playfair Display) for spiritual quotes.
  - **Tailwind**: Configure v4 theme variables.

## 2. Core Features

### A. Locations Module (`src/features/locations`)

- **Data Source**: `src/data/sansthan-data.ts` containing details for:
  - Shegaon (Bhakt Niwas 1-6, Anand Vihar, Visawa)
  - Pandharpur (Math)
  - Trimbakeshwar
  - Omkareshwar
  - Alandi
- **Components**:
  - `LocationCard`: Image, Name, Capacity, "Book Now" button.
  - `LocationGallery`: Masonry grid of facility images.
  - `AmenityList`: Icons for Parking, Canteen, Hot Water, etc.

### B. Booking System (`src/features/booking`)

- **Flow**:
  1. **Search**: Select Location, Dates, Guest Count.
  2. **Selection**: View available room types (AC/Non-AC/Dormitory).
  3. **Rules Check**: Modal explaining "Families Only", "Min 3 Members", "ID Proof" rules.
  4. **Guest Details**: Form for primary guest info.
  5. **Confirmation**: Mock payment/booking ID generation.
- **Validation**: Zod schema to enforce Sansthan rules (e.g., prevent single person booking if rule applies).

### C. Information & Content (`src/features/info`)

- **Home Page**:
  - Hero Section: "Jai Gajanan Maharaj" chant animation, high-quality temple image.
  - "Darshan" timings and Live Darshan link (placeholder).
  - Latest News/Utsav updates.
- **About Us**: History of the Sansthan and Shri Gajanan Maharaj.

## 3. UI Implementation Plan

- **Components to Build**:
  - `Navbar`: Sticky, with logo and clear navigation.
  - `Footer`: Links, Copyright, "Seva" quote.
  - `HeroCarousel`: For the main landing page.
  - `BookingWizard`: Step-by-step form.
- **Assets**:
  - Use existing images in `public/gallery` as placeholders for facilities.
  - Use Wikimedia URLs found by research for specific landmarks (Temple, Anand Sagar).

## 4. Technical Tasks

- Initialize Design System (Colors, Fonts).
- Create `SansthanData` service/mock.
- Build `Home` page with Hero and Introduction.
- Build `Locations` listing page.
- Build `Booking` flow with Zod validation.
- Implement `Contact` and `About` pages.

