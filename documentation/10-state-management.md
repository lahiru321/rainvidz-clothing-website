# State Management Documentation

## Overview
This document covers the state management approach used in the clothing website, including local component state, cart management, and data flow patterns.

## State Management Strategy

### Current Approach
The website uses **React's built-in state management**:
- `useState` for local component state
- Props for data passing
- Callback functions for state updates
- No external state management library

### Rationale
- **Simplicity** - Easy to understand and maintain
- **Performance** - No overhead from external libraries
- **Sufficient** - Current needs don't require complex state
- **Scalable** - Can migrate to Redux/Zustand later if needed

## Global State (Page Level)

### Location
`app/page.tsx`

### Cart State
```typescript
const [cartCount, setCartCount] = useState(0)
```

**Purpose:**
- Tracks total number of items in cart
- Displayed in header badge
- Updated when products are added

**Type:** `number`
**Initial value:** `0`

### Cart Handler
```typescript
const handleAddToCart = () => {
  setCartCount((c) => c + 1)
}
```

**Features:**
- Functional update (uses previous state)
- Increments count by 1
- Thread-safe (prevents race conditions)

### State Flow
```
User clicks "Add to Bag"
  ↓
ProductCard calls onAddToCart()
  ↓
handleAddToCart() executes
  ↓
setCartCount updates state
  ↓
Header re-renders with new count
  ↓
Badge appears/updates with pulse animation
```

## Component State

### Header Component

#### Mobile Menu State
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)
```

**Purpose:**
- Controls mobile menu visibility
- Toggles between open/closed states

**Usage:**
```typescript
<button onClick={() => setIsMenuOpen(!isMenuOpen)}>
  {isMenuOpen ? <X /> : <Menu />}
</button>

{isMenuOpen && (
  <nav className="md:hidden">
    {/* Mobile navigation */}
  </nav>
)}
```

**State transitions:**
- `false` → `true`: Menu opens
- `true` → `false`: Menu closes

### Product Card Component

#### Hover State
```typescript
const [isHovered, setIsHovered] = useState(false)
```

**Purpose:**
- Tracks mouse hover on product card
- Controls image swap and overlay visibility

**Triggers:**
```typescript
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
```

**Effects when `true`:**
- Shows hover image
- Displays dark overlay
- Reveals "Add to Bag" button

#### Favorite State
```typescript
const [isFavorited, setIsFavorited] = useState(false)
```

**Purpose:**
- Tracks if product is favorited
- Controls heart icon fill

**Toggle:**
```typescript
onClick={() => setIsFavorited(!isFavorited)}
```

**Visual changes:**
- `false`: Empty heart outline
- `true`: Filled heart (sage green)

**Note:** Currently local only (not persisted)

### Hero Section Component

#### Carousel API State
```typescript
const [api, setApi] = useState<CarouselApi>()
const [current, setCurrent] = useState(0)
const [count, setCount] = useState(0)
```

**States:**
- `api` - Embla Carousel API instance
- `current` - Current slide index (0-based)
- `count` - Total number of slides

**Initialization:**
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

**Auto-play:**
```typescript
useEffect(() => {
  if (!api) return

  const intervalId = setInterval(() => {
    api.scrollNext()
  }, 6000)

  return () => clearInterval(intervalId)
}, [api])
```

### Shop Section Component

#### Category Filter State
```typescript
const [activeCategory, setActiveCategory] = useState("All")
```

**Purpose:**
- Tracks selected category filter
- Filters displayed products

**Categories:**
- "All"
- "Dresses"
- "Tops"
- "Bottoms"
- "Accessories"

**Update:**
```typescript
onClick={() => setActiveCategory(category)}
```

**Usage:**
```typescript
const filteredProducts = activeCategory === "All"
  ? products
  : products.filter(p => p.category === activeCategory)
```

## Props Drilling Pattern

### Cart Count Flow
```
page.tsx (cartCount state)
  ↓ (props)
Header (displays count)
```

```typescript
// page.tsx
<Header cartCount={cartCount} />

// header.tsx
export default function Header({ cartCount }: { cartCount: number }) {
  // Display count in badge
}
```

### Add to Cart Callback Flow
```
page.tsx (handleAddToCart function)
  ↓ (props)
NewArrivals (passes to ProductCard)
  ↓ (props)
ProductCard (calls on button click)
```

```typescript
// page.tsx
<NewArrivals onAddToCart={handleAddToCart} />

// new-arrivals.tsx
<ProductCard product={product} onAddToCart={onAddToCart} />

// product-card.tsx
<button onClick={onAddToCart}>Add to Bag</button>
```

## State Update Patterns

### Functional Updates
```typescript
// ✅ Good - Uses previous state
setCartCount((prevCount) => prevCount + 1)

// ❌ Avoid - May cause issues with rapid updates
setCartCount(cartCount + 1)
```

**Why functional updates?**
- Ensures correct value with rapid updates
- Prevents race conditions
- React batches updates properly

### Toggle Pattern
```typescript
// Boolean toggle
setIsMenuOpen(!isMenuOpen)
setIsFavorited(!isFavorited)

// Or with functional update
setIsMenuOpen((prev) => !prev)
```

### Conditional Updates
```typescript
// Only update if condition met
if (cartCount > 0) {
  // Show badge
}

if (isHovered) {
  // Show overlay
}
```

## Data Flow Architecture

### Unidirectional Data Flow
```
State (page.tsx)
  ↓
Props (to components)
  ↓
Render (UI updates)
  ↓
Events (user interactions)
  ↓
Callbacks (back to parent)
  ↓
State updates (cycle repeats)
```

### Example: Adding to Cart
```
1. User clicks "Add to Bag" in ProductCard
2. ProductCard calls onAddToCart() prop
3. Callback reaches page.tsx handleAddToCart()
4. handleAddToCart() updates cartCount state
5. React re-renders page.tsx
6. Header receives new cartCount prop
7. Header re-renders with updated badge
8. Badge shows new count with pulse animation
```

## Performance Considerations

### Preventing Unnecessary Re-renders

#### Current Approach
- Minimal state at top level
- Local state in components
- No complex state objects

#### Potential Optimizations
```typescript
// Memoize callbacks
const handleAddToCart = useCallback(() => {
  setCartCount((c) => c + 1)
}, [])

// Memoize components
const ProductCard = React.memo(({ product, onAddToCart }) => {
  // Component code
})
```

### State Colocation
- Keep state as close to where it's used as possible
- Hover state in ProductCard (not in parent)
- Menu state in Header (not in page)
- Only lift state when needed by multiple components

## Future State Management Needs

### Potential Requirements

#### 1. Shopping Cart
```typescript
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

const [cart, setCart] = useState<CartItem[]>([])
```

**Operations needed:**
- Add item
- Remove item
- Update quantity
- Clear cart
- Calculate total

#### 2. User Authentication
```typescript
interface User {
  id: string
  name: string
  email: string
  isAuthenticated: boolean
}

const [user, setUser] = useState<User | null>(null)
```

#### 3. Wishlist
```typescript
const [wishlist, setWishlist] = useState<number[]>([])
```

**Operations:**
- Add product ID
- Remove product ID
- Check if product is favorited
- Persist to database

#### 4. Filters & Sorting
```typescript
interface Filters {
  category: string
  priceRange: [number, number]
  sizes: string[]
  colors: string[]
  sortBy: 'price' | 'newest' | 'popular'
}

const [filters, setFilters] = useState<Filters>(defaultFilters)
```

## State Management Libraries

### When to Consider External Library

**Indicators you need a library:**
- [ ] State shared across many components
- [ ] Complex state updates
- [ ] Need for state persistence
- [ ] Undo/redo functionality
- [ ] Time-travel debugging
- [ ] Large application scale

### Library Options

#### 1. Zustand (Recommended)
```typescript
import create from 'zustand'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
}

const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
}))
```

**Pros:**
- Simple API
- Small bundle size
- No boilerplate
- TypeScript support

#### 2. Redux Toolkit
```typescript
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload)
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
  },
})
```

**Pros:**
- Industry standard
- DevTools support
- Middleware ecosystem
- Time-travel debugging

#### 3. Context API (Built-in)
```typescript
const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}
```

**Pros:**
- No external dependency
- Built into React
- Simple for small apps

**Cons:**
- Can cause re-render issues
- No DevTools
- Verbose for complex state

## Local Storage Integration

### Persisting Cart
```typescript
// Save to localStorage
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart))
}, [cart])

// Load from localStorage
useEffect(() => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    setCart(JSON.parse(savedCart))
  }
}, [])
```

### Persisting Favorites
```typescript
useEffect(() => {
  localStorage.setItem('favorites', JSON.stringify(favorites))
}, [favorites])
```

## Server State Management

### For API Data
Consider using:
- **TanStack Query (React Query)** - Server state management
- **SWR** - Stale-while-revalidate pattern
- **Apollo Client** - For GraphQL

### Example with React Query
```typescript
import { useQuery } from '@tanstack/react-query'

function Products() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })
  
  if (isLoading) return <div>Loading...</div>
  
  return <ProductGrid products={data} />
}
```

## Best Practices

1. **Keep state local** - Only lift when necessary
2. **Use functional updates** - For state based on previous state
3. **Avoid deep nesting** - Flatten state structure
4. **Single source of truth** - Don't duplicate state
5. **Immutable updates** - Never mutate state directly
6. **Meaningful names** - Clear state variable names
7. **Initialize properly** - Set correct initial values
8. **Clean up effects** - Return cleanup functions
9. **Type your state** - Use TypeScript interfaces
10. **Document complex state** - Add comments for clarity

## Notes

- Current implementation is simple and sufficient
- Easy to migrate to external library later
- State is predictable and easy to debug
- No performance issues with current approach
- Consider Zustand when scaling up
- Persist important state (cart, favorites)
- Use React Query for server data
- Keep client and server state separate
