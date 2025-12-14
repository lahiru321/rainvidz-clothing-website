# Backend API Server

Node.js + Express + MongoDB backend for the clothing website e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- MongoDB Atlas account (or local MongoDB)
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Create .env file and add your credentials
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js              # Supabase JWT verification
│   └── adminAuth.js         # Admin role checking
├── models/
│   ├── Collection.js        # Collections model
│   ├── Category.js          # Categories model
│   ├── Product.js           # Products model (with variants & images)
│   ├── User.js              # User profiles model
│   ├── AdminUser.js         # Admin users model
│   ├── Cart.js              # Shopping cart model
│   ├── Order.js             # Orders model
│   └── NewsletterSubscriber.js
├── routes/                  # API routes (to be added)
├── utils/                   # Utility functions
├── server.js                # Express server entry point
├── .env                     # Environment variables
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing_website

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key
```

## 📊 Database Models

### Collection
- name, slug, description, imageUrl
- isActive, displayOrder

### Category
- name, slug, description

### Product
- name, slug, productCode, description
- price, salePrice
- category, collection
- stockStatus, isNewArrival, isFeatured, soldCount
- **Embedded:** images[], variants[]

### User
- supabaseUserId (link to Supabase Auth)
- email, firstName, lastName, phone
- address, city, postalCode
- newsletterSubscribed

### AdminUser
- supabaseUserId
- role (admin | super_admin)

### Cart
- supabaseUserId
- **Embedded:** items[] (productId, variantId, quantity)

### Order
- supabaseUserId (optional for guest checkout)
- email, firstName, lastName, phone
- status, totalAmount, paymentMethod, paymentId
- shippingAddress
- **Embedded:** items[] (product snapshot)

### NewsletterSubscriber
- email, subscribed, source

## 🔐 Authentication

This backend uses **Supabase** for authentication:

1. Frontend authenticates users via Supabase
2. Frontend sends JWT token in Authorization header
3. Backend verifies token using `verifyAuth` middleware
4. User info is attached to `req.user`

### Middleware Usage

```javascript
const { verifyAuth } = require('./middleware/auth');
const { verifyAdmin } = require('./middleware/adminAuth');

// Protected route (requires authentication)
router.get('/cart', verifyAuth, getCart);

// Admin-only route
router.post('/admin/products', verifyAuth, verifyAdmin, createProduct);
```

## 🛣️ API Endpoints (To Be Implemented)

### Public Routes
- `GET /api/products` - List products
- `GET /api/products/:slug` - Get product details
- `GET /api/collections` - List collections
- `GET /api/categories` - List categories

### Protected Routes (Auth Required)
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `POST /api/orders` - Create order

### Admin Routes (Admin Auth Required)
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-12-03T...",
  "environment": "development"
}
```

## 📝 Next Steps

1. **Set up MongoDB Atlas**
   - Create account at mongodb.com/cloud/atlas
   - Create cluster
   - Get connection string
   - Update MONGODB_URI in .env

2. **Set up Supabase**
   - Create project at supabase.com
   - Enable email/password auth
   - Get URL and service role key
   - Update .env

3. **Start server**
   ```bash
   npm run dev
   ```

4. **Implement API routes**
   - Products routes
   - Cart routes
   - Orders routes
   - Admin routes

## 🤝 Contributing

This is the backend for the clothing website e-commerce platform.

## 📄 License

ISC
