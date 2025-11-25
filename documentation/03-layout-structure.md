# Layout Structure Documentation

## Overview
This document covers the root layout configuration, metadata setup, font loading, and overall page structure of the clothing website.

## Root Layout (`app/layout.tsx`)

### Purpose
The root layout wraps all pages and provides:
- Global HTML structure
- Font loading and configuration
- Metadata for SEO
- Analytics integration
- Theme provider setup

### Implementation

```typescript
import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Playfair_Display } from "next/font/google"

const geist = Geist({ subsets: ["latin"] })
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif" 
})

export const metadata: Metadata = {
  title: "LUXE - Premium Fashion",
  description: "Discover modern luxury fashion with curated collections",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${playfair.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Font Configuration

### Geist (Sans-Serif)
- **Type:** Variable font
- **Usage:** Default body font
- **Applied via:** `font-sans` class (applied to body)
- **Characteristics:** Modern, clean, optimized for screens
- **Subsets:** Latin characters

### Playfair Display (Serif)
- **Type:** Variable font
- **Usage:** Headings, hero titles, elegant text
- **Applied via:** `font-serif` class
- **CSS Variable:** `--font-serif`
- **Characteristics:** High-contrast, elegant, sophisticated
- **Subsets:** Latin characters

### Font Loading Strategy
- **Optimization:** Next.js automatic font optimization
- **Loading:** Fonts are self-hosted and optimized
- **Performance:** Zero layout shift, instant font loading
- **Fallback:** System fonts during load

## Metadata Configuration

### SEO Metadata

#### Title
```typescript
title: "LUXE - Premium Fashion"
```
- Brand name: LUXE
- Descriptor: Premium Fashion
- Appears in browser tab and search results

#### Description
```typescript
description: "Discover modern luxury fashion with curated collections"
```
- Concise value proposition
- Keywords: luxury, fashion, curated
- Optimized for search engine snippets

#### Generator
```typescript
generator: "v0.app"
```
- Indicates the tool used for initial generation

### Favicon Configuration

#### Adaptive Icons
```typescript
icons: {
  icon: [
    {
      url: "/icon-light-32x32.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "/icon-dark-32x32.png",
      media: "(prefers-color-scheme: dark)",
    },
    {
      url: "/icon.svg",
      type: "image/svg+xml",
    },
  ],
  apple: "/apple-icon.png",
}
```

**Features:**
- Theme-aware icons (light/dark mode)
- SVG icon for modern browsers
- Apple touch icon for iOS devices
- 32x32px PNG icons for compatibility

## Global Styles (`app/globals.css`)

### Import Structure
```css
@import "tailwindcss";
@import "tw-animate-css";
```

### Custom Variant
```css
@custom-variant dark (&:is(.dark *));
```
- Enables dark mode class-based theming

### Theme Variables
All color tokens defined in `:root` and `.dark` selectors (see `02-design-system.md`)

### Base Layer
```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

**Purpose:**
- Consistent border colors across all elements
- Focus outline styling
- Default background and text colors

## Page Structure (`app/page.tsx`)

### Component Architecture

```typescript
"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import NewArrivals from "@/components/new-arrivals"
import FeaturedCollection from "@/components/featured-collection"
import TrendingCollection from "@/components/trending-collection"
import CollectionBanner from "@/components/collection-banner"
import ShopSection from "@/components/shop-section"
import Footer from "@/components/footer"

export default function Home() {
  const [cartCount, setCartCount] = useState(0)

  const handleAddToCart = () => {
    setCartCount((c) => c + 1)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={cartCount} />
      <HeroSection />
      <NewArrivals onAddToCart={handleAddToCart} />
      <FeaturedCollection />
      <TrendingCollection onAddToCart={handleAddToCart} />
      <CollectionBanner />
      <ShopSection onAddToCart={handleAddToCart} />
      <Footer />
    </main>
  )
}
```

### Page Flow

1. **Header** - Navigation with cart counter
2. **Hero Section** - Full-width carousel with CTAs
3. **New Arrivals** - Product grid with add-to-cart
4. **Featured Collection** - Curated product showcase
5. **Trending Collection** - Popular items with add-to-cart
6. **Collection Banner** - Visual break/promotional content
7. **Shop Section** - Additional products with add-to-cart
8. **Footer** - Links, newsletter, social media

### State Management

#### Cart Count
```typescript
const [cartCount, setCartCount] = useState(0)
```
- Tracks total items in cart
- Passed to Header for display
- Updated via `handleAddToCart` callback

#### Add to Cart Handler
```typescript
const handleAddToCart = () => {
  setCartCount((c) => c + 1)
}
```
- Increments cart count
- Passed to product sections
- Triggered by product card buttons

### Client Component
```typescript
"use client"
```
- Required for `useState` hook
- Enables interactivity
- Renders on client side

## Responsive Layout

### Container Pattern
```typescript
className="min-h-screen bg-background"
```
- Minimum full viewport height
- Background color from theme
- Allows content to extend beyond viewport

### Section Spacing
Each section component handles its own:
- Padding (typically `py-12` or `py-16`)
- Max width (`max-w-7xl mx-auto`)
- Responsive padding (`px-4 sm:px-6 lg:px-8`)

## Analytics Integration

### Vercel Analytics
```typescript
import { Analytics } from "@vercel/analytics/next"

// In layout
<Analytics />
```

**Features:**
- Automatic page view tracking
- Web Vitals monitoring
- Zero configuration required
- Privacy-friendly

## Accessibility Features

### Semantic HTML
- `<html lang="en">` - Language declaration
- `<main>` - Main content landmark
- Proper heading hierarchy in components

### Font Rendering
```typescript
className="font-sans antialiased"
```
- `antialiased` - Smooth font rendering
- Improves readability on all screens

### Focus Management
- Global outline styles defined
- Keyboard navigation supported
- Focus visible on interactive elements

## Performance Optimizations

### Font Loading
- Self-hosted fonts (no external requests)
- Variable fonts (single file, all weights)
- Automatic subsetting (only Latin characters)
- Font display: swap (prevents invisible text)

### Code Splitting
- Each component is a separate module
- Lazy loading where applicable
- Tree-shaking removes unused code

### Image Optimization
- Next.js Image component used in components
- Automatic format selection (WebP, AVIF)
- Responsive image sizes
- Lazy loading by default

## Future Enhancements

- [ ] Add theme toggle for dark mode
- [ ] Implement persistent cart (localStorage/database)
- [ ] Add loading states for sections
- [ ] Implement error boundaries
- [ ] Add page transitions
- [ ] Integrate authentication layout
- [ ] Add breadcrumb navigation
- [ ] Implement structured data (JSON-LD)

## Notes

- Layout is server component by default
- Page is client component for state management
- All fonts are optimized and self-hosted
- Metadata is static (can be made dynamic per page)
- Analytics runs in production only
