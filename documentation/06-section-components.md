# Section Components Documentation

## Overview
This document covers the main content sections of the website: New Arrivals, Trending Collection, Featured Collection, Collection Banner, and Shop Section.

## Section Architecture

All product sections follow a similar pattern:
1. Section container with padding
2. Header with title and optional description
3. Product grid or content area
4. Responsive layout

## New Arrivals Section

### Location
`components/new-arrivals.tsx`

### Purpose
Showcase the latest products added to the store

### Structure
```typescript
"use client"

interface NewArrivalsProps {
  onAddToCart: () => void
}

export default function NewArrivals({ onAddToCart }: NewArrivalsProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            New Arrivals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fresh pieces for your free-spirited wardrobe
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Key Features
- **Padding:** `py-16` (64px vertical)
- **Max Width:** 1280px (max-w-7xl)
- **Grid:** 1/2/4 columns (mobile/tablet/desktop)
- **Gap:** 24px between products
- **Header:** Centered with serif font
- **Description:** Muted color, max-width for readability

### Sample Products
Products typically include bohemian-themed items:
- Flowing dresses
- Embroidered tops
- Natural fiber clothing
- Earthy-toned accessories

## Trending Collection Section

### Location
`components/trending-collection.tsx`

### Purpose
Display popular and trending products

### Structure
Similar to New Arrivals with different products and messaging:

```typescript
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
        Trending Now
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        What our community is loving this season
      </p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Product cards */}
    </div>
  </div>
</section>
```

### Differences from New Arrivals
- **Background:** Light gray (`bg-muted`) for visual separation
- **Messaging:** Focuses on popularity and trends
- **Products:** Curated based on sales/views

## Featured Collection Section

### Location
`components/featured-collection.tsx`

### Purpose
Highlight curated collections or special categories

### Structure
```typescript
<section className="py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
        Featured Collection
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Handpicked pieces that embody our bohemian spirit
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Collection cards */}
    </div>
  </div>
</section>
```

### Collection Card Structure
```typescript
<div className="group relative overflow-hidden cursor-pointer">
  <div className="aspect-[4/5] relative">
    <img 
      src={collection.image} 
      alt={collection.name}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    
    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
      <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2">
        {collection.name}
      </h3>
      <p className="text-white/90 mb-4">
        {collection.description}
      </p>
      <button className="border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition-all duration-300">
        Explore Collection
      </button>
    </div>
  </div>
</div>
```

### Features
- **Grid:** 2 columns on desktop, 1 on mobile
- **Aspect Ratio:** 4:5 (slightly portrait)
- **Overlay:** Gradient from bottom (black 60% to transparent)
- **Hover Effect:** Image scales to 105%
- **CTA:** Border button that fills on hover

## Collection Banner Section

### Location
`components/collection-banner.tsx`

### Purpose
Full-width promotional banner with call-to-action

### Structure
```typescript
<section className="relative h-[500px] overflow-hidden">
  <div className="absolute inset-0">
    <img 
      src="banner-image.jpg"
      alt="Collection Banner"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-accent/40 mix-blend-multiply" />
  </div>
  
  <div className="relative h-full flex items-center justify-center text-center">
    <div className="max-w-3xl px-4">
      <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
        Sustainable Fashion
      </h2>
      <p className="text-xl text-white/90 mb-8">
        Ethically made, beautifully crafted
      </p>
      <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-white/90 transition-all duration-300">
        Learn More
      </button>
    </div>
  </div>
</section>
```

### Features
- **Height:** Fixed 500px
- **Layout:** Full-width with centered content
- **Overlay:** Sage green tint (40% opacity)
- **Typography:** Large serif headings
- **CTA:** Prominent white button

### Use Cases
- Seasonal promotions
- Brand storytelling
- Collection launches
- Sustainability messaging
- Sale announcements

## Shop Section

### Location
`components/shop-section.tsx`

### Purpose
Additional product showcase with category filtering

### Structure
```typescript
"use client"

import { useState } from "react"

export default function ShopSection({ onAddToCart }: { onAddToCart: () => void }) {
  const [activeCategory, setActiveCategory] = useState("All")
  
  const categories = ["All", "Dresses", "Tops", "Bottoms", "Accessories"]
  
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Filtered products */}
        </div>
      </div>
    </section>
  )
}
```

### Features
- **Category Filter:** Interactive buttons
- **Active State:** Black background for selected category
- **Hover State:** Sage green background
- **Dynamic Content:** Products filter based on selection
- **State Management:** Local state for active category

## Common Section Patterns

### Section Container
```typescript
<section className="py-16 px-4 sm:px-6 lg:px-8">
```
- Vertical padding: 64px
- Horizontal padding: Responsive (16px → 24px → 32px)

### Content Container
```typescript
<div className="max-w-7xl mx-auto">
```
- Max width: 1280px
- Centered: `mx-auto`

### Section Header
```typescript
<div className="text-center mb-12">
  <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
    {title}
  </h2>
  <p className="text-muted-foreground max-w-2xl mx-auto">
    {description}
  </p>
</div>
```
- Centered text
- Serif font for headings
- Muted description
- Bottom margin: 48px

### Product Grid
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```
- Responsive columns: 1 → 2 → 4
- Gap: 24px

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Reduced padding
- Smaller typography
- Stacked elements

### Tablet (640px - 1023px)
- Two column grid
- Medium padding
- Balanced typography

### Desktop (≥ 1024px)
- Four column grid
- Full padding
- Large typography
- Optimal spacing

## Accessibility

### Semantic HTML
```typescript
<section> // Landmark
<h2>      // Heading hierarchy
<button>  // Interactive elements
```

### Focus States
- All interactive elements have visible focus
- Keyboard navigation supported
- Tab order logical

### ARIA Labels
- Descriptive button text
- Image alt text
- Section landmarks

## Performance

### Image Optimization
- Use Next.js Image component
- Lazy load below-fold images
- Responsive image sizes
- WebP format with fallbacks

### Code Splitting
- Each section is a separate component
- Lazy load sections if needed
- Tree-shaking removes unused code

## Future Enhancements

- [ ] Add infinite scroll/pagination
- [ ] Implement product filtering (price, size, color)
- [ ] Add sorting options (price, popularity, newest)
- [ ] Create collection detail pages
- [ ] Add "Load More" functionality
- [ ] Implement product search
- [ ] Add breadcrumb navigation
- [ ] Create category landing pages
- [ ] Add product comparison
- [ ] Implement wishlist integration
- [ ] Add social proof (reviews, ratings)
- [ ] Create personalized recommendations

## Notes

- All sections use consistent spacing
- Product data should come from API/CMS
- Category filtering can be server-side
- Consider SEO for collection pages
- Images should be high-quality and optimized
- Maintain consistent aspect ratios
- Test with various product counts
- Ensure graceful handling of empty states
