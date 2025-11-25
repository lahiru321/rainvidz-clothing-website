# Product Components Documentation

## Overview
This document covers the product card component and product grid system used throughout the website to display clothing items with interactive features.

## Product Card Component

### Location
`components/product-card.tsx`

### Purpose
Reusable product card with:
- Image hover effects (dual images)
- Add to cart functionality
- Favorite/wishlist toggle
- Responsive design
- Smooth animations

## Product Data Structure

```typescript
interface Product {
  id: number
  name: string
  price: string
  category: string
  image: string
  hoverImage: string
}
```

**Properties:**
- `id` - Unique product identifier
- `name` - Product name/title
- `price` - Formatted price string (e.g., "$89.99")
- `category` - Product category (e.g., "Dresses", "Tops")
- `image` - Primary product image URL
- `hoverImage` - Secondary image shown on hover

## Component Props

```typescript
interface ProductCardProps {
  product: Product
  onAddToCart: () => void
}
```

- `product` - Product data object
- `onAddToCart` - Callback function when "Add to Bag" is clicked

## State Management

### Local State
```typescript
const [isHovered, setIsHovered] = useState(false)
const [isFavorited, setIsFavorited] = useState(false)
```

**States:**
- `isHovered` - Tracks mouse hover state
- `isFavorited` - Tracks if product is favorited (local only)

### Hover Detection
```typescript
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
```

## Visual Structure

### Image Container
```typescript
<div
  className="relative overflow-hidden bg-secondary aspect-[2/3] mb-4 transition-all duration-300"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
```

**Styling:**
- Aspect ratio: 2:3 (portrait orientation)
- Background: Light sage green (`bg-secondary`)
- Overflow hidden: Prevents image scale overflow
- Transition: 300ms for smooth state changes

### Image Swap Effect
```typescript
<img
  src={isHovered ? product.hoverImage : product.image}
  alt={product.name}
  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
/>
```

**Features:**
- Conditional image source based on hover
- Object-fit: cover (maintains aspect ratio)
- Scale on hover: 105% (subtle zoom)
- Transition: 500ms (smooth image change)

### Dark Overlay
```typescript
<div
  className={`absolute inset-0 bg-primary/20 mix-blend-multiply transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
/>
```

**Effect:**
- Black overlay at 20% opacity
- Blend mode: multiply (darkens image)
- Appears on hover (300ms fade)
- Creates depth and focus

## Interactive Elements

### Add to Cart Button
```typescript
<div
  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
>
  <button
    onClick={(e) => {
      e.preventDefault()
      onAddToCart()
    }}
    className="bg-primary text-primary-foreground px-6 py-3 font-semibold flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105 shadow-lg"
  >
    <ShoppingBag className="w-5 h-5" />
    Add to Bag
  </button>
</div>
```

**Features:**
- Appears only on hover (fade in)
- Centered absolutely
- Icon + text layout
- Hover effect: Changes to sage green
- Scale on hover: 105%
- Shadow for elevation
- Prevents default link behavior

**Styling:**
- Background: Black (primary)
- Text: White
- Padding: 24px horizontal, 12px vertical
- Font: Semibold
- Gap: 8px between icon and text

### Favorite Button
```typescript
<button
  onClick={(e) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
  }}
  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 transition-all duration-300 hover:scale-110 active:scale-95"
>
  <Heart
    className={`w-5 h-5 transition-colors duration-300 ${isFavorited ? "fill-accent text-accent" : "text-foreground"}`}
  />
</button>
```

**Features:**
- Always visible (top-right corner)
- Glassmorphism effect (white 90% + blur)
- Toggle favorite state
- Heart icon fills with sage green when favorited
- Scale animations: 110% on hover, 95% on click
- Prevents default behavior

**Position:**
- Top: 16px
- Right: 16px
- Padding: 8px

## Product Information

```typescript
<div className="space-y-2">
  <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
    {product.category}
  </p>
  <h3 className="font-medium text-primary hover:text-accent transition-colors duration-300 line-clamp-2">
    {product.name}
  </h3>
  <p className="text-lg font-semibold text-primary">
    {product.price}
  </p>
</div>
```

### Category Label
- Size: Extra small (12px)
- Style: Uppercase with wide tracking
- Color: 60% opacity foreground
- Purpose: Product classification

### Product Name
- Font: Medium weight
- Color: Primary (black), accent on hover
- Line clamp: 2 lines max (prevents overflow)
- Transition: Color change on hover

### Price
- Size: Large (18px)
- Font: Semibold
- Color: Primary (black)
- Prominent display

## Animations & Transitions

### Image Transitions
```css
transition-transform duration-500 group-hover:scale-105
```
- Property: Transform
- Duration: 500ms
- Effect: Scale to 105%

### Button Transitions
```css
transition-all duration-300 transform hover:scale-105
```
- Properties: All (background, color, transform)
- Duration: 300ms
- Hover scale: 105%

### Overlay Transitions
```css
transition-opacity duration-300
```
- Property: Opacity
- Duration: 300ms
- Effect: Fade in/out

## Responsive Behavior

### Image Aspect Ratio
```css
aspect-[2/3]
```
- Maintains 2:3 ratio on all screen sizes
- Portrait orientation (taller than wide)
- Consistent across product grids

### Text Sizing
- Category: Fixed at `text-xs`
- Name: Fixed at base size
- Price: Fixed at `text-lg`
- No responsive scaling (maintains consistency)

## Accessibility

### Button Labels
```typescript
<ShoppingBag className="w-5 h-5" />
Add to Bag
```
- Icon + text for clarity
- Descriptive button text

### Image Alt Text
```typescript
alt={product.name}
```
- Descriptive alt text for screen readers

### Keyboard Navigation
- All buttons are keyboard accessible
- Focus states visible (global outline)
- Tab order: Favorite → Add to Cart

### Click Prevention
```typescript
onClick={(e) => {
  e.preventDefault()
  // Action
}}
```
- Prevents unwanted navigation
- Allows card to be wrapped in links

## Usage Example

```typescript
import ProductCard from "@/components/product-card"

const product = {
  id: 1,
  name: "Bohemian Maxi Dress",
  price: "$89.99",
  category: "Dresses",
  image: "/images/dress-1.jpg",
  hoverImage: "/images/dress-1-alt.jpg"
}

<ProductCard 
  product={product} 
  onAddToCart={() => console.log("Added to cart")} 
/>
```

## Product Grid Component

### Location
`components/product-grid.tsx`

### Purpose
Grid layout for displaying multiple product cards

### Implementation
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard 
      key={product.id} 
      product={product} 
      onAddToCart={onAddToCart} 
    />
  ))}
</div>
```

### Grid Configuration
- **Mobile:** 1 column
- **Small (640px+):** 2 columns
- **Large (1024px+):** 4 columns
- **Gap:** 24px (1.5rem)

## Integration with Sections

### New Arrivals
```typescript
<NewArrivals onAddToCart={handleAddToCart} />
```
- Displays latest products
- Uses product grid
- Passes cart handler

### Trending Collection
```typescript
<TrendingCollection onAddToCart={handleAddToCart} />
```
- Shows popular items
- Same grid layout
- Shares cart handler

### Shop Section
```typescript
<ShopSection onAddToCart={handleAddToCart} />
```
- General product display
- Consistent styling
- Unified cart experience

## Performance Optimizations

### Image Loading
- Consider lazy loading for off-screen images
- Optimize image sizes (use Next.js Image component)
- Preload hover images on hover intent

### State Management
- Local state for UI interactions
- Minimal re-renders
- Event handlers memoized in parent

## Future Enhancements

- [ ] Add quick view modal
- [ ] Implement size/color selection
- [ ] Add product ratings/reviews
- [ ] Persist favorites to database
- [ ] Add "Out of Stock" badge
- [ ] Implement "Sale" badge with discount percentage
- [ ] Add product comparison feature
- [ ] Implement recently viewed products
- [ ] Add product image gallery (multiple images)
- [ ] Integrate with real cart system
- [ ] Add animation for add to cart (item flying to cart)
- [ ] Implement wishlist persistence
- [ ] Add share product functionality

## Notes

- Component is client-side ("use client")
- Favorite state is local (not persisted)
- Cart integration is callback-based
- Images should be optimized for web
- Hover images should be same dimensions as primary
- Consider using Next.js Image for optimization
- Product data can come from API/database
