# API Documentation

Base URL: `http://localhost:5000/api`

## 🔓 Public Endpoints (No Authentication Required)

### Products

#### Get All Products
```
GET /api/products
```

**Query Parameters:**
- `category` - Filter by category ID
- `collection` - Filter by collection ID
- `isNewArrival` - Filter new arrivals (true/false)
- `isFeatured` - Filter featured products (true/false)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `color` - Filter by color
- `size` - Filter by size
- `sortBy` - Sort field (price, soldCount, name, createdAt)
- `order` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example:**
```bash
GET /api/products?category=123&sortBy=price&order=asc&page=1&limit=12
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "pages": 5
  }
}
```

#### Get Product by Slug
```
GET /api/products/:slug
```

**Example:**
```bash
GET /api/products/novela-tee-black
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Novela Tee - Black",
    "slug": "novela-tee-black",
    "price": 3290,
    "images": [...],
    "variants": [...]
  }
}
```

#### Get Product Variants
```
GET /api/products/:id/variants
```

---

### Collections

#### Get All Collections
```
GET /api/collections
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Summer Collection",
      "slug": "summer-collection",
      "imageUrl": "..."
    }
  ]
}
```

#### Get Collection by Slug
```
GET /api/collections/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "collection": {...},
    "products": [...]
  }
}
```

---

### Categories

#### Get All Categories
```
GET /api/categories
```

#### Get Category by Slug
```
GET /api/categories/:slug
```

---

## 🔒 Protected Endpoints (Authentication Required)

**Authentication:** Include Supabase JWT token in Authorization header:
```
Authorization: Bearer <your-supabase-jwt-token>
```

### Cart

#### Get User's Cart
```
GET /api/cart
```

**Response:**
```json
{
  "success": true,
  "data": {
    "supabaseUserId": "...",
    "items": [
      {
        "productId": {...},
        "variantId": "...",
        "quantity": 2,
        "addedAt": "..."
      }
    ]
  }
}
```

#### Add Item to Cart
```
POST /api/cart/add
```

**Body:**
```json
{
  "productId": "product-id-here",
  "variantId": "variant-sku-or-id",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {...}
}
```

#### Update Cart Item Quantity
```
PUT /api/cart/update/:itemId
```

**Body:**
```json
{
  "quantity": 3
}
```

#### Remove Item from Cart
```
DELETE /api/cart/remove/:itemId
```

#### Clear Cart
```
DELETE /api/cart/clear
```

---

### Orders

#### Create Order
```
POST /api/orders/create
```

**Body:**
```json
{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+94771234567",
  "shippingAddress": {
    "addressLine1": "123 Main St",
    "city": "Colombo",
    "postalCode": "10100"
  },
  "paymentMethod": "PAYHERE",
  "items": [
    // For guest checkout only
    {
      "productId": "...",
      "variantId": "...",
      "quantity": 1
    }
  ]
}
```

**Note:** If authenticated, items are taken from cart. For guest checkout, provide items in request body.

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "...",
    "orderNumber": "ORD-12345678",
    "status": "PENDING",
    "totalAmount": 6580,
    ...
  }
}
```

#### Get User's Orders
```
GET /api/orders/user
```

#### Get Specific Order
```
GET /api/orders/:id
```

---

## 🔧 Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-12-03T...",
  "environment": "development"
}
```

---

## 📝 Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing with cURL

### Get all products
```bash
curl http://localhost:5000/api/products
```

### Get product by slug
```bash
curl http://localhost:5000/api/products/novela-tee-black
```

### Get collections
```bash
curl http://localhost:5000/api/collections
```

### Add to cart (requires auth token)
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": "product-id",
    "variantId": "variant-sku",
    "quantity": 1
  }'
```

---

## 📊 Next Steps

- [ ] Add admin routes (`/api/admin/*`)
- [ ] Add payment webhook (`/api/webhooks/payment`)
- [ ] Add data seeding script
- [ ] Add API rate limiting
- [ ] Add request validation middleware
