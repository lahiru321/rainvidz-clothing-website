# Animations & Interactions Documentation

## Overview
This document covers all custom animations, transitions, and interactive effects used throughout the website to create a premium, engaging user experience.

## Custom Animations (globals.css)

### Location
`app/globals.css` - Lines 136-214

### Animation Definitions

## 1. Fade In Up Animation

### Keyframes
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Usage Class
```css
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
```

**Properties:**
- Duration: 800ms
- Easing: ease-out (fast start, slow end)
- Effect: Slides up 20px while fading in
- Use case: Content reveals, section entries

**Applied to:**
- Mobile menu navigation
- Section content on scroll (can be added)
- Modal/dialog appearances

## 2. Scale Image Hover Animation

### Keyframes
```css
@keyframes scaleImageHover {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}
```

### Usage Classes
```css
.animate-scale-image-hover {
  animation: scaleImageHover 0.5s ease-out forwards;
}

.group:hover .group-hover\:animate-scale-image {
  animation: scaleImageHover 0.5s ease-out forwards;
}
```

**Properties:**
- Duration: 500ms
- Easing: ease-out
- Fill mode: forwards (maintains end state)
- Effect: Scales from 100% to 105%
- Use case: Product images, collection cards

**Applied to:**
- Product card images
- Collection banner images
- Featured collection cards
- Hero section images

## 3. Slide From Left Animation

### Keyframes
```css
@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Usage Class
```css
.animate-slide-left {
  animation: slideFromLeft 0.6s ease-out;
}
```

**Properties:**
- Duration: 600ms
- Easing: ease-out
- Effect: Slides in from left 30px while fading
- Use case: Staggered content reveals

**Potential uses:**
- Product cards entering viewport
- Section headers
- List items

## 4. Slide From Right Animation

### Keyframes
```css
@keyframes slideFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Usage Class
```css
.animate-slide-right {
  animation: slideFromRight 0.6s ease-out;
}
```

**Properties:**
- Duration: 600ms
- Easing: ease-out
- Effect: Slides in from right 30px while fading
- Use case: Alternating content reveals

**Potential uses:**
- Opposite side of slide-left
- Alternating product cards
- Sidebar content

## 5. Fade In Animation

### Keyframes
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### Usage Class
```css
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}
```

**Properties:**
- Duration: 1000ms (1 second)
- Easing: ease-out
- Effect: Simple opacity transition
- Use case: Gentle reveals, overlays

**Applied to:**
- Page transitions
- Overlay backgrounds
- Subtle content reveals

## Component-Specific Animations

### Hero Section Animations

#### Ken Burns Effect
```typescript
className={cn(
  "transition-transform duration-[10000ms] ease-out",
  index === current ? "scale-110" : "scale-100"
)}
```

**Properties:**
- Duration: 10 seconds
- Easing: ease-out
- Effect: Slow zoom from 100% to 110%
- Trigger: When slide becomes active

#### Title Animation
```typescript
className={cn(
  "transform transition-all duration-700 delay-300",
  index === current ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
)}
```

**Sequence:**
1. Delay: 300ms
2. Duration: 700ms
3. Effect: Slide up from bottom + fade in
4. Initial state: Translated down 100%

#### Subtitle Animation
```typescript
className={cn(
  "transform transition-all duration-700 delay-500",
  index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
)}
```

**Sequence:**
1. Delay: 500ms (200ms after title)
2. Duration: 700ms
3. Effect: Slide up 8px + fade in
4. Smaller translation for subtlety

#### CTA Button Animation
```typescript
className={cn(
  "transform transition-all duration-700 delay-700",
  index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
)}
```

**Sequence:**
1. Delay: 700ms (200ms after subtitle)
2. Duration: 700ms
3. Effect: Slide up 8px + fade in
4. Appears last in sequence

### Product Card Animations

#### Image Transition
```css
transition-transform duration-500 group-hover:scale-105
```

**Properties:**
- Duration: 500ms
- Effect: Scale to 105% on hover
- Trigger: Parent group hover

#### Overlay Fade
```typescript
className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
```

**Properties:**
- Duration: 300ms
- Effect: Fade in/out
- Trigger: Hover state

#### Button Appearance
```typescript
className={`transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
```

**Properties:**
- Duration: 300ms
- Properties: All (opacity, transform)
- Effect: Fade in with scale

#### Favorite Button
```css
transition-all duration-300 hover:scale-110 active:scale-95
```

**States:**
- Default: 100% scale
- Hover: 110% scale
- Active (click): 95% scale
- Duration: 300ms

#### Heart Icon Fill
```typescript
className={`transition-colors duration-300 ${isFavorited ? "fill-accent text-accent" : "text-foreground"}`}
```

**Properties:**
- Duration: 300ms
- Property: Colors (fill and stroke)
- Effect: Fills with sage green when favorited

### Navigation Animations

#### Link Hover
```css
transition-colors duration-300
```

**Properties:**
- Duration: 300ms
- Property: Color
- Effect: Changes to sage green

#### Mobile Menu
```css
animate-fade-in-up
```

**Properties:**
- Uses custom fadeInUp animation
- Duration: 800ms
- Effect: Slides up while fading in

#### Cart Badge
```css
animate-pulse
```

**Properties:**
- Built-in Tailwind animation
- Infinite loop
- Effect: Pulsing opacity
- Draws attention to cart count

### Button Animations

#### Primary Button Hover
```css
hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105
```

**Properties:**
- Duration: 300ms
- Properties: Background, text color, transform
- Effect: Color change + 5% scale increase

#### Icon Button Hover
```css
hover:bg-secondary transition-colors duration-300
```

**Properties:**
- Duration: 300ms
- Property: Background color
- Effect: Light sage green background

## Transition Patterns

### Standard Transition
```css
transition-all duration-300
```
- Used for most interactive elements
- 300ms is optimal for perceived responsiveness
- Covers all animatable properties

### Color Transition
```css
transition-colors duration-300
```
- More performant than transition-all
- Used when only colors change
- Prevents unnecessary calculations

### Transform Transition
```css
transition-transform duration-500
```
- GPU-accelerated
- Smooth, performant
- Used for scales, translations

## Animation Timing

### Duration Guidelines

**Fast (100-200ms):**
- Micro-interactions
- Hover state changes
- Focus indicators

**Medium (300-500ms):**
- Button interactions
- Color changes
- Small movements
- Most UI transitions

**Slow (600-1000ms):**
- Content reveals
- Section transitions
- Page animations

**Very Slow (1000ms+):**
- Ken Burns effect (10s)
- Ambient animations
- Background effects

### Easing Functions

**ease-out (most common):**
- Fast start, slow end
- Feels responsive
- Used for: Entrances, reveals

**ease-in:**
- Slow start, fast end
- Used for: Exits, dismissals

**ease-in-out:**
- Slow start and end
- Used for: Continuous animations

**linear:**
- Constant speed
- Used for: Loading indicators, rotations

## Performance Considerations

### GPU-Accelerated Properties
```css
/* Performant - use these */
transform: translate(), scale(), rotate()
opacity
```

### Non-Accelerated Properties
```css
/* Less performant - use sparingly */
width, height
margin, padding
top, left, right, bottom
```

### Best Practices

1. **Use transforms over position:**
   ```css
   /* Good */
   transform: translateX(10px);
   
   /* Avoid */
   left: 10px;
   ```

2. **Prefer opacity over visibility:**
   ```css
   /* Good */
   opacity: 0;
   
   /* Less smooth */
   display: none;
   ```

3. **Limit simultaneous animations:**
   - Max 3-4 elements animating at once
   - Stagger animations for better performance

4. **Use will-change sparingly:**
   ```css
   /* Only for known performance issues */
   will-change: transform;
   ```

## Accessibility Considerations

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Note:** This should be added to globals.css for accessibility

### Focus Indicators
- Never remove focus outlines
- Ensure focus states are visible
- Maintain keyboard navigation

## Future Enhancements

- [ ] Add scroll-triggered animations
- [ ] Implement parallax effects
- [ ] Add page transition animations
- [ ] Create loading skeleton animations
- [ ] Implement micro-interactions (button ripples)
- [ ] Add stagger animations for lists
- [ ] Create custom cursor effects
- [ ] Implement smooth scroll behavior
- [ ] Add entrance animations for sections
- [ ] Create animated SVG icons
- [ ] Implement progress indicators
- [ ] Add toast notification animations
- [ ] Create modal/dialog transitions
- [ ] Implement image gallery transitions

## Animation Library Integration

### Potential Libraries
- **Framer Motion** - React animation library
- **GSAP** - Professional animation platform
- **Anime.js** - Lightweight animation library
- **React Spring** - Spring physics-based animations

### Current Approach
- Pure CSS animations (no library)
- Tailwind CSS utilities
- Custom keyframes
- React state-driven animations

## Notes

- All animations use CSS for performance
- Transitions are hardware-accelerated where possible
- Animation durations are consistent across components
- Easing functions create natural motion
- Animations enhance UX without being distracting
- Consider adding reduced-motion media query
- Test animations on various devices
- Monitor performance impact
