# Hero Section Documentation

## Overview
The hero section is a full-width, auto-playing carousel showcasing the brand's aesthetic with the Hippie/Bohemian theme. It features smooth transitions, Ken Burns effect, and elegant content animations.

## Component Location
`components/hero-section.tsx`

## Key Features

✅ **Auto-playing carousel** with 6-second intervals
✅ **Ken Burns effect** - Slow zoom on images
✅ **Staggered content animations** - Title, subtitle, CTA appear sequentially
✅ **Custom navigation** - Dots and arrow controls
✅ **Gradient overlays** - Sage green tinted overlay
✅ **Responsive design** - Adapts to all screen sizes
✅ **Loop functionality** - Infinite carousel loop

## Implementation Details

### Dependencies
```typescript
import * as React from "react"
import { useEffect, useState, useCallback } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Slide Data Structure
```typescript
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&q=80",
    title: "Free Spirit",
    subtitle: "Embrace your inner bohemian with our collection of flowing fabrics and earthy tones.",
    cta: "Shop the Look"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=1920&q=80",
    title: "Natural Beauty",
    subtitle: "Handcrafted pieces made from sustainable materials for the conscious soul.",
    cta: "Discover Nature"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1920&q=80",
    title: "Boho Chic",
    subtitle: "Timeless patterns and vintage-inspired designs for every adventure.",
    cta: "View Collection"
  }
]
```

**Slide Properties:**
- `id` - Unique identifier
- `image` - High-quality Unsplash image URL (1920px wide)
- `title` - Main heading (Hippie/Bohemian themed)
- `subtitle` - Descriptive text emphasizing natural/sustainable values
- `cta` - Call-to-action button text

## State Management

### Carousel API State
```typescript
const [api, setApi] = useState<CarouselApi>()
const [current, setCurrent] = useState(0)
const [count, setCount] = useState(0)
```

- `api` - Embla Carousel API instance
- `current` - Current slide index
- `count` - Total number of slides

### Carousel Initialization
```typescript
useEffect(() => {
  if (!api) return

  setCount(api.scrollSnapList().length)
  setCurrent(api.selectedScrollSnap())

  api.on("select", () => {
    setCurrent(api.selectedScrollSnap())
  })
}, [api])
```

## Auto-play Functionality

```typescript
useEffect(() => {
  if (!api) return

  const intervalId = setInterval(() => {
    api.scrollNext()
  }, 6000)

  return () => clearInterval(intervalId)
}, [api])
```

**Configuration:**
- Interval: 6000ms (6 seconds)
- Action: Scroll to next slide
- Cleanup: Clear interval on unmount

## Visual Effects

### Ken Burns Effect
```typescript
className={cn(
  "w-full h-full object-cover transition-transform duration-[10000ms] ease-out",
  index === current ? "scale-110" : "scale-100"
)}
```

**How it works:**
- Active slide scales from 100% to 110%
- Duration: 10 seconds (longer than slide duration)
- Creates subtle zoom-in effect
- Easing: ease-out for smooth motion

### Gradient Overlay
```typescript
<div className="absolute inset-0 bg-gradient-to-r from-accent/60 via-secondary/40 to-transparent mix-blend-multiply" />
```

**Styling:**
- Gradient: Left to right
- Colors: Sage green (accent) to light sage (secondary)
- Opacity: 60% to 40% to transparent
- Blend mode: multiply (darkens image)
- Effect: Earthy, natural tint

### Content Animations

#### Title Animation
```typescript
<span className={cn(
  "block transform transition-all duration-700 delay-300",
  index === current ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
)}>
  {slide.title}
</span>
```

**Animation sequence:**
- Delay: 300ms
- Duration: 700ms
- Effect: Slide up from bottom + fade in
- Hidden state: Translated down 100%, opacity 0

#### Subtitle Animation
```typescript
className={cn(
  "text-lg md:text-xl text-white/90 mb-8 leading-relaxed transform transition-all duration-700 delay-500",
  index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
)}
```

**Animation sequence:**
- Delay: 500ms (after title)
- Duration: 700ms
- Effect: Slide up + fade in
- Smaller translation distance (8px vs 100%)

#### CTA Button Animation
```typescript
className={cn(
  "transform transition-all duration-700 delay-700",
  index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
)}
```

**Animation sequence:**
- Delay: 700ms (after subtitle)
- Duration: 700ms
- Effect: Slide up + fade in
- Appears last in sequence

## Navigation Controls

### Dot Indicators
```typescript
<div className="flex gap-3">
  {Array.from({ length: count }).map((_, i) => (
    <button
      key={i}
      onClick={() => scrollTo(i)}
      className={cn(
        "w-12 h-1 transition-all duration-300",
        i === current ? "bg-white" : "bg-white/30 hover:bg-white/50"
      )}
      aria-label={`Go to slide ${i + 1}`}
    />
  ))}
</div>
```

**Features:**
- Width: 48px (w-12)
- Height: 4px (h-1)
- Active: Solid white
- Inactive: 30% opacity white
- Hover: 50% opacity white
- Accessible labels

### Arrow Navigation
```typescript
<button
  onClick={() => api?.scrollPrev()}
  className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
>
  <svg><!-- Left arrow SVG --></svg>
</button>
```

**Styling:**
- Size: 48px × 48px
- Shape: Circular
- Border: White 30% opacity
- Hover: White background, black icon
- Transition: 300ms

## Responsive Design

### Height Configuration
```typescript
className="relative h-[45vh] min-h-[800px] w-full overflow-hidden bg-background"
```

**Breakpoints:**
- Default: 45vh (45% of viewport height)
- Minimum: 800px (ensures adequate space)
- Width: 100% (full width)

### Typography Scaling
```typescript
// Title
className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"

// Subtitle
className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
```

**Mobile (< 768px):**
- Title: 3rem (48px)
- Subtitle: 1.125rem (18px)

**Desktop (≥ 768px):**
- Title: 4.5rem (72px)
- Subtitle: 1.25rem (20px)

### Content Padding
```typescript
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
  <div className="max-w-2xl">
    {/* Content */}
  </div>
</div>
```

**Padding:**
- Mobile: 1rem (16px)
- Small: 1.5rem (24px)
- Large: 2rem (32px)

**Content width:**
- Max container: 1280px (max-w-7xl)
- Content area: 672px (max-w-2xl)

## Carousel Configuration

```typescript
<Carousel
  setApi={setApi}
  opts={{
    loop: true,
    duration: 60
  }}
  className="w-full h-full [&_[data-slot=carousel-content]]:h-full"
>
```

**Options:**
- `loop: true` - Infinite looping
- `duration: 60` - Transition duration (60ms for smooth scroll)
- Custom class: Full height carousel content

## Accessibility

### ARIA Labels
```typescript
aria-label={`Go to slide ${i + 1}`}
```
- Descriptive labels for screen readers
- Indicates slide number

### Keyboard Navigation
- Arrow buttons are keyboard accessible
- Focus states visible
- Tab navigation supported

### Semantic HTML
```typescript
<section className="...">
```
- Proper section landmark
- Heading hierarchy maintained

## Performance Considerations

### Image Optimization
- Images loaded from Unsplash CDN
- Quality parameter: `q=80` (good balance)
- Width: 1920px (suitable for large screens)
- Format: Auto-optimized by Unsplash

### Animation Performance
- CSS transforms (GPU-accelerated)
- Opacity transitions (efficient)
- No layout thrashing
- Will-change not needed (transforms are optimized)

## Theming

### Color Usage
- Overlay: `accent` and `secondary` colors
- Text: White for contrast
- Buttons: White background on hover
- Matches Hippie/Bohemian aesthetic

## Future Enhancements

- [ ] Add video background support
- [ ] Implement parallax scrolling
- [ ] Add gesture controls for mobile
- [ ] Lazy load images
- [ ] Add progress bar for auto-play
- [ ] Implement pause on hover
- [ ] Add slide transition effects (fade, slide)
- [ ] Support for multiple CTAs per slide
- [ ] Add analytics tracking for slide views

## Notes

- Component is client-side only ("use client")
- Uses Embla Carousel under the hood
- Images should be high-quality (1920px+)
- Overlay colors can be customized per slide
- Auto-play can be disabled by removing the effect
