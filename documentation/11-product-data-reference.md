# Product Data Reference

## Overview
This document provides sample product data based on the actual products to be displayed on the website.

## Product Data Structure

```typescript
interface Product {
  id: number
  name: string
  price: string
  originalPrice?: string  // For sale items
  category: string
  image: string
  hoverImage: string
  colors?: string[]
  sizes?: string[]
  inStock: boolean
  badge?: 'NEW' | 'SALE' | 'LIMITED'
}
```

## Sample Products (Based on Reference Image)

### Product 1: Novela Tee - Black
```typescript
{
  id: 1,
  name: "Novela Tee - Black",
  price: "Rs 3,290",
  category: "Tops",
  image: "/products/novela-tee-black.jpg",
  hoverImage: "/products/novela-tee-black-alt.jpg",
  colors: ["Black", "Brown", "White"],
  sizes: ["XS", "S", "M", "L"],
  inStock: true,
  badge: "NEW"
}
```

**Product Details:**
- **Style:** Scoop neck, short sleeve
- **Fit:** Fitted, cropped length
- **Material:** Soft cotton blend
- **Available Colors:** Black, Brown, White
- **Price:** Rs 3,290
- **Availability:** 2 colors available

---

### Product 2: Novela Tee - Brown
```typescript
{
  id: 2,
  name: "Novela Tee - Brown",
  price: "Rs 3,290",
  category: "Tops",
  image: "/products/novela-tee-brown.jpg",
  hoverImage: "/products/novela-tee-brown-alt.jpg",
  colors: ["Black", "Brown", "White"],
  sizes: ["XS", "S", "M", "L"],
  inStock: true
}
```

**Product Details:**
- **Style:** Scoop neck, short sleeve
- **Fit:** Fitted, cropped length
- **Color:** Earthy brown tone
- **Material:** Soft cotton blend
- **Price:** Rs 3,290
- **Availability:** 2 colors available

---

### Product 3: Gia Tee - White
```typescript
{
  id: 3,
  name: "Gia Tee - White",
  price: "Rs 2,990",
  category: "Tops",
  image: "/products/gia-tee-white.jpg",
  hoverImage: "/products/gia-tee-white-alt.jpg",
  colors: ["White"],
  sizes: ["XS", "S", "M", "L"],
  inStock: true
}
```

**Product Details:**
- **Style:** Off-shoulder, short sleeve
- **Fit:** Fitted, cropped length
- **Color:** Clean white
- **Material:** Soft cotton blend
- **Price:** Rs 2,990
- **Availability:** 1 color available

---

### Product 4: Kylie Tee - White
```typescript
{
  id: 4,
  name: "Kylie Tee - White",
  price: "Rs 2,990",
  category: "Tops",
  image: "/products/kylie-tee-white.jpg",
  hoverImage: "/products/kylie-tee-white-alt.jpg",
  colors: ["White"],
  sizes: ["XS", "S", "M", "L"],
  inStock: true
}
```

**Product Details:**
- **Style:** Tank top, sleeveless
- **Fit:** Fitted, cropped length
- **Color:** White
- **Material:** Soft cotton blend
- **Price:** Rs 2,990
- **Availability:** 1 color available
- **Note:** Shown with shorts (sold separately)

---

## Complete Product Array

```typescript
const products: Product[] = [
  {
    id: 1,
    name: "Novela Tee - Black",
    price: "Rs 3,290",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80&sat=-100",
    colors: ["Black", "Brown", "White"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    badge: "NEW"
  },
  {
    id: 2,
    name: "Novela Tee - Brown",
    price: "Rs 3,290",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80&sat=-100",
    colors: ["Black", "Brown", "White"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true
  },
  {
    id: 3,
    name: "Gia Tee - White",
    price: "Rs 2,990",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80&sat=-100",
    colors: ["White"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true
  },
  {
    id: 4,
    name: "Kylie Tee - White",
    price: "Rs 2,990",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80&sat=-100",
    colors: ["White"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true
  }
]
```

## Product Categories

### Tops
- Novela Tee (Black, Brown, White)
- Gia Tee (White)
- Kylie Tee (White)

### Pricing Structure
- **Premium Tees:** Rs 3,290 (Novela collection)
- **Standard Tees:** Rs 2,990 (Gia, Kylie)

## Color Availability

### Multi-Color Products
- **Novela Tee:** Available in 3 colors (Black, Brown, White)
  - Display: "2 COLORS AVAILABLE" badge

### Single-Color Products
- **Gia Tee:** White only
- **Kylie Tee:** White only
  - Display: "1 COLOR AVAILABLE" badge

## Size Chart

All products available in:
- **XS** - Extra Small
- **S** - Small
- **M** - Medium
- **L** - Large

## Image Guidelines

### Primary Image
- Model wearing the product
- Front view
- Studio lighting
- Neutral background
- Full product visible

### Hover Image
- Alternative angle or styling
- Can be same image with filter
- Maintains same dimensions
- Smooth transition

### Image Specifications
- **Format:** JPG or WebP
- **Dimensions:** 800px × 1200px (2:3 ratio)
- **Quality:** 80%
- **File size:** < 200KB optimized

## Product Display Features

### Color Indicator
```typescript
{colors.length > 1 && (
  <div className="text-xs text-muted-foreground">
    {colors.length} COLORS AVAILABLE
  </div>
)}
```

### Size Selector (Future)
```typescript
<div className="flex gap-2">
  {sizes.map(size => (
    <button 
      key={size}
      className="border px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground"
    >
      {size}
    </button>
  ))}
</div>
```

### Badge Display
```typescript
{badge && (
  <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold">
    {badge}
  </span>
)}
```

## Integration Example

### In New Arrivals Section
```typescript
import ProductCard from "@/components/product-card"

const products = [
  // Product data from above
]

export default function NewArrivals({ onAddToCart }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            New Arrivals
          </h2>
          <p className="text-muted-foreground">
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

## Notes

- Product images should be sourced from actual product photography
- Placeholder images use Unsplash for demonstration
- Hover images can be same image with desaturation filter
- All prices in Indian Rupees (Rs)
- Stock status should be dynamic from database
- Color availability affects product card display
- Size selection will be added in future enhancement

## Future Enhancements

- [ ] Add product variants (color/size combinations)
- [ ] Implement stock tracking per variant
- [ ] Add product descriptions
- [ ] Include material composition
- [ ] Add care instructions
- [ ] Implement product reviews
- [ ] Add related products
- [ ] Create size guide
- [ ] Add fit information
- [ ] Implement product filtering by attributes
