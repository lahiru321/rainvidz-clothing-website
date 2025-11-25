# Project Setup Documentation

## Overview
This document details the initial setup and configuration of the clothing website project, a modern e-commerce platform built with Next.js 16, React 19, and TailwindCSS 4.

## Technology Stack

### Core Framework
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety and developer experience

### Styling
- **TailwindCSS 4.1.9** - Utility-first CSS framework
- **PostCSS 8.5** - CSS processing
- **tailwindcss-animate 1.0.7** - Animation utilities
- **tw-animate-css 1.3.3** - Additional animation library

### UI Components
- **Radix UI** - Comprehensive component library including:
  - Dialog, Dropdown Menu, Navigation Menu
  - Accordion, Tabs, Toast notifications
  - Form elements (Select, Checkbox, Radio, Slider)
  - Avatar, Tooltip, Hover Card
  - And 20+ other accessible components

### Additional Libraries
- **lucide-react 0.454.0** - Icon library
- **embla-carousel-react 8.5.1** - Carousel functionality
- **next-themes 0.4.6** - Dark mode support
- **react-hook-form 7.60.0** - Form handling
- **zod 3.25.76** - Schema validation
- **@vercel/analytics** - Analytics integration
- **class-variance-authority 0.7.1** - Component variant management
- **clsx 2.1.1** & **tailwind-merge 2.5.5** - Utility class management

## Project Structure

```
clothing wesite/
├── app/
│   ├── globals.css          # Global styles and theme variables
│   ├── layout.tsx            # Root layout with fonts and metadata
│   └── page.tsx              # Home page component
├── components/
│   ├── ui/                   # Shadcn/Radix UI components (57 files)
│   ├── header.tsx            # Navigation header
│   ├── hero-section.tsx      # Hero carousel
│   ├── product-card.tsx      # Product display card
│   ├── new-arrivals.tsx      # New arrivals section
│   ├── trending-collection.tsx
│   ├── featured-collection.tsx
│   ├── collection-banner.tsx
│   ├── shop-section.tsx
│   └── footer.tsx
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
├── public/                   # Static assets
├── styles/                   # Additional stylesheets
└── documentation/            # Project documentation
```

## Configuration Files

### package.json
- **Scripts:**
  - `npm run dev` - Development server
  - `npm run build` - Production build
  - `npm start` - Start production server
  - `npm run lint` - ESLint code checking

### next.config.mjs
- Basic Next.js configuration
- Image optimization settings

### tsconfig.json
- TypeScript compiler options
- Path aliases configured (@/ for root imports)

### components.json
- Shadcn UI configuration
- Component generation settings

### postcss.config.mjs
- TailwindCSS plugin configuration
- PostCSS processing setup

## Installation Steps

1. **Initialize Next.js Project:**
   ```bash
   npx create-next-app@latest clothing-wesite --typescript
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Install UI Components:**
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add [component-name]
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3000`

## Key Features Enabled

✅ **TypeScript** - Full type safety across the application
✅ **App Router** - Next.js 13+ routing system
✅ **Server Components** - React Server Components by default
✅ **Client Components** - Interactive components with "use client"
✅ **Font Optimization** - Automatic font loading and optimization
✅ **Image Optimization** - Next.js Image component
✅ **Analytics** - Vercel Analytics integration
✅ **Dark Mode** - Theme switching capability
✅ **Responsive Design** - Mobile-first approach
✅ **Accessibility** - Radix UI accessible components

## Environment Setup

### Node Version
- Recommended: Node.js 18.x or higher
- Package Manager: npm (can also use pnpm or yarn)

### Development Tools
- **VS Code** recommended with extensions:
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## Next Steps
After initial setup, the project was configured with:
1. Custom design system (see `02-design-system.md`)
2. Layout and typography configuration (see `03-layout-structure.md`)
3. Component development (see subsequent documentation files)

## Notes
- Project uses TailwindCSS v4 (latest version with new features)
- React 19 includes new features like Server Components
- All UI components are built on Radix UI for accessibility
- The project follows Next.js App Router conventions
