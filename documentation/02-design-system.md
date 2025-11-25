# Design System Documentation

## Overview
The clothing website uses a **Hippie/Bohemian-inspired design system** with earthy tones, natural aesthetics, and a focus on women's clothing. The design emphasizes a free-spirited, sustainable, and natural look.

## Design Philosophy

### Core Principles
1. **Natural & Earthy** - Colors inspired by nature (sage green, cream, earth tones)
2. **Minimalist Elegance** - Clean layouts with breathing room
3. **Premium Feel** - Luxury aesthetic with sophisticated typography
4. **Sustainable Vibe** - Reflects eco-conscious values
5. **Bohemian Spirit** - Free-flowing, artistic, and unconventional

## Color Palette

### Light Mode Colors

#### Primary Colors
```css
--background: #ffffff        /* Pure white background */
--foreground: #000000        /* Black text */
--primary: #000000           /* Black for main actions */
--primary-foreground: #ffffff /* White text on black */
```

#### Accent Colors (Hippie/Bohemian Theme)
```css
--secondary: #A7C1A8         /* Light Sage Green */
--secondary-foreground: #000000
--accent: #819A91            /* Darker Sage Green */
--accent-foreground: #ffffff
```

#### Neutral Colors
```css
--muted: #f5f5f5             /* Light gray backgrounds */
--muted-foreground: #737373  /* Gray text */
--border: #e5e5e5            /* Subtle borders */
```

#### Utility Colors
```css
--destructive: #dc2626       /* Red for errors/delete */
--destructive-foreground: #ffffff
--ring: #000000              /* Focus ring color */
```

### Dark Mode Colors

#### Primary Colors
```css
--background: #0a0a0a        /* Near black */
--foreground: #ffffff        /* White text */
--primary: #ffffff           /* White for main actions */
--primary-foreground: #000000
```

#### Accent Colors
```css
--secondary: #2C3E36         /* Darker Sage (muted) */
--secondary-foreground: #ffffff
--accent: #819A91            /* Sage Green (same as light) */
--accent-foreground: #ffffff
```

#### Neutral Colors
```css
--muted: #262626             /* Dark gray */
--muted-foreground: #a3a3a3  /* Light gray text */
--border: #262626            /* Dark borders */
```

## Typography

### Font Families

#### Primary Font - Geist (Sans-Serif)
- **Usage:** Body text, UI elements, navigation
- **Characteristics:** Modern, clean, highly readable
- **Weights:** Variable font with full weight range
- **Loading:** Optimized via `next/font/google`

```typescript
import { Geist } from "next/font/google"
const geist = Geist({ subsets: ["latin"] })
```

#### Display Font - Playfair Display (Serif)
- **Usage:** Headings, hero titles, section headers
- **Characteristics:** Elegant, sophisticated, high-contrast
- **Weights:** Variable font
- **CSS Variable:** `--font-serif`

```typescript
import { Playfair_Display } from "next/font/google"
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif" 
})
```

### Typography Scale
```css
/* Headings use font-serif (Playfair Display) */
.font-serif { font-family: var(--font-serif); }

/* Body uses font-sans (Geist) */
.font-sans { font-family: var(--font-sans); }
```

### Text Hierarchy
- **Hero Titles:** `text-5xl md:text-7xl font-serif font-bold`
- **Section Headers:** `text-3xl md:text-4xl font-serif`
- **Product Names:** `font-medium text-primary`
- **Body Text:** `text-base font-sans`
- **Small Text:** `text-xs uppercase tracking-wider`

## Spacing & Layout

### Border Radius
```css
--radius: 0.5rem             /* Base radius (8px) */
--radius-sm: calc(var(--radius) - 2px)  /* 6px */
--radius-md: var(--radius)               /* 8px */
--radius-lg: calc(var(--radius) + 4px)   /* 12px */
--radius-xl: calc(var(--radius) + 8px)   /* 16px */
```

### Container Widths
- **Max Width:** `max-w-7xl` (1280px)
- **Padding:** `px-4 sm:px-6 lg:px-8`
- **Responsive breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)

## Component Styling Patterns

### Product Cards
- **Aspect Ratio:** 2:3 (portrait)
- **Background:** `bg-secondary` (light sage green)
- **Hover Effect:** Image scale (1.05), overlay appears
- **Transition:** `duration-300` for smooth interactions

### Buttons
- **Primary:** Black background, white text
- **Hover:** Sage green background
- **Style:** Sharp corners (minimal border radius)
- **Padding:** `px-6 py-3` for standard buttons

### Images
- **Object Fit:** `object-cover` for consistent sizing
- **Transitions:** `duration-500` for image changes
- **Hover Scale:** `group-hover:scale-105`

## Visual Effects

### Overlays
```css
/* Dark overlay on hover */
bg-primary/20 mix-blend-multiply
```

### Shadows
```css
/* Subtle elevation */
shadow-lg
```

### Backdrop Effects
```css
/* Glassmorphism */
bg-white/90 backdrop-blur-sm
```

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Primary text (#000000) on white background: 21:1 ratio
- Accent colors tested for readability

### Focus States
- Visible focus rings on all interactive elements
- Color: `outline-ring/50`

### Semantic Colors
- Destructive actions use red (#dc2626)
- Success states use green tones
- Information uses neutral grays

## Design Tokens Usage

### In Components
```tsx
// Using design tokens
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="bg-secondary hover:bg-accent"
```

### Custom Properties
All colors are available as CSS custom properties and Tailwind classes:
- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary`
- `bg-secondary`, `bg-accent`
- `border-border`, `ring-ring`

## Brand Identity

### Visual Language
- **Minimalist:** Clean layouts, ample white space
- **Natural:** Earthy color palette
- **Premium:** High-quality imagery, elegant typography
- **Bohemian:** Artistic, free-spirited aesthetic

### Imagery Guidelines
- High-quality lifestyle photography
- Natural lighting preferred
- Models in natural poses
- Outdoor/nature settings when possible
- Muted, earthy color grading

## Responsive Design Approach
- **Mobile-first:** Base styles for mobile, scale up
- **Breakpoints:** sm, md, lg, xl
- **Flexible layouts:** Grid and flexbox
- **Fluid typography:** Responsive font sizes

## Future Considerations
- [ ] Add custom color swatches for product variants
- [ ] Implement theme customization options
- [ ] Create design system documentation site
- [ ] Add more brand-specific patterns
- [ ] Consider seasonal color palette variations
