# Backend Migration & Database Plan (Hybrid Architecture) - UPDATED

## 1. Overview
This document outlines the complete strategy for migrating the current static clothing website to a dynamic, database-driven application using a **hybrid architecture**:
- **Supabase** - User authentication only
- **Node.js + Express** - Backend API server
- **MongoDB** - Database for all application data

Every aspect of the site (products, collections, navigation, images, orders, users) will be manageable via a backend and Admin Dashboard.

## 2. Database Schema Design (MongoDB)

We will use MongoDB (NoSQL) for flexible, scalable data storage.

### A. Core Collections

#### 1. `collections`
Manages the collections shown in the dropdown and on the homepage.
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique, required),
  description: String,
  imageUrl: String,
  isActive: Boolean (default: true),
  displayOrder: Number (default: 0),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.collections.createIndex({ slug: 1 }, { unique: true })
db.collections.createIndex({ isActive: 1, displayOrder: 1 })
```

#### 2. `categories`
Manages product categories (Tops, Bottoms, Dresses, etc.).
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique, required),
  description: String,
  createdAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.categories.createIndex({ slug: 1 }, { unique: true })
```

#### 3. `products`
The main product inventory.
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique, required),
  productCode: String (unique, required),
  description: String (required),
  price: Number (required),
  salePrice: Number,
  category: ObjectId (ref: 'categories'),
  collection: ObjectId (ref: 'collections'),
  stockStatus: String (enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'], default: 'IN_STOCK'),
  isNewArrival: Boolean (default: false),
  isFeatured: Boolean (default: false),
  soldCount: Number (default: 0),
  
  // Embedded images array
  images: [{
    url: String (required),
    isPrimary: Boolean (default: false),
    isHover: Boolean (default: false),
    displayOrder: Number (default: 0)
  }],
  
  // Embedded variants array
  variants: [{
    color: String (required),
    size: String (required),
    quantity: Number (default: 0),
    sku: String (unique, required)
  }],
  
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ productCode: 1 }, { unique: true })
db.products.createIndex({ category: 1 })
db.products.createIndex({ collection: 1 })
db.products.createIndex({ isNewArrival: 1 })
db.products.createIndex({ isFeatured: 1 })
db.products.createIndex({ soldCount: -1 })
db.products.createIndex({ "variants.sku": 1 }, { unique: true, sparse: true })
```

#### 4. `users`
Extended user information (Supabase user ID as reference).
```javascript
{
  _id: ObjectId,
  supabaseUserId: String (unique, required), // Link to Supabase Auth
  email: String (required),
  firstName: String,
  lastName: String,
  phone: String,
  addressLine1: String,
  city: String,
  postalCode: String,
  newsletterSubscribed: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.users.createIndex({ supabaseUserId: 1 }, { unique: true })
db.users.createIndex({ email: 1 })
```

#### 5. `adminUsers`
Defines which users have admin access.
```javascript
{
  _id: ObjectId,
  supabaseUserId: String (unique, required),
  role: String (enum: ['admin', 'super_admin'], default: 'admin'),
  createdAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.adminUsers.createIndex({ supabaseUserId: 1 }, { unique: true })
```

#### 6. `carts`
Persistent shopping cart for logged-in users.
```javascript
{
  _id: ObjectId,
  supabaseUserId: String (unique, required),
  items: [{
    productId: ObjectId (ref: 'products'),
    variantId: String, // Reference to variant within product
    quantity: Number (default: 1),
    addedAt: Date (default: Date.now)
  }],
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.carts.createIndex({ supabaseUserId: 1 }, { unique: true })
db.carts.createIndex({ "items.productId": 1 })
```

#### 7. `orders`
Customer orders.
```javascript
{
  _id: ObjectId,
  supabaseUserId: String, // Optional for guest checkout
  
  // Guest checkout fields
  email: String (required),
  firstName: String (required),
  lastName: String (required),
  phone: String (required),
  
  // Order details
  status: String (enum: ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED'], default: 'PENDING'),
  totalAmount: Number (required),
  paymentMethod: String (enum: ['PAYHERE', 'WEBXPAY', 'COD']),
  paymentId: String,
  trackingNumber: String,
  
  // Address snapshot
  shippingAddress: {
    addressLine1: String (required),
    city: String (required),
    postalCode: String (required)
  },
  
  // Order items (embedded)
  items: [{
    productId: ObjectId (ref: 'products'),
    productName: String (required),
    productCode: String (required),
    color: String (required),
    size: String (required),
    quantity: Number (required),
    priceAtPurchase: Number (required)
  }],
  
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.orders.createIndex({ supabaseUserId: 1 })
db.orders.createIndex({ email: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ paymentId: 1 })
```

#### 8. `newsletterSubscribers`
Email list for marketing.
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  subscribed: Boolean (default: true),
  source: String (default: 'checkout'),
  createdAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.newsletterSubscribers.createIndex({ email: 1 }, { unique: true })
```

### B. Storage (Cloudinary)

Instead of Supabase Storage, we'll use **Cloudinary** for image hosting:

**Configuration:**
```javascript
// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload folders
- /products - Product images
- /collections - Collection banners
- /content - General content images
```

**Benefits:**
- Free tier: 25GB storage, 25GB bandwidth
- Automatic image optimization
- On-the-fly transformations
- CDN delivery
- Easy integration with Node.js

### C. Authentication (Supabase)

Supabase will handle ONLY authentication:

**Features:**
- Email/Password authentication
- Email verification
- Password reset
- Session management
- JWT token generation

**Integration with Node.js:**
```javascript
// Verify Supabase JWT in Node.js middleware
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  req.user = user
  next()
}
```

## 3. Feature Requirements

### A. User Authentication (Supabase)
- **Login/Register:** Email & Password authentication via Supabase Auth.
- **Social Login (Optional):** Google, Facebook OAuth.
- **Password Reset:** Email-based recovery.
- **My Account:** View order history and manage saved addresses (stored in MongoDB).

### B. Product Detail Page
When a product is selected, display:
- **Info:** Name, Price, Product Code, Description (from MongoDB).
- **Selection:**
    - **Color:** Visual swatches (from product.variants).
    - **Size:** Buttons (S, M, L) (from product.variants).
    - **Quantity:** Selector (max limited by variant.quantity).
- **Actions:**
    - **Add to Cart:** Adds to cart (localStorage for guests, MongoDB for logged-in users).
    - **Buy Now:** Immediately redirects to Checkout with this single item.

### C. Shopping Cart
- **Guest Cart:** Stored in localStorage.
- **User Cart:** Stored in MongoDB `carts` collection.
- **Cart Sync:** When guest logs in, merge localStorage cart with MongoDB cart.
- **Operations:** Add, Remove, Update quantity, Clear cart (via Node.js API).

### D. Checkout & Payment

**Gateway:** Integration with Sri Lankan providers:
- **PayHere** (Primary)
- **WebXPay** (Alternative)
- **Cash on Delivery** (COD)

**Checkout Form Fields:**
- Email (Checkbox: "Subscribe to news & offers")
- First Name, Last Name
- Address, City, Postal Code
- Phone Number
- Checkbox: "Save this information for next time" (Updates MongoDB `users` collection if logged in)

**Order Summary:**
- List of products (Image, Name, Variant, Qty, Price)
- Subtotal, Shipping, Total Price

**Payment Flow:**
1.  User fills details → Clicks "Pay Now"
2.  Order created in MongoDB with status 'PENDING'
3.  User redirected to Payment Gateway (PayHere/WebXPay)
4.  **Success:** Gateway webhook → Update Order status to 'PAID' → Reduce stock in MongoDB → Show Success Page
5.  **Failure:** Update Order status to 'FAILED' → Show Error Page

**Webhook Endpoint:** `POST /api/webhooks/payment` (Node.js)
- Verify signature from payment gateway
- Update order status in MongoDB
- Send confirmation email
- Reduce product variant quantities

### E. Filtering & Sorting

**Frontend Requirement:**
- Filter by: Size, Color, Type (Category)
- Sort by: Featured, Availability, Best Selling, Price (High/Low), Newest

**Backend Implementation (MongoDB queries):**
```javascript
// Filter by category
db.products.find({ category: categoryId })

// Filter by size/color (using variants)
db.products.find({
  'variants': {
    $elemMatch: {
      color: { $in: ['Black', 'White'] },
      size: { $in: ['S', 'M'] },
      quantity: { $gt: 0 }
    }
  }
})

// Filter by availability
db.products.find({ stockStatus: 'IN_STOCK' })

// Sort by price
db.products.find().sort({ price: 1 }) // ASC
db.products.find().sort({ price: -1 }) // DESC

// Sort by newest
db.products.find().sort({ createdAt: -1 })

// Sort by best selling
db.products.find().sort({ soldCount: -1 })

// Sort by featured
db.products.find().sort({ isFeatured: -1, createdAt: -1 })
```

## 4. Admin Dashboard Requirements

Protected Admin Panel (`/admin`) with the following features:

### A. Authentication
- Admin login via Supabase Auth
- Role-based access (check `adminUsers` collection in MongoDB)
- Session management
- Redirect non-admin users

### B. Dashboard Overview
- Total orders (today, this week, this month) - MongoDB aggregation
- Revenue statistics - MongoDB aggregation
- Low stock alerts - Query products with low variant quantities
- Recent orders - Query latest orders

### C. Product Management
- **List View:** Searchable, filterable table (MongoDB queries)
- **Add Product:**
  - Basic info (name, code, description, price)
  - Category & Collection assignment (reference to MongoDB collections)
  - Variant manager (add colors/sizes with quantities)
  - Image uploader (upload to Cloudinary, store URLs in MongoDB)
  - SEO fields (slug, meta description)
- **Edit Product:** Update all fields in MongoDB
- **Delete Product:** Remove from MongoDB
- **Bulk Actions:** Update prices, categories, etc.

### D. Collection Management
- CRUD operations for collections (MongoDB)
- Upload collection banner images (Cloudinary)
- Reorder collections (update displayOrder field)

### E. Order Management
- **List View:** Filter by status, date range (MongoDB queries)
- **Order Details:** View full order information from MongoDB
- **Update Status:** Mark as Processing, Shipped, Delivered (update MongoDB)
- **Add Tracking Number** (update MongoDB)
- **Print Invoice** (generate PDF from order data)
- **Refund Order** (if applicable, update status)

### F. Customer Management
- View customer list (from MongoDB `users` collection)
- View customer order history (query `orders` by supabaseUserId)
- Export customer data (CSV export)

### G. Settings
- Payment gateway configuration (stored in MongoDB or env vars)
- Shipping settings (MongoDB)
- Email templates (MongoDB or file-based)
- Newsletter management (query `newsletterSubscribers`)

## 5. Implementation Plan

### Phase 1: Backend Setup (Week 1)
1.  **Initialize Node.js Project**
    - Create `backend` directory
    - Initialize with `npm init`
    - Install dependencies (express, mongoose, cors, dotenv, etc.)
2.  **MongoDB Setup**
    - Create MongoDB Atlas account (or use local MongoDB)
    - Create database cluster
    - Get connection string
    - Create `.env` file with MongoDB URI
3.  **Express Server Setup**
    - Create `server.js` entry point
    - Configure Express middleware (CORS, JSON parsing)
    - Set up MongoDB connection with Mongoose
    - Test basic server startup
4.  **Supabase Auth Setup**
    - Create Supabase project
    - Enable Email/Password provider
    - Get API keys (URL, anon key, service role key)
    - Configure email templates

### Phase 2: Database Models & Middleware (Week 1-2)
5.  **Create Mongoose Models**
    - `models/Collection.js`
    - `models/Category.js`
    - `models/Product.js`
    - `models/User.js`
    - `models/AdminUser.js`
    - `models/Cart.js`
    - `models/Order.js`
    - `models/NewsletterSubscriber.js`
6.  **Authentication Middleware**
    - `middleware/auth.js` - Verify Supabase JWT tokens
    - `middleware/adminAuth.js` - Check admin role from MongoDB
7.  **Data Seeding**
    - Create seed script to migrate data from `lib/data.ts` to MongoDB
    - Upload existing images to Cloudinary
    - Update image URLs in database

### Phase 3: API Routes Development (Week 2-3)
8.  **Public API Routes**
    - `routes/products.js` - GET products, GET product by slug
    - `routes/collections.js` - GET collections
    - `routes/categories.js` - GET categories
9.  **Protected API Routes (Auth Required)**
    - `routes/cart.js` - Cart CRUD operations
    - `routes/orders.js` - Create order, get user orders
10. **Admin API Routes (Admin Auth Required)**
    - `routes/admin/products.js` - Product CRUD
    - `routes/admin/orders.js` - Order management
    - `routes/admin/dashboard.js` - Analytics
11. **Payment Routes**
    - `routes/checkout.js` - Initiate payment
    - `routes/webhooks/payment.js` - Handle payment callbacks

### Phase 4: Frontend Integration - Supabase Auth (Week 3)
12. **Install Supabase in Next.js**
    ```bash
    npm install @supabase/ssr @supabase/supabase-js
    ```
13. **Supabase Client Setup**
    - `lib/supabase/client.ts` - Client-side Supabase client
    - `lib/supabase/server.ts` - Server-side Supabase client
    - `lib/supabase/middleware.ts` - Auth middleware for Next.js
14. **Auth Pages**
    - `app/auth/login/page.tsx` - Login page
    - `app/auth/register/page.tsx` - Registration page
    - `app/auth/reset-password/page.tsx` - Password reset

### Phase 5: Frontend Integration - API Client (Week 3-4)
15. **API Client Setup**
    - Install axios: `npm install axios`
    - `lib/api/client.ts` - Axios instance with auth token interceptor
    - `lib/api/products.ts` - Product API functions
    - `lib/api/cart.ts` - Cart API functions
    - `lib/api/orders.ts` - Order API functions
16. **Replace Static Data**
    - Update `app/page.tsx` to fetch from API
    - Update all section components to use API data
    - Implement loading states
    - Implement error handling
17. **Product Detail Page**
    - Create `app/products/[slug]/page.tsx`
    - Fetch product by slug from API
    - Implement variant selection
    - Add to cart functionality
18. **Cart Page**
    - Create `app/cart/page.tsx`
    - Display cart items from API
    - Update quantity, remove items
    - Calculate totals

### Phase 6: Checkout & Payment (Week 4-5)
19. **Checkout Page**
    - Create `app/checkout/page.tsx`
    - Multi-step form (shipping info, payment method)
    - Form validation with Zod
    - Order summary
20. **PayHere Integration**
    - Register PayHere merchant account
    - Get sandbox credentials
    - Implement payment initiation in Node.js
    - Create payment hash
21. **Webhook Handler**
    - Implement `POST /api/webhooks/payment`
    - Verify payment signature
    - Update order status in MongoDB
    - Reduce stock quantities
    - Send confirmation email (optional: use Resend or SendGrid)

### Phase 7: Admin Dashboard (Week 5-6)
22. **Admin Layout**
    - Create `app/admin/layout.tsx`
    - Auth guard (check Supabase auth + admin role from MongoDB)
    - Sidebar navigation
23. **Product Management**
    - `app/admin/products/page.tsx` - Product list
    - `app/admin/products/new/page.tsx` - Add product form
    - `app/admin/products/[id]/edit/page.tsx` - Edit product
    - Image upload to Cloudinary
24. **Order Management**
    - `app/admin/orders/page.tsx` - Order list
    - `app/admin/orders/[id]/page.tsx` - Order details
    - Status update functionality
25. **Dashboard**
    - `app/admin/dashboard/page.tsx`
    - Display analytics from MongoDB aggregations
    - Charts (optional: use Recharts or Chart.js)

### Phase 8: Testing & Deployment (Week 6-7)
26. **Testing**
    - Write API tests with Jest + Supertest
    - Test authentication flow
    - Test payment flow (sandbox)
    - Manual testing of all features
27. **Backend Deployment**
    - Deploy to Railway, Render, or DigitalOcean
    - Set up production environment variables
    - Configure MongoDB Atlas production cluster
    - Set up Cloudinary production account
28. **Frontend Deployment**
    - Deploy to Vercel
    - Set up production environment variables
    - Configure custom domain
29. **Monitoring**
    - Set up error logging (Sentry)
    - Monitor API performance
    - Set up uptime monitoring

## 6. API Endpoints

### Public API (No Auth Required)
- `GET /api/products` - List products with filters (category, collection, price range, sort)
- `GET /api/products/:slug` - Get single product details
- `GET /api/collections` - List all active collections
- `GET /api/collections/:slug` - Get collection with products
- `GET /api/categories` - List all categories

### Protected API (Auth Required - Supabase JWT)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `GET /api/orders/user` - Get user's order history
- `GET /api/orders/:id` - Get specific order details

### Checkout API
- `POST /api/checkout/create-order` - Create order and initiate payment
- `POST /api/webhooks/payment` - Payment gateway webhook (PayHere/WebXPay)

### Admin API (Admin Auth Required)
- `GET /api/admin/products` - List all products (with pagination)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/:id/upload-image` - Upload product image to Cloudinary
- `GET /api/admin/orders` - List all orders (with filters)
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/tracking` - Add tracking number
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/recent-orders` - Get recent orders
- `GET /api/admin/dashboard/low-stock` - Get low stock products

## 7. Environment Variables

### Frontend (.env.local)
```env
# Supabase (Auth Only)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Node.js Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
# Production: NEXT_PUBLIC_API_URL=https://api.yoursite.com

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Production: NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

### Backend (.env)
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing_website?retryWrites=true&w=majority

# Supabase (for JWT verification)
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PayHere Payment Gateway
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
PAYHERE_SANDBOX=true
# Production: PAYHERE_SANDBOX=false

# Server Configuration
PORT=5000
NODE_ENV=development
# Production: NODE_ENV=production

# CORS (Allowed Origins)
ALLOWED_ORIGINS=http://localhost:3000,https://yoursite.com

# JWT Secret (for additional token signing if needed)
JWT_SECRET=your-random-secret-key

# Email (Optional - for order confirmations)
# RESEND_API_KEY=your-resend-api-key
# EMAIL_FROM=noreply@yoursite.com
```

## 8. Next Steps

**Ready to proceed with implementation!**

### Recommended Starting Order:
1. **Backend Setup** - Create Node.js + Express server with MongoDB
2. **Supabase Auth** - Set up authentication in Next.js
3. **API Development** - Build REST API endpoints
4. **Frontend Integration** - Connect Next.js to backend API
5. **Payment Integration** - Implement PayHere
6. **Admin Dashboard** - Build admin panel

Would you like me to:
1. **Start with Backend Setup** - Create the Node.js server structure?
2. **Set up Supabase Auth** - Configure authentication first?
3. **Create MongoDB Models** - Define Mongoose schemas?
4. **Generate API Routes** - Build the REST API?

Choose your starting point and we'll implement it step by step!
