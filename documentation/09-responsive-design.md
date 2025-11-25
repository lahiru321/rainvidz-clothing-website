# Responsive Design Documentation

## Overview
This document covers the responsive design strategy, breakpoint system, and mobile-first approach used throughout the clothing website.

## Design Philosophy

### Mobile-First Approach
The website is built using a **mobile-first** strategy:
1. Base styles target mobile devices (320px+)
2. Styles progressively enhance for larger screens
3. Content is accessible on all device sizes
4. Touch-friendly interactions on mobile

### Responsive Principles
- **Fluid layouts** - Flexible containers that adapt
- **Flexible images** - Scale with container size
- **Media queries** - Breakpoint-specific styles
- **Relative units** - rem, em, %, vh/vw
- **Content priority** - Most important content first

## Breakpoint System

### TailwindCSS Breakpoints
```css
/* Default (Mobile) */
/* 0px - 639px */

sm: 640px   /* Small tablets, large phones */
md: 768px   /* Tablets, small laptops */
lg: 1024px  /* Laptops, desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large screens */
```

### Usage Pattern
```typescript
// Mobile-first approach
className="text-sm md:text-base lg:text-lg"

// Reads as:
// - Mobile: text-sm (14px)
// - Tablet (768px+): text-base (16px)
// - Desktop (1024px+): text-lg (18px)
```

## Layout Patterns

### Container Pattern
```typescript
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**Responsive padding:**
- Mobile (< 640px): 16px (px-4)
- Small (640px+): 24px (sm:px-6)
- Large (1024px+): 32px (lg:px-8)

**Max width:**
- All screens: 1280px (max-w-7xl)
- Centered: mx-auto

### Section Padding
```typescript
<section className="py-12 md:py-16 lg:py-20">
```

**Vertical spacing:**
- Mobile: 48px (py-12)
- Tablet: 64px (md:py-16)
- Desktop: 80px (lg:py-20)

## Component Responsive Behavior

### Header Navigation

#### Mobile (< 768px)
```typescript
// Logo
className="text-2xl font-serif"

// Height
className="h-16"

// Desktop nav hidden
className="hidden md:flex"

// Mobile menu visible
className="md:hidden"
```

**Features:**
- Smaller logo (24px)
- Reduced height (64px)
- Hamburger menu
- Vertical navigation drawer

#### Desktop (≥ 768px)
```typescript
// Logo
className="md:text-3xl font-serif"

// Height
className="md:h-20"

// Desktop nav visible
className="hidden md:flex"

// Mobile menu hidden
className="md:hidden"
```

**Features:**
- Larger logo (36px)
- Increased height (80px)
- Horizontal navigation
- No hamburger menu

### Hero Section

#### Mobile
```typescript
// Height
className="h-[45vh] min-h-[800px]"

// Title
className="text-5xl font-serif"

// Subtitle
className="text-lg"

// Padding
className="px-4"
```

**Adjustments:**
- Smaller typography
- Reduced padding
- Maintained minimum height
- Centered content

#### Desktop
```typescript
// Title
className="md:text-7xl font-serif"

// Subtitle
className="md:text-xl"

// Padding
className="lg:px-8"
```

**Enhancements:**
- Larger typography (72px title)
- Increased padding
- Better visual hierarchy

### Product Grid

#### Mobile (< 640px)
```typescript
className="grid grid-cols-1 gap-6"
```
- **Columns:** 1
- **Gap:** 24px
- **Layout:** Stacked vertically

#### Tablet (640px - 1023px)
```typescript
className="grid grid-cols-1 sm:grid-cols-2 gap-6"
```
- **Columns:** 2
- **Gap:** 24px
- **Layout:** Side by side

#### Desktop (≥ 1024px)
```typescript
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
```
- **Columns:** 4
- **Gap:** 24px
- **Layout:** Full grid

### Product Card

#### Image Aspect Ratio
```typescript
className="aspect-[2/3]"
```
- **Ratio:** 2:3 (portrait)
- **Consistent:** All screen sizes
- **Maintains:** Proportions

#### Typography
```typescript
// Category
className="text-xs"  // Fixed size

// Name
className="font-medium"  // Fixed size

// Price
className="text-lg"  // Fixed size
```
- **No responsive scaling** - Maintains consistency
- **Readable** at all sizes

### Footer

#### Mobile (< 768px)
```typescript
className="grid grid-cols-1 gap-8"
```
- **Columns:** 1
- **Layout:** Stacked sections
- **Gap:** 32px

#### Desktop (≥ 768px)
```typescript
className="grid grid-cols-1 md:grid-cols-4 gap-8"
```
- **Columns:** 4
- **Layout:** Horizontal sections
- **Gap:** 32px

#### Bottom Section
```typescript
className="flex flex-col md:flex-row items-center justify-between"
```
- **Mobile:** Vertical (column)
- **Desktop:** Horizontal (row)
- **Alignment:** Centered → Space between

## Typography Scaling

### Heading Sizes

#### H1 (Hero Titles)
```typescript
className="text-5xl md:text-7xl"
```
- Mobile: 48px
- Desktop: 72px
- Ratio: 1.5x increase

#### H2 (Section Headers)
```typescript
className="text-3xl md:text-4xl"
```
- Mobile: 30px
- Desktop: 36px
- Ratio: 1.2x increase

#### H3 (Subsections)
```typescript
className="text-2xl md:text-3xl"
```
- Mobile: 24px
- Desktop: 30px
- Ratio: 1.25x increase

### Body Text
```typescript
className="text-base md:text-lg"
```
- Mobile: 16px
- Desktop: 18px
- Subtle increase for readability

### Small Text
```typescript
className="text-sm md:text-base"
```
- Mobile: 14px
- Desktop: 16px
- Maintains legibility

## Image Handling

### Responsive Images
```typescript
<img 
  src="image.jpg"
  className="w-full h-full object-cover"
  alt="Description"
/>
```

**Properties:**
- `w-full` - 100% width of container
- `h-full` - 100% height of container
- `object-cover` - Maintains aspect ratio, fills space

### Next.js Image Component
```typescript
import Image from "next/image"

<Image
  src="/image.jpg"
  alt="Description"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Benefits:**
- Automatic optimization
- Responsive srcset
- Lazy loading
- WebP/AVIF support

## Touch Interactions

### Mobile-Friendly Targets
```typescript
// Minimum touch target: 44px × 44px
className="p-2"  // 8px padding + 20px icon = 36px (increase if needed)
```

**Guidelines:**
- Buttons: Minimum 44px × 44px
- Links: Adequate padding
- Icons: Large enough to tap
- Spacing: Prevent accidental taps

### Hover vs Touch
```typescript
// Desktop hover
className="hover:bg-accent"

// Touch feedback
className="active:scale-95"
```

**Considerations:**
- Hover states don't work on touch
- Use active states for feedback
- Consider touch-specific interactions

## Viewport Units

### Height
```typescript
// Hero section
className="h-[45vh] min-h-[800px]"
```
- `vh` - Viewport height percentage
- `min-h` - Ensures minimum height
- Prevents too-small sections on mobile

### Width
```typescript
className="w-screen"  // 100vw (full viewport width)
```
- Use sparingly (can cause horizontal scroll)
- Prefer `w-full` for container width

## Responsive Utilities

### Display
```typescript
className="hidden md:block"     // Hide on mobile, show on desktop
className="block md:hidden"     // Show on mobile, hide on desktop
className="hidden md:flex"      // Hidden on mobile, flex on desktop
```

### Flex Direction
```typescript
className="flex flex-col md:flex-row"
```
- Mobile: Vertical stack
- Desktop: Horizontal row

### Text Alignment
```typescript
className="text-center md:text-left"
```
- Mobile: Centered
- Desktop: Left-aligned

### Spacing
```typescript
className="gap-4 md:gap-6 lg:gap-8"
```
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

## Common Responsive Patterns

### Card Grid
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```
- Mobile: 1 column
- Small: 2 columns
- Large: 3 columns
- XL: 4 columns

### Two-Column Layout
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
```
- Mobile: Stacked
- Desktop: Side by side

### Sidebar Layout
```typescript
<div className="flex flex-col lg:flex-row gap-8">
  <aside className="lg:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```
- Mobile: Sidebar on top
- Desktop: Sidebar on left, fixed width

## Testing Breakpoints

### Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test various device sizes
4. Check responsive behavior

### Common Test Sizes
- **iPhone SE:** 375px × 667px
- **iPhone 12 Pro:** 390px × 844px
- **iPad:** 768px × 1024px
- **iPad Pro:** 1024px × 1366px
- **Desktop:** 1920px × 1080px

## Performance Considerations

### Mobile Performance
- Optimize images for mobile
- Reduce animation complexity
- Minimize JavaScript
- Use lazy loading
- Compress assets

### Desktop Performance
- Leverage larger screens
- More complex animations acceptable
- Higher quality images
- Richer interactions

## Accessibility

### Responsive Text
- Minimum 16px body text on mobile
- Adequate line height (1.5+)
- Sufficient contrast ratios
- Scalable text (no fixed px for body)

### Touch Targets
- Minimum 44px × 44px
- Adequate spacing between targets
- Clear focus indicators
- Keyboard navigation support

## Future Enhancements

- [ ] Add container queries (CSS feature)
- [ ] Implement fluid typography (clamp)
- [ ] Add orientation-specific styles
- [ ] Create print stylesheet
- [ ] Optimize for foldable devices
- [ ] Add responsive tables
- [ ] Implement adaptive images (art direction)
- [ ] Create responsive navigation mega menu
- [ ] Add responsive video embeds
- [ ] Optimize for high-DPI displays

## Best Practices

1. **Test on real devices** - Emulators aren't perfect
2. **Mobile-first CSS** - Easier to enhance than reduce
3. **Flexible units** - Use rem, em, % over px
4. **Content-first** - Design around content needs
5. **Performance** - Mobile users often on slower connections
6. **Touch-friendly** - Large targets, clear feedback
7. **Readable text** - Adequate size and contrast
8. **Flexible images** - Scale with containers
9. **Consistent spacing** - Use design system
10. **Test thoroughly** - Multiple devices and browsers

## Notes

- All components are responsive by default
- Breakpoints align with common device sizes
- Mobile-first approach ensures accessibility
- Tailwind utilities make responsive design easy
- Test on actual devices when possible
- Consider network conditions (mobile data)
- Optimize images for different screen sizes
- Use Next.js Image for automatic optimization
