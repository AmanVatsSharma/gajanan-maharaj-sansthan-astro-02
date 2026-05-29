---
name: Design Enhancement & Visual Polish (Plan 2)
overview: Focus on elevating the visual aesthetic to a "premium spiritual" level. This includes integrating high-quality images, adding spiritual texture patterns, refining typography, and implementing advanced scroll animations.
todos:
  - id: download-images
    content: Download and organize high-quality images for Shegaon and Anand Sagar
    status: completed
  - id: implement-patterns
    content: Implement subtle spiritual background patterns in global CSS
    status: completed
  - id: upgrade-navbar
    content: Update Navbar with transparent-to-solid scroll effect
    status: completed
  - id: add-scroll-animations
    content: Add scroll reveal animations to Features and Locations sections
    status: in_progress
  - id: refine-footer
    content: Refine Footer with decorative border
    status: pending
isProject: false
---

# Design Enhancement & Visual Polish (Plan 2)

## 1. Visual Assets & Imagery

- **Objective**: Replace placeholders with high-quality, relevant images.
- **Action**:
  - Download high-res images of Shegaon Temple and Anand Sagar from Wikimedia Commons (identified in research).
  - Organize them in `public/images/` with descriptive names (e.g., `shegaon-temple.jpg`, `anand-sagar.jpg`).
  - Update `sansthan-data.ts` to point to these new images.

## 2. Advanced Design System

- **Objective**: Add depth and spiritual character to the UI.
- **Action**:
  - **Background Patterns**: Create a subtle "Mandala" or "Paisley" opacity pattern for section backgrounds (using CSS/SVG).
  - **Color Palette Refinement**: Ensure the "Warm White" (`#FDFBF7`) is used effectively to reduce eye strain compared to pure white.
  - **Typography**: Enforce `Playfair Display` for all section headings and `Inter` for readability in body text.

## 3. Component Upgrades

- **Navbar**: Implement a "Transparent-to-Solid" scroll effect for the sticky navbar.
- **Hero Section**: Add a parallax effect or a slow zoom animation to the background image.
- **Footer**: Add a decorative top border (e.g., a traditional rangoli-style border pattern).

## 4. Animations (Framer Motion)

- **Scroll Reveals**: Add `motion.div` wrappers to the `Features` and `Locations` grids so items fade in and slide up as the user scrolls.
- **Micro-interactions**: Enhance button hover states with scale and shadow transitions.

## 5. Mobile Responsiveness

- **Check**: Ensure the new complex layouts and animations work smoothly on mobile devices.

