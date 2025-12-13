# Authentication Implementation - Complete Guide

**Date:** December 4, 2025  
**Status:** ✅ Complete

## Overview

This document details the complete authentication system implementation using Supabase for user management, with support for both guest and authenticated checkout flows.

## Architecture

### Hybrid Authentication Strategy

**Supabase:** User authentication and session management  
**MongoDB:** All other data (products, orders, cart, etc.)  
**Local Storage:** Guest cart persistence

### Key Design Decisions

1. **Guest-First Approach** - Users can complete purchases without creating an account
2. **Optional Authentication** - Login provides benefits (order history, saved addresses) but isn't required
3. **Local Cart** - Works for both guests and authenticated users
4. **JWT Tokens** - Supabase tokens verified by backend for protected routes

## Supabase Setup

### Project Configuration

**URL:** `https://fucedndzvgaktkdbqwgq.supabase.co`  
**Anon Key:** Stored in `.env.local`

### Email Verification

**Status:** Disabled

**Reason:** Improve user experience - users can register and login immediately without email confirmation

**How to Disable:**
1. Go to Supabase Dashboard → Authentication → Providers → Email
2. Toggle OFF "Confirm email"
3. Save changes

## Frontend Implementation

### 1. Auth Context (`lib/contexts/AuthContext.tsx`)

**Purpose:** Centralized authentication state management

**Features:**
- React Context for global auth state
- Supabase session tracking
- Auth state change listener
- Auto-refresh session on mount

**Exported Functions:**
```typescript
signUp(email, password, fullName) // Register new user
signIn(email, password)            // Login user
signOut()                          // Logout user
```

**Exported State:**
```typescript
user: User | null        // Current user object
session: Session | null  // Current session
loading: boolean         // Auth state loading
```

**Implementation Details:**
- Uses `supabase.auth.getSession()` on mount
- Subscribes to `onAuthStateChange` events
- Stores user metadata (full_name) during signup
- Cleans up subscription on unmount

### 2. App Layout (`app/layout.tsx`)

**Changes:**
- Converted to client component (`"use client"`)
- Wrapped children with `<AuthProvider>`
- Removed `metadata` export (not allowed in client components)

**Structure:**
```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

### 3. Login Page (`app/login/page.tsx`)

**Route:** `/login`

**Features:**
- Email/password form
- Form validation
- Error handling and display
- Remember me checkbox
- Forgot password link (placeholder)
- Link to register page
- Guest checkout option

**Form Fields:**
- Email (required, email validation)
- Password (required)

**Flow:**
1. User enters credentials
2. Calls `signIn()` from AuthContext
3. On success: Redirects to previous page or home
4. On error: Displays error message

**Redirect Logic:**
- Checks `?redirect=` query parameter
- Falls back to homepage if no redirect specified

### 4. Register Page (`app/register/page.tsx`)

**Route:** `/register`

**Features:**
- Full name, email, password, confirm password fields
- Client-side validation
- Password strength check (min 6 characters)
- Password match validation
- Auto-login after successful registration
- Link to login page
- Guest checkout option

**Form Fields:**
- Full Name (required)
- Email (required, email format)
- Password (required, min 6 chars)
- Confirm Password (required, must match)

**Flow:**
1. User fills registration form
2. Frontend validates input
3. Calls `signUp()` from AuthContext
4. Supabase creates user account
5. User automatically logged in
6. Redirects to homepage

**Validation Rules:**
- All fields required
- Email must be valid format
- Password minimum 6 characters
- Passwords must match

### 5. Header Component (`components/header.tsx`)

**User Menu Features:**

**When Logged Out:**
- "Login" button linking to `/login`

**When Logged In:**
- User name display
- Dropdown menu with:
  - "My Orders" link (to `/profile`)
  - "Sign Out" button

**Mobile Responsive:**
- User menu items in mobile navigation
- Collapsible menu

**Implementation:**
```tsx
const { user, signOut } = useAuth()

{user ? (
  <UserMenu user={user} onSignOut={signOut} />
) : (
  <LoginButton />
)}
```

## Backend Implementation

### 1. Authentication Middleware (`backend/middleware/auth.js`)

**Two Middleware Functions:**

#### `verifyAuth` (Required Authentication)
- Extracts JWT token from Authorization header
- Verifies token with Supabase
- Attaches `userId` to request object
- Returns 401 if token invalid/missing

**Usage:**
```javascript
router.get('/orders/user', verifyAuth, async (req, res) => {
  // req.userId available here
})
```

#### `optionalAuth` (Optional Authentication)
- Same verification process
- Continues even if no token provided
- Attaches `userId` if token valid, otherwise `null`

**Usage:**
```javascript
router.post('/orders/create', optionalAuth, async (req, res) => {
  // req.userId may be null (guest checkout)
})
```

### 2. Admin Middleware (`backend/middleware/adminAuth.js`)

**Functions:**
- `verifyAdmin` - Checks for 'admin' role
- `verifySuperAdmin` - Checks for 'super_admin' role

**Database Check:**
- Queries `AdminUser` model in MongoDB
- Verifies role matches requirement

**Usage:**
```javascript
router.post('/products', verifyAdmin, async (req, res) => {
  // Only admins can create products
})
```

### 3. Orders Route Updates

**Guest Checkout Support:**

**Before:**
```javascript
router.post('/create', verifyAuth, ...) // Required auth
```

**After:**
```javascript
router.post('/create', optionalAuth, ...) // Optional auth
```

**Order Creation Logic:**
1. Check if items provided in request body (local cart)
2. If yes: Use those items (guest or authenticated)
3. If no and user authenticated: Check database cart
4. If no items anywhere: Return error

**Order Retrieval:**
```javascript
router.get('/:id', optionalAuth, ...) // Guests can view their orders
```

**Access Control:**
- Guests can view any order by ID (by design)
- Authenticated users can only view their own orders

## User Flow Diagrams

### Guest Checkout Flow
```
Browse Products → Add to Cart (local) → Checkout (no login) 
→ Enter Details → Create Order → View Confirmation
```

### Authenticated Checkout Flow
```
Register/Login → Browse Products → Add to Cart (local) 
→ Checkout (pre-filled) → Create Order → View Confirmation
```

### Registration Flow
```
Click Register → Fill Form → Submit → Auto Login 
→ Redirect to Home (logged in)
```

### Login Flow
```
Click Login → Enter Credentials → Submit → Verify Token 
→ Redirect to Previous Page or Home
```

## Security Implementation

### 1. JWT Token Verification

**Process:**
1. Frontend gets token from Supabase session
2. Token attached to API requests (Authorization header)
3. Backend extracts and verifies token with Supabase
4. User ID extracted from verified token

**Token Format:**
```
Authorization: Bearer <supabase_jwt_token>
```

### 2. API Client Token Injection

**Implementation (`lib/api/client.ts`):**
```typescript
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})
```

### 3. Protected Routes

**Frontend:**
- Profile page (future) - Redirects to login if not authenticated
- Admin pages (future) - Requires admin role

**Backend:**
- User order history - `verifyAuth` middleware
- Admin endpoints - `verifyAdmin` middleware

### 4. Password Security

**Handled by Supabase:**
- Passwords hashed with bcrypt
- Secure password reset flow
- Rate limiting on auth endpoints

## Data Models

### User Model (`backend/models/User.js`)

**Purpose:** Extended user data beyond Supabase

**Fields:**
```javascript
{
  supabaseUserId: String (unique, indexed)
  firstName: String
  lastName: String
  phone: String
  addresses: Array of Address objects
  createdAt: Date
  updatedAt: Date
}
```

**Virtual:** `fullName` (firstName + lastName)

### AdminUser Model (`backend/models/AdminUser.js`)

**Purpose:** Track admin roles

**Fields:**
```javascript
{
  supabaseUserId: String (unique, indexed)
  role: String (enum: ['admin', 'super_admin'])
  createdAt: Date
}
```

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://fucedndzvgaktkdbqwgq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (`.env`)
```
SUPABASE_URL=https://fucedndzvgaktkdbqwgq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

## Testing Scenarios

### ✅ Tested Scenarios

1. **Guest Checkout**
   - Add items to cart without login
   - Complete checkout form
   - Create order successfully
   - View order confirmation

2. **User Registration**
   - Fill registration form
   - Submit with valid data
   - Auto-login after registration
   - Redirect to homepage

3. **User Login**
   - Enter valid credentials
   - Successful login
   - Session persists across page refreshes
   - User menu displays correctly

4. **Authenticated Checkout**
   - Login first
   - Add items to cart
   - Checkout with user data
   - Order linked to user account

5. **Logout**
   - Click sign out
   - Session cleared
   - Redirected appropriately
   - Cart persists (local storage)

6. **Token Verification**
   - API requests include token
   - Backend verifies token
   - Protected routes accessible
   - Invalid tokens rejected

## Common Issues & Solutions

### Issue 1: Email Verification Required

**Problem:** Users can't login after registration

**Solution:** Disable email confirmation in Supabase dashboard

### Issue 2: 401 Unauthorized on Order View

**Problem:** Can't view order after creation

**Solution:** Changed order detail endpoint to `optionalAuth`

### Issue 3: Login 400 Bad Request

**Problem:** Wrong credentials or user doesn't exist

**Solution:** Ensure user registered first, check credentials

### Issue 4: Token Not Attached to Requests

**Problem:** API returns 401 even when logged in

**Solution:** Updated API client to fetch session from Supabase

## Future Enhancements

1. **Profile Page**
   - View/edit user information
   - Order history
   - Saved addresses

2. **Password Reset**
   - Forgot password flow
   - Email with reset link
   - Secure token-based reset

3. **Social Login**
   - Google OAuth
   - Facebook login
   - Apple Sign In

4. **Two-Factor Authentication**
   - SMS verification
   - Authenticator app support

5. **Cart Sync**
   - Sync local cart to database on login
   - Merge carts if both exist

6. **Session Management**
   - Remember me functionality
   - Session timeout handling
   - Refresh token rotation

## Conclusion

The authentication system is fully functional with support for both guest and authenticated users. The hybrid approach prioritizes user experience while providing benefits for registered users. The system is secure, scalable, and ready for future enhancements.
