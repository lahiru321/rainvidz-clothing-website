# Navigation & Footer Documentation

## Overview
This document covers the header navigation component and footer component, which provide consistent navigation and information across the website.

## Header Component

### Location
`components/header.tsx`

### Purpose
Sticky navigation header with:
- Brand logo
- Main navigation links
- Search functionality
- Shopping cart with counter
- Mobile responsive menu

## Header Structure

### Component Props
```typescript
interface HeaderProps {
  cartCount: number
}
```
- `cartCount` - Number of items in cart (displayed as badge)

### State Management
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)
```
- Controls mobile menu visibility
- Toggles between Menu and X icons

## Layout Structure

### Container
```typescript
<header className="sticky top-0 z-50 bg-background border-b border-border">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 md:h-20">
```

**Features:**
- **Sticky positioning:** Stays at top on scroll
- **Z-index:** 50 (above page content)
- **Border:** Bottom border for separation
- **Height:** 64px mobile, 80px desktop
- **Max width:** 1280px centered

### Logo/Brand
```typescript
<Link href="/" className="flex-shrink-0">
  <div className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-widest">
    Rainvidz
  </div>
</Link>
```

**Styling:**
- Font: Playfair Display (serif)
- Size: 24px mobile, 36px desktop
- Weight: Bold
- Tracking: Wide letter spacing
- Color: Primary (black)
- Non-shrinking flex item

## Desktop Navigation

### Navigation Links
```typescript
<nav className="hidden md:flex items-center gap-8">
  <Link
    href="#"
    className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
  >
    New Arrivals
  </Link>
  <Link href="#">Collections</Link>
  <Link href="#">About</Link>
  <Link href="#">Contact</Link>
</nav>
```

**Features:**
- Hidden on mobile (`hidden md:flex`)
- Horizontal layout with 32px gap
- Font size: 14px
- Font weight: Medium
- Hover: Changes to sage green
- Transition: 300ms color change

**Navigation Items:**
1. New Arrivals
2. Collections
3. About
4. Contact

## Utility Icons

### Search Button
```typescript
<button className="p-2 hover:bg-secondary transition-colors duration-300">
  <Search className="w-5 h-5" />
</button>
```

**Features:**
- Icon size: 20px × 20px
- Padding: 8px
- Hover: Light sage green background
- Transition: 300ms

### Shopping Cart Button
```typescript
<button className="relative p-2 hover:bg-secondary transition-colors duration-300">
  <ShoppingBag className="w-5 h-5" />
  {cartCount > 0 && (
    <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
      {cartCount}
    </span>
  )}
</button>
```

**Cart Badge:**
- Position: Top-right corner (4px from edges)
- Size: 20px × 20px circle
- Background: Sage green (accent)
- Text: White, extra small, bold
- Animation: Pulse effect
- Visibility: Only shown when cartCount > 0

**Badge Features:**
- Draws attention to cart items
- Updates dynamically
- Accessible (shows count)
- Visually prominent

## Mobile Menu

### Toggle Button
```typescript
<button 
  onClick={() => setIsMenuOpen(!isMenuOpen)} 
  className="md:hidden p-2"
>
  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>
```

**Features:**
- Only visible on mobile
- Icon size: 24px × 24px
- Toggles between hamburger and X
- Controls menu state

### Mobile Navigation Menu
```typescript
{isMenuOpen && (
  <nav className="md:hidden pb-4 animate-fade-in-up">
    <Link
      href="#"
      className="block py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
    >
      New Arrivals
    </Link>
    {/* More links */}
  </nav>
)}
```

**Features:**
- Conditional rendering based on state
- Hidden on desktop
- Fade-in-up animation
- Vertical layout (stacked links)
- Padding: 8px vertical per link
- Same hover effect as desktop

## Responsive Behavior

### Breakpoints

**Mobile (< 768px):**
- Logo: 24px
- Height: 64px
- Desktop nav: Hidden
- Mobile menu: Visible
- Hamburger icon: Shown

**Desktop (≥ 768px):**
- Logo: 36px
- Height: 80px
- Desktop nav: Visible
- Mobile menu: Hidden
- Hamburger icon: Hidden

## Accessibility

### Semantic HTML
```typescript
<header>  // Landmark
<nav>     // Navigation landmark
<Link>    // Proper link elements
<button>  // Interactive elements
```

### Keyboard Navigation
- All links and buttons are keyboard accessible
- Tab order is logical (logo → nav → utilities → mobile toggle)
- Focus states visible (global outline)

### Screen Readers
- Proper heading hierarchy
- Descriptive link text
- Icon buttons have implicit meaning from context

## Interactions

### Hover Effects
- Navigation links: Color change to sage green
- Icon buttons: Background color change
- Smooth transitions (300ms)

### Active States
- Cart badge pulses when items present
- Mobile menu slides in with animation

### Click Handlers
- Mobile menu toggle
- Cart button (can be enhanced)
- Search button (can be enhanced)

## Footer Component

### Location
`components/footer.tsx`

### Purpose
Site-wide footer with:
- Brand information
- Navigation links
- Legal links
- Copyright notice

## Footer Structure

### Container
```typescript
<footer className="bg-primary text-primary-foreground py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**Styling:**
- Background: Black (primary)
- Text: White (primary-foreground)
- Padding: 64px vertical
- Max width: 1280px centered

### Grid Layout
```typescript
<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
```

**Configuration:**
- Mobile: 1 column (stacked)
- Desktop: 4 columns
- Gap: 32px
- Bottom margin: 48px

## Footer Sections

### 1. Brand Section
```typescript
<div>
  <h3 className="font-serif text-2xl font-bold mb-4">LUXE</h3>
  <p className="text-primary-foreground/70 text-sm leading-relaxed">
    Premium fashion for the modern individual. Curated collections that celebrate timeless elegance.
  </p>
</div>
```

**Features:**
- Serif heading (24px)
- Brand tagline
- 70% opacity text
- Relaxed line height

### 2. Shop Links
```typescript
<div>
  <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
  <ul className="space-y-2 text-sm text-primary-foreground/70">
    <li><a href="#" className="hover:text-accent transition-colors">New Arrivals</a></li>
    <li><a href="#">Collections</a></li>
    <li><a href="#">Sale</a></li>
    <li><a href="#">Gift Cards</a></li>
  </ul>
</div>
```

**Links:**
- New Arrivals
- Collections
- Sale
- Gift Cards

### 3. Help Links
```typescript
<div>
  <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Help</h4>
  <ul className="space-y-2 text-sm text-primary-foreground/70">
    <li><a href="#">Contact Us</a></li>
    <li><a href="#">Shipping Info</a></li>
    <li><a href="#">Returns</a></li>
    <li><a href="#">FAQ</a></li>
  </ul>
</div>
```

**Links:**
- Contact Us
- Shipping Info
- Returns
- FAQ

### 4. About Links
```typescript
<div>
  <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">About</h4>
  <ul className="space-y-2 text-sm text-primary-foreground/70">
    <li><a href="#">Our Story</a></li>
    <li><a href="#">Sustainability</a></li>
    <li><a href="#">Careers</a></li>
    <li><a href="#">Press</a></li>
  </ul>
</div>
```

**Links:**
- Our Story
- Sustainability
- Careers
- Press

## Footer Bottom

### Copyright & Legal
```typescript
<div className="border-t border-primary-foreground/20 pt-8">
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
    <p>&copy; 2025 LUXE. All rights reserved.</p>
    <div className="flex gap-6">
      <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
      <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
      <a href="#" className="hover:text-accent transition-colors">Cookie Settings</a>
    </div>
  </div>
</div>
```

**Features:**
- Top border (20% opacity)
- Padding top: 32px
- Responsive flex layout (column → row)
- Copyright year: 2025
- Legal links with hover effects

## Styling Patterns

### Link Hover Effect
```typescript
className="hover:text-accent transition-colors"
```
- Default: 70% opacity white
- Hover: Sage green
- Transition: Smooth color change

### Section Headers
```typescript
className="font-semibold mb-4 text-sm uppercase tracking-wider"
```
- Font weight: Semibold
- Size: 14px
- Transform: Uppercase
- Tracking: Wide letter spacing
- Bottom margin: 16px

### Link Lists
```typescript
className="space-y-2 text-sm text-primary-foreground/70"
```
- Vertical spacing: 8px
- Font size: 14px
- Opacity: 70%

## Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Stacked sections
- Centered copyright
- Vertical legal links

### Desktop (≥ 768px)
- Four column grid
- Horizontal layout
- Copyright left, legal right
- Horizontal legal links

## Accessibility

### Semantic Structure
```typescript
<footer>  // Landmark
<h3>, <h4>  // Heading hierarchy
<ul>, <li>  // List structure
<a>  // Proper links
```

### Keyboard Navigation
- All links are keyboard accessible
- Logical tab order
- Visible focus states

### Color Contrast
- White text on black: 21:1 ratio (WCAG AAA)
- 70% opacity white: Still meets AA standards
- Sage green hover: Sufficient contrast

## Future Enhancements

### Header
- [ ] Implement search functionality
- [ ] Add cart drawer/modal
- [ ] Implement user account menu
- [ ] Add mega menu for Collections
- [ ] Implement sticky behavior with shrink effect
- [ ] Add breadcrumb navigation
- [ ] Implement announcement bar
- [ ] Add language/currency selector

### Footer
- [ ] Add newsletter signup
- [ ] Add social media icons
- [ ] Implement payment method icons
- [ ] Add store locator link
- [ ] Create sitemap
- [ ] Add accessibility statement
- [ ] Implement back-to-top button
- [ ] Add trust badges/certifications

## Notes

- Header is client component (uses state)
- Footer is server component (static)
- All links currently use `#` (placeholder)
- Cart count updates from parent component
- Mobile menu animation uses custom CSS
- Consider adding dropdown menus for categories
- Search can be enhanced with modal/overlay
- Footer links should connect to actual pages
