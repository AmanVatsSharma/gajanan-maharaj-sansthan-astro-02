---
name: Mobile Responsive Polish
overview: Optimize mobile responsiveness, spacing, padding, and alignment across all home page sections for a compact, beautiful, and perfectly aligned experience on all screen sizes.
todos:
  - id: hero-mobile
    content: Optimize Hero for mobile - text sizes, button sizing, padding
    status: completed
  - id: stats-mobile
    content: Optimize ImpactStats for mobile - card padding, number sizes, gaps
    status: completed
  - id: features-mobile
    content: Optimize Features for mobile - card padding, icon sizes, gaps
    status: completed
  - id: locations-mobile
    content: Optimize FeaturedLocations for mobile - image height, card padding, buttons
    status: completed
  - id: testimonials-mobile
    content: Optimize Testimonials for mobile - card padding, text sizes, gaps
    status: completed
  - id: visit-mobile
    content: Optimize PlanYourVisit for mobile - card stacking, padding, layouts
    status: completed
  - id: cta-mobile
    content: Optimize CTABanner for mobile - heading sizes, button sizing, trust indicators
    status: completed
  - id: footer-mobile
    content: Fix Footer - remove trailing commas, optimize mobile grid, padding
    status: completed
isProject: false
---

# Mobile Responsive & Spacing Polish Plan

## Issues Identified

After reviewing all components, here are the mobile responsiveness and spacing issues to fix:

### 1. Hero Section

**File**: [src/features/info/components/Hero.tsx](src/features/info/components/Hero.tsx)

**Issues**:

- Text sizes too large on small screens (h1 at 5xl on mobile)
- Buttons might overflow on very small screens
- Badge text could be more compact
- Padding needs mobile optimization

**Fixes**:

- Reduce h1 from `text-5xl` to `text-4xl` on mobile
- Adjust h2 chant from `text-2xl` to `text-xl` on mobile
- Make buttons responsive: `min-w-[200px] sm:min-w-[240px]`
- Reduce vertical padding on mobile: `py-16 sm:py-20`
- Add better line-height for mobile readability

### 2. ImpactStats Section

**File**: [src/features/info/components/ImpactStats.tsx](src/features/info/components/ImpactStats.tsx)

**Issues**:

- Stat cards padding too large on mobile (p-8)
- Numbers might be too big on small screens (text-5xl)
- Grid gap could be tighter on mobile

**Fixes**:

- Reduce padding: `p-6 md:p-8`
- Adjust number size: `text-4xl md:text-5xl lg:text-6xl`
- Tighter gap on mobile: `gap-4 md:gap-6 lg:gap-8`
- Section padding: `py-16 md:py-20 lg:py-28`

### 3. Features Section

**File**: [src/features/info/components/Features.tsx](src/features/info/components/Features.tsx)

**Issues**:

- Card padding too generous on mobile
- Icon size could be smaller on mobile
- Section padding needs mobile optimization

**Fixes**:

- Card padding: `p-6 md:p-8` (CardHeader/CardContent)
- Icon container: `w-16 h-16 md:w-20 md:h-20`
- Icon size: `h-8 w-8 md:h-10 md:w-10`
- Grid gap: `gap-5 md:gap-6 lg:gap-8`
- Section padding: `py-16 md:py-20 lg:py-28`

### 4. Featured Locations Section

**File**: [src/features/info/components/FeaturedLocations.tsx](src/features/info/components/FeaturedLocations.tsx)

**Issues**:

- Image height (h-72) too tall on mobile
- Card padding could be tighter
- Buttons on mobile need better spacing
- Section heading too large on mobile

**Fixes**:

- Image height: `h-64 md:h-72`
- Card content padding: `p-5 md:p-6`
- Button gap: `gap-2 sm:gap-3`
- Heading: `text-3xl md:text-4xl lg:text-5xl`
- Section padding: `py-16 md:py-20 lg:py-28`

### 5. Testimonials Section

**File**: [src/features/info/components/Testimonials.tsx](src/features/info/components/Testimonials.tsx)

**Issues**:

- Quote card padding too large on mobile
- Text could be more compact
- Quote icon size

**Fixes**:

- Card padding: `p-6 md:p-8`
- Quote text: `text-sm md:text-base`
- Icon container: `w-10 h-10 md:w-12 md:h-12`
- Grid gap: `gap-6 md:gap-8`
- Section padding: `py-16 md:py-20 lg:py-28`

### 6. Plan Your Visit Section

**File**: [src/features/info/components/PlanYourVisit.tsx](src/features/info/components/PlanYourVisit.tsx)

**Issues**:

- Multiple stacked cards on mobile create too much height
- Card padding generous
- Text sizes need mobile adjustment
- Darshan timing cards need mobile compact layout

**Fixes**:

- Card padding: `p-6 md:p-8`
- Heading: `text-xl md:text-2xl`
- Section heading: `text-3xl md:text-4xl lg:text-5xl`
- Grid gap: `gap-6 md:gap-8`
- Darshan timing: adjust flex layout for mobile
- Important notes: single column on mobile

### 7. CTA Banner Section

**File**: [src/features/info/components/CTABanner.tsx](src/features/info/components/CTABanner.tsx)

**Issues**:

- Heading too large on mobile
- Buttons need better mobile sizing
- Padding too generous on mobile
- Trust indicators might wrap awkwardly

**Fixes**:

- Heading: `text-3xl md:text-5xl lg:text-6xl`
- Subtext: `text-base md:text-lg lg:text-xl`
- Buttons: `min-w-[200px] sm:min-w-[240px]`, height `h-14 md:h-16`
- Section padding: `py-16 md:py-20 lg:py-32`
- Trust indicators: stack on very small screens

### 8. Footer

**File**: [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)

**Issues**:

- Trailing commas in address display
- Grid could be more compact on mobile
- Padding needs adjustment

**Fixes**:

- Remove trailing commas from address rendering
- Grid: `gap-6 md:gap-8`
- Better mobile column layout
- Tighter section padding on mobile: `py-10 md:py-12 lg:py-16`

### 9. Global Spacing Consistency

**Files to update**: All section components

**Standards to apply**:

- **Section padding**: `py-16 md:py-20 lg:py-28` (consistent across all)
- **Container**: Always use `container` class (has built-in responsive padding)
- **Card padding**: `p-6 md:p-8` as standard
- **Grid gaps**: `gap-4 md:gap-6 lg:gap-8` progression
- **Heading sizes**:
  - h1: `text-4xl md:text-6xl lg:text-7xl`
  - h2: `text-3xl md:text-4xl lg:text-5xl`
  - h3: `text-xl md:text-2xl`
- **Button sizing on mobile**: `h-12 md:h-14 lg:h-16`
- **Text line-height**: Use `leading-relaxed` for body, `leading-tight` for headings

### 10. Touch Targets & Accessibility

Ensure all interactive elements meet minimum 44x44px touch target:

- Buttons: minimum `h-11` (44px)
- Links in mobile drawer: `py-2.5` (40px + text = 44px+)
- Icon buttons: minimum `w-11 h-11`

## Implementation Order

1. Hero - Most visible, highest priority
2. ImpactStats - First content section
3. Features - Core service showcase
4. FeaturedLocations - Visual showcase
5. Testimonials - Social proof
6. PlanYourVisit - Information dense
7. CTABanner - Final conversion
8. Footer - Close experience

## Testing Requirements

After implementation, test on:

- iPhone SE (375px width) - smallest common mobile
- Standard mobile (390px-428px)
- Tablets (768px-1024px)
- Desktop (1280px+)

Check for:

- No horizontal scroll
- No text cutoff
- Proper button tap targets (44px minimum)
- Readable text sizes
- Proper spacing rhythm
- Beautiful visual hierarchy

## Design Principles for Mobile

- **Compact but not cramped**: Reduce padding but maintain breathing room
- **Hierarchy through size**: Use responsive text sizing effectively
- **Touch-friendly**: All interactive elements 44px+ touch target
- **Vertical rhythm**: Consistent spacing progression
- **Performance**: No layout shift, smooth animations

