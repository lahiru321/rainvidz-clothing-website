# Testing API with Postman/Thunder Client

This guide shows you how to test all CRUD operations for your clothing website API.

## 🚀 Getting Started

### Option 1: Postman (Desktop App)
1. Download from [postman.com](https://www.postman.com/downloads/)
2. Install and open Postman
3. Create a new Collection called "Clothing Website API"

### Option 2: Thunder Client (VS Code Extension)
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Thunder Client"
4. Install and click the Thunder Client icon in sidebar

---

## 📋 Base Configuration

**Base URL:** `http://localhost:5000`

**Make sure your backend server is running:**
```bash
cd backend
npm run dev
```

---

## 🧪 Testing Public Endpoints (No Auth Required)

### 1. Health Check
**Method:** `GET`  
**URL:** `http://localhost:5000/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-12-03T...",
  "environment": "development"
}
```

---

### 2. Get All Products
**Method:** `GET`  
**URL:** `http://localhost:5000/api/products`

**Query Parameters (Optional):**
- `page=1`
- `limit=12`
- `sortBy=price`
- `order=asc`
- `category=<category-id>`
- `isNewArrival=true`
- `isFeatured=true`

**Example with filters:**
```
http://localhost:5000/api/products?isNewArrival=true&sortBy=price&order=asc
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Novela Tee - Black",
      "slug": "novela-tee-black",
      "price": 3290,
      "images": [...],
      "variants": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 8,
    "pages": 1
  }
}
```

---

### 3. Get Product by Slug
**Method:** `GET`  
**URL:** `http://localhost:5000/api/products/novela-tee-black`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Novela Tee - Black",
    "slug": "novela-tee-black",
    "productCode": "NT-BLK-001",
    "price": 3290,
    "category": {
      "_id": "...",
      "name": "Tops",
      "slug": "tops"
    },
    "variants": [
      {
        "color": "Black",
        "size": "S",
        "quantity": 15,
        "sku": "NT-BLK-S"
      }
    ]
  }
}
```

---

### 4. Get All Collections
**Method:** `GET`  
**URL:** `http://localhost:5000/api/collections`

---

### 5. Get Collection by Slug
**Method:** `GET`  
**URL:** `http://localhost:5000/api/collections/summer-collection`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "collection": {
      "_id": "...",
      "name": "Summer Collection",
      "slug": "summer-collection"
    },
    "products": [...]
  }
}
```

---

### 6. Get All Categories
**Method:** `GET`  
**URL:** `http://localhost:5000/api/categories`

---

### 7. Get Category by Slug
**Method:** `GET`  
**URL:** `http://localhost:5000/api/categories/tops`

---

## 🔒 Testing Protected Endpoints (Auth Required)

For these endpoints, you need a Supabase JWT token.

### Getting a Token (Temporary Workaround for Testing)

Since you don't have the frontend auth yet, you can:

**Option A: Use Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Go to Authentication > Users
3. Create a test user
4. Use Supabase API to get a token

**Option B: Skip Auth for Testing (Temporary)**
I can create a test route that bypasses auth for development.

### Setting Up Authorization Header in Postman

1. Click on the request
2. Go to "Headers" tab
3. Add new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer YOUR_TOKEN_HERE`

---

### 8. Get User's Cart
**Method:** `GET`  
**URL:** `http://localhost:5000/api/cart`  
**Headers:**
```
Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "supabaseUserId": "...",
    "items": []
  }
}
```

---

### 9. Add Item to Cart
**Method:** `POST`  
**URL:** `http://localhost:5000/api/cart/add`  
**Headers:**
```
Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "productId": "693076f3229df710d79ae6ed",
  "variantId": "NT-BLK-S",
  "quantity": 2
}
```

**Steps in Postman:**
1. Select `POST` method
2. Enter URL
3. Go to "Headers" tab, add Authorization header
4. Go to "Body" tab
5. Select "raw" and "JSON"
6. Paste the JSON body
7. Click "Send"

**Expected Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "items": [
      {
        "productId": {...},
        "variantId": "NT-BLK-S",
        "quantity": 2
      }
    ]
  }
}
```

---

### 10. Update Cart Item Quantity
**Method:** `PUT`  
**URL:** `http://localhost:5000/api/cart/update/:itemId`  
**Headers:** Authorization + Content-Type

**Body (JSON):**
```json
{
  "quantity": 3
}
```

---

### 11. Remove Item from Cart
**Method:** `DELETE`  
**URL:** `http://localhost:5000/api/cart/remove/:itemId`  
**Headers:** Authorization

---

### 12. Clear Cart
**Method:** `DELETE`  
**URL:** `http://localhost:5000/api/cart/clear`  
**Headers:** Authorization

---

### 13. Create Order (Guest Checkout)
**Method:** `POST`  
**URL:** `http://localhost:5000/api/orders/create`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+94771234567",
  "shippingAddress": {
    "addressLine1": "123 Main Street",
    "city": "Colombo",
    "postalCode": "10100"
  },
  "paymentMethod": "PAYHERE",
  "items": [
    {
      "productId": "693076f3229df710d79ae6ed",
      "variantId": "NT-BLK-S",
      "quantity": 1
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "...",
    "orderNumber": "ORD-12345678",
    "status": "PENDING",
    "totalAmount": 3290,
    "email": "customer@example.com"
  }
}
```

---

### 14. Get User's Orders
**Method:** `GET`  
**URL:** `http://localhost:5000/api/orders/user`  
**Headers:** Authorization

---

### 15. Get Specific Order
**Method:** `GET`  
**URL:** `http://localhost:5000/api/orders/:orderId`  
**Headers:** Authorization

---

## 🎯 Quick Testing Workflow

### Test Complete User Journey

1. **Browse Products**
   ```
   GET /api/products
   ```

2. **View Product Details**
   ```
   GET /api/products/novela-tee-black
   ```

3. **Create Order (Guest)**
   ```
   POST /api/orders/create
   Body: {email, firstName, lastName, phone, shippingAddress, items}
   ```

---

## 🔧 Postman Collection Setup

### Create Environment Variables

1. Click "Environments" in Postman
2. Create new environment "Development"
3. Add variables:
   - `baseUrl` = `http://localhost:5000`
   - `apiUrl` = `http://localhost:5000/api`
   - `authToken` = `YOUR_TOKEN_HERE` (when you get one)

4. Use variables in requests:
   ```
   {{apiUrl}}/products
   ```

---

## 📊 Testing Advanced Features

### Filter by Category
```
GET {{apiUrl}}/products?category=693076f3229df710d79ae6e6
```

### Filter by Price Range
```
GET {{apiUrl}}/products?minPrice=2000&maxPrice=4000
```

### Filter by Color and Size
```
GET {{apiUrl}}/products?color=Black&size=M
```

### Sort by Best Selling
```
GET {{apiUrl}}/products?sortBy=soldCount
```

### Pagination
```
GET {{apiUrl}}/products?page=1&limit=4
```

---

## ❌ Testing Error Responses

### 404 - Product Not Found
```
GET {{apiUrl}}/products/non-existent-slug
```

**Expected:**
```json
{
  "success": false,
  "error": "Product not found"
}
```

### 400 - Invalid Request
```
POST {{apiUrl}}/cart/add
Body: {} (empty)
```

### 401 - Unauthorized
```
GET {{apiUrl}}/cart
(without Authorization header)
```

**Expected:**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "No authorization token provided"
}
```

---

## 💡 Pro Tips

### 1. Save Requests
- Save each request in a Postman Collection
- Organize by folders (Products, Cart, Orders, etc.)

### 2. Use Tests Tab
Add automatic tests in Postman:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    pm.expect(pm.response.json()).to.have.property('success');
});
```

### 3. Extract IDs Automatically
In Tests tab:
```javascript
// Save product ID for later use
const response = pm.response.json();
pm.environment.set("productId", response.data[0]._id);
```

Then use `{{productId}}` in other requests.

### 4. Thunder Client (VS Code)
- Click Thunder Client icon in sidebar
- Click "New Request"
- Same process as Postman but integrated in VS Code

---

## 🎬 Quick Start Checklist

- [ ] Install Postman or Thunder Client
- [ ] Start backend server (`npm run dev`)
- [ ] Test health endpoint
- [ ] Get all products
- [ ] Get product by slug
- [ ] Get collections
- [ ] Get categories
- [ ] Create a guest order
- [ ] (Optional) Set up Supabase auth to test protected routes

---

## 📝 Sample Postman Collection

I can create a ready-to-import Postman collection file if you want! Just let me know.

---

**Need Help?**
- Check server is running: `http://localhost:5000/health`
- Check server logs in terminal for errors
- Verify MongoDB is connected (check terminal output)
