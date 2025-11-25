# Backend Migration & Database Plan (Supabase) - COMPLETE

## 1. Overview
This document outlines the complete strategy for migrating the current static clothing website to a dynamic, database-driven application using **Supabase**. Every aspect of the site (products, collections, navigation, images, orders, users) will be manageable via a backend and Admin Dashboard.

## 2. Database Schema Design

We will use a relational database structure (PostgreSQL) hosted on Supabase.

### A. Core Tables

#### 1. `collections`
Manages the collections shown in the dropdown and on the homepage.
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `categories`
Manages product categories (Tops, Bottoms, Dresses, etc.).
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `products`
The main product inventory.
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  product_code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  stock_status TEXT DEFAULT 'IN_STOCK' CHECK (stock_status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK')),
  is_new_arrival BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `product_variants`
Manages specific combinations of Color and Size with inventory.
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  sku TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, color, size)
);
```

#### 5. `product_images`
Allows multiple images per product.
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_hover BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6. `profiles`
Extended user information (linked to Supabase Auth).
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  city TEXT,
  postal_code TEXT,
  newsletter_subscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 7. `admin_users`
Defines which users have admin access.
```sql
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 8. `carts`
Persistent shopping cart for logged-in users.
```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### 9. `cart_items`
Items in a user's cart.
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_variant_id)
);
```

#### 10. `orders`
Customer orders.
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Guest checkout fields
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Order details
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED')),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('PAYHERE', 'WEBXPAY', 'COD')),
  payment_id TEXT,
  tracking_number TEXT,
  
  -- Address snapshot
  shipping_address JSONB NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 11. `order_items`
Items in an order.
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  -- Snapshot at time of purchase
  product_name TEXT NOT NULL,
  product_code TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 12. `newsletter_subscribers`
Email list for marketing.
```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'checkout',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### B. Storage (Supabase Storage)

Create public buckets for media assets:

```javascript
// Bucket: products
{
  public: true,
  fileSizeLimit: 5242880, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
}

// Bucket: collections
{
  public: true,
  fileSizeLimit: 10485760, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
}

// Bucket: content
{
  public: true,
  fileSizeLimit: 5242880,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
}
```

### C. Row Level Security (RLS) Policies

#### Public Read Access (All Users)
```sql
-- Collections
CREATE POLICY "Public can view active collections" ON collections
  FOR SELECT USING (is_active = true);

-- Categories
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

-- Products
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

-- Product Variants
CREATE POLICY "Public can view variants" ON product_variants
  FOR SELECT USING (true);

-- Product Images
CREATE POLICY "Public can view images" ON product_images
  FOR SELECT USING (true);
```

#### Authenticated User Access
```sql
-- Profiles (users can only see/edit their own)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Carts
CREATE POLICY "Users can manage own cart" ON carts
  FOR ALL USING (auth.uid() = user_id);

-- Cart Items
CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

-- Orders (users can view their own)
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
```

#### Admin Access
```sql
-- Helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies (full access to all tables)
CREATE POLICY "Admins have full access to products" ON products
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to collections" ON collections
  FOR ALL USING (is_admin());

-- Repeat for all tables...
```

## 3. Feature Requirements

### A. User Authentication
- **Login/Register:** Email & Password authentication via Supabase Auth.
- **Social Login (Optional):** Google, Facebook OAuth.
- **Password Reset:** Email-based recovery.
- **My Account:** View order history and manage saved addresses.

### B. Product Detail Page
When a product is selected, display:
- **Info:** Name, Price, Product Code, Description.
- **Selection:**
    - **Color:** Visual swatches (fetched from `product_variants`).
    - **Size:** Buttons (S, M, L) (fetched from `product_variants`).
    - **Quantity:** Selector (max limited by stock).
- **Actions:**
    - **Add to Cart:** Adds to cart (DB if logged in, localStorage if guest).
    - **Buy Now:** Immediately redirects to Checkout with this single item.

### C. Shopping Cart
- **Guest Cart:** Stored in localStorage.
- **User Cart:** Stored in database (`carts` + `cart_items`).
- **Cart Sync:** When guest logs in, merge localStorage cart with DB cart.
- **Operations:** Add, Remove, Update quantity, Clear cart.

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
- Checkbox: "Save this information for next time" (Updates `profiles` table if logged in)

**Order Summary:**
- List of products (Image, Name, Variant, Qty, Price)
- Subtotal, Shipping, Total Price

**Payment Flow:**
1.  User fills details → Clicks "Pay Now"
2.  Order created in DB with status 'PENDING'
3.  User redirected to Payment Gateway (PayHere/WebXPay)
4.  **Success:** Gateway webhook → Update Order status to 'PAID' → Reduce stock → Show Success Page
5.  **Failure:** Update Order status to 'FAILED' → Show Error Page

**Webhook Endpoint:** `/api/webhooks/payment`
- Verify signature from payment gateway
- Update order status
- Send confirmation email
- Reduce product variant quantities

### E. Filtering & Sorting

**Frontend Requirement:**
- Filter by: Size, Color, Type (Category)
- Sort by: Featured, Availability, Best Selling, Price (High/Low), Newest

**Backend Implementation:**
```sql
-- Filter by category
WHERE category_id = $1

-- Filter by size/color (using variants)
WHERE id IN (
  SELECT DISTINCT product_id 
  FROM product_variants 
  WHERE color = ANY($1::text[]) 
    AND size = ANY($2::text[])
    AND quantity > 0
)

-- Filter by availability
WHERE stock_status = 'IN_STOCK'

-- Sort by price
ORDER BY price ASC/DESC

-- Sort by newest
ORDER BY created_at DESC

-- Sort by best selling
ORDER BY sold_count DESC

-- Sort by featured
ORDER BY is_featured DESC, created_at DESC
```

## 4. Admin Dashboard Requirements

Protected Admin Panel (`/admin`) with the following features:

### A. Authentication
- Admin login (separate from customer login)
- Role-based access (admin vs super_admin)
- Session management

### B. Dashboard Overview
- Total orders (today, this week, this month)
- Revenue statistics
- Low stock alerts
- Recent orders

### C. Product Management
- **List View:** Searchable, filterable table
- **Add Product:**
  - Basic info (name, code, description, price)
  - Category & Collection assignment
  - Variant manager (add colors/sizes with quantities)
  - Image uploader (drag-and-drop to Supabase Storage)
  - SEO fields (slug, meta description)
- **Edit Product:** Update all fields
- **Delete Product:** Soft delete (mark as inactive)
- **Bulk Actions:** Update prices, categories, etc.

### D. Collection Management
- CRUD operations for collections
- Upload collection banner images
- Reorder collections (drag-and-drop)

### E. Order Management
- **List View:** Filter by status, date range
- **Order Details:** View full order information
- **Update Status:** Mark as Processing, Shipped, Delivered
- **Add Tracking Number**
- **Print Invoice**
- **Refund Order** (if applicable)

### F. Customer Management
- View customer list
- View customer order history
- Export customer data

### G. Settings
- Payment gateway configuration
- Shipping settings
- Email templates
- Newsletter management

## 5. Implementation Plan

### Phase 1: Setup & Schema (Week 1)
1.  **Initialize Supabase Project**
    - Create project on Supabase dashboard
    - Get API keys (anon, service_role)
2.  **Database Migration**
    - Run SQL scripts to create all tables
    - Set up RLS policies
    - Create indexes for performance
3.  **Auth Setup**
    - Enable Email/Password provider
    - Configure email templates
    - Set up admin user manually
4.  **Storage Setup**
    - Create buckets (products, collections, content)
    - Set bucket policies

### Phase 2: Data Seeding (Week 1-2)
1.  **Migration Script**
    - Convert `lib/data.ts` to SQL inserts
    - Upload existing images to Supabase Storage
    - Update image URLs in database
2.  **Test Data**
    - Create sample orders
    - Create test users
    - Create admin user

### Phase 3: Frontend Integration - Public (Week 2-3)
1.  **Install Dependencies**
    ```bash
    npm install @supabase/ssr @supabase/supabase-js
    npm install zod react-hook-form @hookform/resolvers
    ```
2.  **Supabase Client Setup**
    - Create client utilities for server/client components
    - Set up environment variables
3.  **Data Fetching**
    - Replace `lib/data.ts` with Supabase queries
    - Update all pages to fetch from DB
    - Implement caching strategy
4.  **Product Detail Page**
    - Create `app/products/[slug]/page.tsx`
    - Implement variant selection
    - Add to cart functionality
5.  **Cart System**
    - Build cart context/state management
    - Implement cart sync for logged-in users
    - Create cart page
6.  **Checkout Page**
    - Build multi-step form
    - Implement validation with Zod
    - Create order summary

### Phase 4: Payment Integration (Week 3-4)
1.  **PayHere Setup**
    - Register merchant account
    - Get sandbox credentials
    - Test integration
2.  **API Routes**
    - `/api/checkout` - Create order, generate payment hash
    - `/api/webhooks/payment` - Handle payment notifications
3.  **Payment Flow**
    - Implement redirect to gateway
    - Handle success/failure callbacks
    - Send confirmation emails

### Phase 5: Admin Panel (Week 4-6)
1.  **Admin Layout**
    - Create `/app/admin` route group
    - Build sidebar navigation
    - Implement auth guard middleware
2.  **Product Management**
    - Build product list with DataTable
    - Create product form with variant manager
    - Implement image upload
3.  **Order Management**
    - Build order list
    - Create order detail view
    - Implement status updates
4.  **Dashboard**
    - Build analytics widgets
    - Implement charts (revenue, orders)

### Phase 6: Testing & Optimization (Week 6-7)
1.  **Testing**
    - End-to-end testing (Playwright)
    - Payment flow testing
    - Admin panel testing
2.  **Performance**
    - Implement caching
    - Optimize images
    - Database query optimization
3.  **Security**
    - Review RLS policies
    - Test authentication flows
    - Implement rate limiting

### Phase 7: Deployment (Week 7-8)
1.  **Production Setup**
    - Configure production Supabase project
    - Set up environment variables
    - Configure domain
2.  **Migration**
    - Run production database migrations
    - Upload production images
3.  **Go Live**
    - Deploy to Vercel
    - Monitor errors
    - Set up analytics

## 6. API Endpoints

### Public API
- `GET /api/products` - List products with filters
- `GET /api/products/[slug]` - Get product details
- `GET /api/collections` - List collections
- `GET /api/collections/[slug]` - Get collection products
- `POST /api/cart` - Add to cart
- `POST /api/checkout` - Create order
- `POST /api/webhooks/payment` - Payment notifications

### Admin API
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - List orders
- `PUT /api/admin/orders/[id]` - Update order status
- `POST /api/admin/upload` - Upload images

## 7. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payment Gateway (PayHere)
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
NEXT_PUBLIC_PAYHERE_SANDBOX=true

# Email (Optional - for order confirmations)
RESEND_API_KEY=your-resend-key
EMAIL_FROM=noreply@yoursite.com

# Site
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

## 8. Next Steps

**Ready to proceed with Phase 1: Setup & Schema**

Would you like me to:
1.  Generate the complete SQL migration script?
2.  Set up the Supabase client configuration files?
3.  Create the admin authentication system first?
4.  Start with the payment gateway integration?

Choose your starting point and we'll implement it step by step!
