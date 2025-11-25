# Clothing Website Documentation

## 📚 Documentation Overview

This directory contains comprehensive documentation for the clothing website project. Each file covers a specific aspect of the implementation.

## 📖 Documentation Files

### 1. [Project Setup](./01-project-setup.md)
**Topics Covered:**
- Technology stack (Next.js 16, React 19, TailwindCSS 4)
- Dependencies and libraries
- Project structure
- Installation steps
- Configuration files

**Read this first** to understand the foundation of the project.

---

### 2. [Design System](./02-design-system.md)
**Topics Covered:**
- Hippie/Bohemian design philosophy
- Color palette (light & dark mode)
- Typography (Geist + Playfair Display)
- Spacing and layout tokens
- Visual effects and patterns

**Essential for** maintaining design consistency and understanding the aesthetic direction.

---

### 3. [Layout Structure](./03-layout-structure.md)
**Topics Covered:**
- Root layout configuration
- Font loading and optimization
- SEO metadata setup
- Page architecture
- Analytics integration

**Learn about** the overall structure and how pages are organized.

---

### 4. [Hero Section](./04-hero-section.md)
**Topics Covered:**
- Auto-playing carousel implementation
- Ken Burns effect (slow zoom)
- Staggered content animations
- Navigation controls (dots & arrows)
- Responsive behavior

**Deep dive into** the most complex component with detailed animation explanations.

---

### 5. [Product Components](./05-product-components.md)
**Topics Covered:**
- Product card design and interactions
- Image hover effects (dual images)
- Add to cart functionality
- Favorite/wishlist toggle
- Product grid layouts

**Critical for** understanding e-commerce functionality and product display.

---

### 6. [Section Components](./06-section-components.md)
**Topics Covered:**
- New Arrivals section
- Trending Collection section
- Featured Collection section
- Collection Banner
- Shop Section with filtering

**Covers** all major content sections and their implementations.

---

### 7. [Navigation & Footer](./07-navigation-footer.md)
**Topics Covered:**
- Header with sticky navigation
- Mobile responsive menu
- Shopping cart badge
- Footer with links and information
- Responsive behavior

**Essential for** understanding site-wide navigation patterns.

---

### 8. [Animations & Interactions](./08-animations-interactions.md)
**Topics Covered:**
- Custom CSS keyframe animations
- Component-specific animations
- Transition patterns
- Performance considerations
- Accessibility (reduced motion)

**Learn about** all visual effects and how to create smooth, performant animations.

---

### 9. [Responsive Design](./09-responsive-design.md)
**Topics Covered:**
- Mobile-first approach
- Breakpoint system
- Component responsive behavior
- Typography scaling
- Touch interactions

**Critical for** ensuring the site works on all devices.

---

### 10. [State Management](./10-state-management.md)
**Topics Covered:**
- React state patterns
- Cart management
- Data flow architecture
- Props drilling
- Future scaling considerations

**Understand** how data flows through the application and state is managed.

### 12. [Product Implementation Update](./12-product-implementation-update.md)
**Topics Covered:**
- Product card component structure
- Image handling and hover effects
- Wishlist and Cart interactions
- Responsive grid layout

**Reference for** the core product display logic.

---

### 13. [Collection Implementation](./13-collection-implementation.md)
**Topics Covered:**
- Centralized data management (`lib/data.ts`)
- Dynamic routing for collections (`app/collections/[slug]`)
- Header navigation with dropdowns
- Product filtering logic

**Guide to** how the dynamic collection system works.

---

### 14. [Site Enhancements](./14-site-enhancements.md)
**Topics Covered:**
- About Us section & smooth scrolling
- New dedicated pages (New Arrivals, Shop)
- Navigation restructuring
- Layout updates (4 items/row)

**Overview of** recent UI/UX improvements and structural changes.

---

### 15. [Backend Migration Plan](./15-backend-migration-plan.md)
**Topics Covered:**
- Complete Supabase Database Schema (12 tables with SQL)
- Row Level Security (RLS) Policies
- Storage Strategy with bucket configuration
- Admin Dashboard Requirements
- Payment Gateway Integration (PayHere/WebXPay)
- 8-Phase Implementation Plan

**Complete blueprint** for converting the static site to a full-stack e-commerce application.

---

### 16. [Backend Implementation Start](./16-backend-implementation-start.md)
**Topics Covered:**
- Summary of backend plan improvements
- What was fixed and added
- Phase 1 breakdown
- Next immediate steps (Options A-D)

**Action plan** to begin backend implementation.

---

## 🚀 Quick Start Guide

### For New Developers

1. **Start here:** Read [01-project-setup.md](./01-project-setup.md)
2. **Understand design:** Read [02-design-system.md](./02-design-system.md)
3. **Learn structure:** Read [03-layout-structure.md](./03-layout-structure.md)
4. **Explore components:** Read files 04-10 based on what you're working on

### For Designers

1. **Design system:** [02-design-system.md](./02-design-system.md)
2. **Responsive design:** [09-responsive-design.md](./09-responsive-design.md)
3. **Animations:** [08-animations-interactions.md](./08-animations-interactions.md)

### For Product Managers

1. **Project overview:** [01-project-setup.md](./01-project-setup.md)
2. **Features:** [05-product-components.md](./05-product-components.md) & [06-section-components.md](./06-section-components.md)
3. **User experience:** [09-responsive-design.md](./09-responsive-design.md)

---

## 🎨 Design Philosophy

The website follows a **Hippie/Bohemian aesthetic** with:
- Earthy, natural color palette (sage greens, creams, blacks)
- Elegant serif typography (Playfair Display)
- Clean, minimalist layouts
- Smooth, premium animations
- Sustainable, eco-conscious vibe

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────┐
│         app/layout.tsx              │
│    (Root Layout + Fonts)            │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│          app/page.tsx               │
│      (Main Page + State)            │
└─────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌────────┐  ┌─────────┐  ┌────────┐
│ Header │  │  Hero   │  │ Footer │
└────────┘  └─────────┘  └────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│   New    │ │ Trending │ │   Shop   │
│ Arrivals │ │Collection│ │ Section  │
└──────────┘ └──────────┘ └──────────┘
      │            │            │
      └────────────┼────────────┘
                   ▼
           ┌──────────────┐
           │ ProductCard  │
           └──────────────┘
```

---

## 🛠️ Technology Stack

### Core
- **Next.js 16.0.3** - React framework
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety

### Styling
- **TailwindCSS 4.1.9** - Utility-first CSS
- **Custom animations** - CSS keyframes

### UI Components
- **Radix UI** - Accessible components
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel functionality

---

## 📱 Responsive Breakpoints

```
Mobile:    0px   - 639px   (base styles)
Tablet:    640px - 1023px  (sm, md)
Desktop:   1024px+         (lg, xl, 2xl)
```

---

## 🎯 Key Features

✅ **Auto-playing hero carousel** with Ken Burns effect
✅ **Product cards** with hover effects and dual images
✅ **Shopping cart** with live counter
✅ **Mobile responsive** navigation with hamburger menu
✅ **Favorite/wishlist** toggle on products
✅ **Category filtering** in shop section
✅ **Dark mode support** (theme system ready)
✅ **SEO optimized** with proper metadata
✅ **Accessible** with ARIA labels and keyboard navigation
✅ **Performant** with optimized animations

---

## 🔄 Data Flow

```
User Interaction
      ↓
Event Handler (onClick, onHover)
      ↓
Callback Function (onAddToCart)
      ↓
State Update (setCartCount)
      ↓
React Re-render
      ↓
UI Update (badge appears)
```

---

## 📦 Component Library

### Layout Components
- `Header` - Navigation with cart
- `Footer` - Site information
- `HeroSection` - Carousel banner

### Product Components
- `ProductCard` - Individual product display
- `ProductGrid` - Grid layout for products
- `NewArrivals` - New products section
- `TrendingCollection` - Popular products
- `FeaturedCollection` - Curated collections
- `ShopSection` - Filterable products

### UI Components
- 57 Radix UI components in `components/ui/`

---

## 🎨 Color Palette

### Light Mode
- **Background:** `#ffffff` (White)
- **Foreground:** `#000000` (Black)
- **Accent:** `#819A91` (Sage Green)
- **Secondary:** `#A7C1A8` (Light Sage)

### Dark Mode
- **Background:** `#0a0a0a` (Near Black)
- **Foreground:** `#ffffff` (White)
- **Accent:** `#819A91` (Sage Green)
- **Secondary:** `#2C3E36` (Dark Sage)

---

## 🚧 Future Enhancements

### Planned Features
- [ ] User authentication
- [ ] Full shopping cart (add, remove, update)
- [ ] Wishlist persistence
- [ ] Product detail pages
- [ ] Checkout flow
- [ ] Order history
- [ ] Product reviews
- [ ] Search functionality
- [ ] Advanced filtering (price, size, color)
- [ ] Backend integration (Supabase)

### Technical Improvements
- [ ] Add reduced-motion media query
- [ ] Implement lazy loading for images
- [ ] Add error boundaries
- [ ] Implement loading states
- [ ] Add page transitions
- [ ] Optimize bundle size
- [ ] Add E2E tests
- [ ] Implement CI/CD

---

## 📝 Code Style Guidelines

### TypeScript
- Use interfaces for props
- Type all state variables
- Avoid `any` type

### Components
- Use functional components
- Prefer `const` over `function`
- One component per file
- Use descriptive names

### Styling
- Mobile-first approach
- Use Tailwind utilities
- Avoid inline styles
- Group related classes

### State
- Keep state local when possible
- Use functional updates
- Avoid deep nesting
- Single source of truth

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Carousel not auto-playing
- Check if `api` is initialized
- Verify `useEffect` dependencies

**Issue:** Cart count not updating
- Ensure callback is passed correctly
- Check functional update syntax

**Issue:** Mobile menu not closing
- Verify state toggle logic
- Check conditional rendering

**Issue:** Images not loading
- Verify image URLs
- Check network tab for errors

---

## 📚 Additional Resources

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### TailwindCSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)

### React
- [React Docs](https://react.dev)
- [Hooks Reference](https://react.dev/reference/react)

### Radix UI
- [Radix Primitives](https://www.radix-ui.com/primitives)

---

## 🤝 Contributing

When adding new features:
1. Follow existing patterns
2. Update relevant documentation
3. Test on multiple devices
4. Ensure accessibility
5. Maintain design consistency

---

## 📄 License

This project is part of a clothing website implementation.

---

## 📞 Support

For questions about the documentation:
1. Check the relevant documentation file
2. Review code examples
3. Refer to external documentation links

---

**Last Updated:** November 24, 2025

**Documentation Version:** 1.0

**Project Status:** Active Development
