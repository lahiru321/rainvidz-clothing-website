# Shopping Cart & Checkout - Implementation Guide

**Date:** December 4, 2025  
**Status:** ✅ Complete

## Overview

This document details the implementation of the shopping cart and checkout system, including local cart storage, cart management, checkout flow, and order creation.

## Architecture Decision: Local Cart

### Why Local Cart?

**Chosen Approach:** Zustand + localStorage (client-side)

**Reasons:**
1. **Guest Checkout Support** - Works without authentication
2. **Instant Updates** - No API calls for cart operations
3. **Offline Capability** - Cart persists without internet
4. **Simplified Backend** - No cart sync complexity initially
5. **Better UX** - Faster, more responsive

**Trade-offs:**
- Cart not synced across devices
- Lost if localStorage cleared
- Can't pre-fill cart from server

**Future Enhancement:** Sync to database when user logs in

## Cart State Management

### Technology: Zustand

**File:** `lib/store/cartStore.ts`

**Why Zustand?**
- Lightweight (1KB)
- No boilerplate
- Built-in persistence
- TypeScript support
- Easy to use

### Cart Store Structure

```typescript
interface LocalCartItem {
  productId: string        // MongoDB _id
  productName: string      // For display
  productSlug: string      // For navigation
  variantId: string        // SKU
  variantColor: string     // Display color
  variantSize: string      // Display size
  quantity: number         // Item quantity
  price: number            // Original price
  effectivePrice: number   // Sale price or regular
  image: string            // Product image URL
  addedAt: string          // Timestamp
}

interface CartStore {
  items: LocalCartItem[]
  loading: boolean
  error: string | null
  
  // Actions
  addItem(productId, variantId, quantity)
  updateQuantity(variantId, quantity)
  removeItem(variantId)
  clearCart()
  getItemCount()
  getTotal()
}
```

### Persistence Configuration

```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'guest-cart-storage',  // localStorage key
  }
)
```

**Storage Key:** `guest-cart-storage`  
**Data Format:** JSON stringified cart state

## Cart Operations

### 1. Add Item

**Function:** `addItem(productId, variantId, quantity)`

**Process:**
1. Fetch product details from API
2. Find variant by SKU
3. Check if item already in cart
4. If exists: Update quantity
5. If new: Add to cart array
6. Save to localStorage

**Code Flow:**
```typescript
const response = await getProductBySlug(productId)
const product = response.data
const variant = product.variants.find(v => v.sku === variantId)

if (existingItem) {
  item.quantity += quantity
} else {
  items.push(newItem)
}
```

**Error Handling:**
- Product not found
- Variant not found
- API errors

### 2. Update Quantity

**Function:** `updateQuantity(variantId, quantity)`

**Process:**
1. Find item by variantId
2. Update quantity
3. Save to localStorage

**Validation:**
- Quantity must be > 0
- If 0, item should be removed instead

### 3. Remove Item

**Function:** `removeItem(variantId)`

**Process:**
1. Filter out item with matching variantId
2. Update cart array
3. Save to localStorage

### 4. Clear Cart

**Function:** `clearCart()`

**Process:**
1. Set items to empty array
2. Save to localStorage

**Use Cases:**
- After successful order
- User manually clears cart

### 5. Get Item Count

**Function:** `getItemCount()`

**Returns:** Total number of items (sum of quantities)

**Usage:**
- Cart badge in header
- Cart page title

### 6. Get Total

**Function:** `getTotal()`

**Returns:** Total price (sum of effectivePrice × quantity)

**Usage:**
- Cart page summary
- Checkout page summary

## Cart UI Components

### 1. Cart Badge (Header)

**Location:** `components/header.tsx`

**Features:**
- Shows item count
- Only renders client-side (hydration fix)
- Hidden when count is 0
- Clickable (links to `/cart`)

**Implementation:**
```typescript
const [isMounted, setIsMounted] = useState(false)
const cartItemCount = useCartStore((state) => state.getItemCount())

useEffect(() => {
  setIsMounted(true)
}, [])

{isMounted && cartItemCount > 0 && (
  <span className="badge">{cartItemCount}</span>
)}
```

**Hydration Fix:**
- Server renders without badge
- Client mounts, then shows badge
- Prevents SSR/CSR mismatch

### 2. Cart Page

**Route:** `/cart`  
**File:** `app/cart/page.tsx`

**Sections:**

#### Cart Items List
- Product image
- Product name
- Variant (color/size)
- Unit price
- Quantity controls
- Item total
- Remove button

#### Quantity Controls
- Minus button (decrease)
- Current quantity display
- Plus button (increase)
- Disabled when loading

#### Order Summary
- Subtotal
- Shipping (Free)
- Tax (Rs 0)
- Total
- Proceed to Checkout button
- Back to Cart link

#### Empty State
- Shopping bag icon
- "Your cart is empty" message
- Continue Shopping button

**Features:**
- Real-time updates
- Confirmation before remove
- Confirmation before clear
- Loading states
- Sticky order summary

## Checkout Flow

### Checkout Page

**Route:** `/checkout`  
**File:** `app/checkout/page.tsx`

**Form Sections:**

#### 1. Contact Information
- Full Name (required)
- Email (required, validated)
- Phone (required)

#### 2. Shipping Address
- Address Line 1 (required)
- Address Line 2 (optional)
- City (required)
- Postal Code (required)
- Country (fixed: Sri Lanka)

#### 3. Payment Method
- Cash on Delivery (COD) - Active
- Online Payment - Coming soon (disabled)

#### 4. Order Notes
- Optional text area
- Special instructions

### Form Validation

**Client-Side Validation:**
```typescript
const validateForm = () => {
  const errors = {}
  
  if (!fullName.trim()) errors.fullName = 'Required'
  if (!email.trim()) errors.email = 'Required'
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid'
  if (!phone.trim()) errors.phone = 'Required'
  if (!addressLine1.trim()) errors.addressLine1 = 'Required'
  if (!city.trim()) errors.city = 'Required'
  if (!postalCode.trim()) errors.postalCode = 'Required'
  
  return Object.keys(errors).length === 0
}
```

**Error Display:**
- Red border on invalid fields
- Error message below field
- Clears on user input

### Order Creation

**Process:**

1. **Validate Form**
   - Check all required fields
   - Validate email format
   - Show errors if invalid

2. **Prepare Order Data**
   ```typescript
   const orderData = {
     email: formData.email,
     firstName: nameParts[0],
     lastName: nameParts.slice(1).join(' '),
     phone: formData.phone,
     shippingAddress: {
       addressLine1: formData.addressLine1,
       addressLine2: formData.addressLine2,
       city: formData.city,
       postalCode: formData.postalCode,
       country: formData.country
     },
     items: items.map(item => ({
       productId: item.productId,
       variantId: item.variantId,
       quantity: item.quantity
     })),
     paymentMethod: 'COD'
   }
   ```

3. **Send to Backend**
   - POST to `/api/orders/create`
   - Include JWT token if authenticated
   - Handle errors

4. **On Success**
   - Clear cart
   - Redirect to order confirmation
   - Pass order ID in URL

5. **On Error**
   - Display error message
   - Keep form data
   - Allow retry

### Backend Order Processing

**Endpoint:** `POST /api/orders/create`  
**Middleware:** `optionalAuth`

**Process:**

1. **Extract Data**
   - Email, firstName, lastName, phone
   - Shipping address
   - Items array
   - Payment method

2. **Validate Items**
   - Fetch each product from database
   - Find variant by SKU
   - Check stock availability
   - Calculate price (use sale price if available)

3. **Build Order Items**
   ```javascript
   orderItems.push({
     productId: product._id,
     productName: product.name,
     productCode: product.productCode,
     color: variant.color,
     size: variant.size,
     quantity: item.quantity,
     priceAtPurchase: price
   })
   ```

4. **Calculate Total**
   - Sum all item totals
   - Add shipping (currently 0)
   - Add tax (currently 0)

5. **Create Order**
   ```javascript
   const order = await Order.create({
     supabaseUserId: req.userId || null,
     email,
     firstName,
     lastName,
     phone,
     shippingAddress,
     items: orderItems,
     totalAmount,
     paymentMethod,
     status: 'PENDING'
   })
   ```

6. **Clear Database Cart** (if authenticated)
   - Find user's cart
   - Call `cart.clearCart()`

7. **Return Order**
   - Send order object to frontend
   - Include order ID for confirmation page

## Order Confirmation

**Route:** `/order-confirmation?orderId=xxx`  
**File:** `app/order-confirmation/page.tsx`

**Features:**

### Success Message
- Green checkmark icon
- "Order Confirmed!" heading
- Thank you message
- Order number display

### Order Details

#### Order Items
- Product name
- Color and size
- Quantity
- Price per item
- Item total

#### Order Summary
- Subtotal
- Shipping (Free)
- Total

#### Shipping Address
- Customer name
- Full address
- Phone number
- Email

#### Payment & Delivery
- Payment method (COD)
- Payment status (Pending)
- Delivery status (from order.status)
- Email notification message

### Actions
- Continue Shopping button
- Print Order button (window.print())

### Data Fetching

**Process:**
1. Get orderId from URL params
2. Fetch order from API: `GET /api/orders/:id`
3. Display order details
4. Handle loading state
5. Handle not found state

**Access Control:**
- Guests can view any order by ID
- Authenticated users can only view their own

## Integration Points

### Product Detail Page → Cart

**File:** `app/products/[slug]/page.tsx`

**Add to Cart Flow:**
1. User selects color and size
2. User sets quantity
3. Clicks "Add to Cart"
4. Calls `addItem(product.slug, variant.sku, quantity)`
5. Shows "Adding..." state
6. On success: Alert + redirect to `/cart`
7. On error: Show error message

### Cart Page → Checkout

**Navigation:**
- "Proceed to Checkout" button
- Links to `/checkout`
- Cart data accessed via Zustand store

### Checkout → Confirmation

**Navigation:**
- After successful order creation
- Redirects to `/order-confirmation?orderId=xxx`
- Order ID passed in URL

## Error Handling

### Cart Operations

**Errors:**
- Product not found
- Variant not found
- API errors
- Network errors

**Handling:**
- Log to console
- Set error state
- Throw error (caught by component)
- Show user-friendly message

### Checkout Errors

**Validation Errors:**
- Show inline error messages
- Highlight invalid fields
- Prevent submission

**API Errors:**
- "Cart is empty"
- "Insufficient stock"
- "Product not found"
- Network errors

**Handling:**
- Display alert with error message
- Keep form data
- Allow user to retry

### Order Confirmation Errors

**Errors:**
- Order not found
- Network error fetching order

**Handling:**
- Show "Order Not Found" page
- Provide "Back to Home" button

## Testing Checklist

### Cart Operations
- [x] Add item to cart
- [x] Add same item twice (quantity increases)
- [x] Update quantity
- [x] Remove item
- [x] Clear cart
- [x] Cart persists on refresh
- [x] Cart badge updates

### Checkout Flow
- [x] Form validation works
- [x] Required fields enforced
- [x] Email validation
- [x] Order summary correct
- [x] Guest checkout succeeds
- [x] Authenticated checkout succeeds
- [x] Cart clears after order

### Order Confirmation
- [x] Order details display
- [x] Guest can view order
- [x] Authenticated user can view order
- [x] Print button works
- [x] Continue shopping works

## Performance Considerations

### Cart Operations
- **Instant updates** - No API calls
- **Minimal re-renders** - Zustand selective subscriptions
- **Optimized storage** - Only essential data stored

### Checkout
- **Client-side validation** - Instant feedback
- **Debounced input** - Reduce re-renders
- **Lazy loading** - Components load on demand

## Security Considerations

### Cart Data
- **Client-side storage** - Not sensitive data
- **No payment info** - Stored in cart
- **Validation on backend** - Don't trust client

### Order Creation
- **Backend validation** - Check stock, prices
- **Price from database** - Not from client
- **Authentication optional** - Guest checkout allowed
- **Order access** - Guests by ID, users by ownership

## Future Enhancements

1. **Cart Sync**
   - Sync local cart to database on login
   - Merge carts if both exist
   - Cross-device cart access

2. **Saved Carts**
   - Save cart for later
   - Multiple saved carts
   - Share cart via link

3. **Stock Warnings**
   - Show "Only X left" message
   - Prevent adding more than available
   - Update on stock changes

4. **Discount Codes**
   - Apply coupon codes
   - Percentage or fixed discounts
   - Validation and expiry

5. **Shipping Calculator**
   - Calculate shipping based on location
   - Multiple shipping options
   - Delivery time estimates

6. **Payment Integration**
   - PayHere gateway
   - Card payments
   - Digital wallets

## Conclusion

The shopping cart and checkout system is fully functional with local storage, guest checkout support, and seamless order creation. The system prioritizes user experience with instant updates and minimal friction while maintaining data integrity through backend validation.
