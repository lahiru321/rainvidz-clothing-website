# Homepage Content Management System

**Date:** December 11, 2025  
**Objective:** Enable dynamic management of homepage hero slides and collection banners through an admin interface with Cloudinary image upload integration.

---

## Overview

This feature allows administrators to create, edit, and manage homepage content (hero slides and collection banners) through a dedicated admin interface. Content is stored in MongoDB and fetched dynamically by the homepage components.

---

## Backend Implementation

### 1. Database Model

**File:** `backend/models/HomeSection.js`

Created a flexible `HomeSection` model to handle both hero slides and collection banners:

```javascript
const homeSectionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['hero', 'banner'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    description: String,
    season: String,
    imageUrl: {
        type: String,
        required: true
    },
    backgroundColor: String,
    ctaText: String,
    ctaLink: String,
    displayOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
```

**Key Features:**
- `type` field distinguishes between hero slides and collection banners
- `isActive` flag to show/hide content without deleting
- `displayOrder` for controlling content sequence
- Flexible optional fields for different content types

### 2. API Routes

#### Public Routes
**File:** `backend/routes/homeSections.js`

```javascript
// GET /api/home-sections?type=hero|banner
router.get('/', async (req, res) => {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    
    const sections = await HomeSection.find(query)
        .sort({ displayOrder: 1, createdAt: -1 });
    
    res.json({ success: true, data: sections });
});
```

**Endpoints:**
- `GET /api/home-sections?type=hero` - Fetch active hero slides
- `GET /api/home-sections?type=banner` - Fetch active collection banners

#### Admin Routes
**File:** `backend/routes/admin/homeSections.js`

Protected routes for CRUD operations:

```javascript
// All routes protected by verifyAuth and verifyAdmin middleware
router.get('/', getAllHomeSections);        // List all sections
router.get('/:id', getHomeSectionById);     // Get single section
router.post('/', createHomeSection);        // Create new section
router.put('/:id', updateHomeSection);      // Update section
router.delete('/:id', deleteHomeSection);   // Delete section
```

**Features:**
- Full CRUD operations
- Admin authentication required
- Validation for required fields
- Error handling with descriptive messages

### 3. Cloudinary Integration

#### Configuration
**File:** `backend/config/cloudinary.js`

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOptions = {
    folder: 'clothing-website',
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
    ]
};

module.exports = { cloudinary, uploadOptions };
```

#### Upload Routes
**File:** `backend/routes/admin/upload.js`

```javascript
// POST /api/admin/upload - Single image upload
router.post('/', upload.single('image'), async (req, res) => {
    // Uploads to Cloudinary and returns secure URL
});

// DELETE /api/admin/upload/:publicId - Delete image
router.delete('/:publicId(*)', async (req, res) => {
    // Removes image from Cloudinary
});
```

**Features:**
- Multer for file handling (memory storage)
- 5MB file size limit
- JPG/PNG format validation
- Returns Cloudinary URL, public ID, dimensions, and file size

#### Environment Variables
**File:** `backend/.env`

Required Cloudinary credentials:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Server Registration

**File:** `backend/server.js`

Registered new routes:
```javascript
// Public routes
app.use('/api/home-sections', require('./routes/homeSections'));

// Admin routes
app.use('/api/admin/home-sections', require('./routes/admin/homeSections'));
app.use('/api/admin/upload', require('./routes/admin/upload'));
```

**Important:** Increased JSON body size limit to 50MB to support large payloads:
```javascript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

---

## Frontend Implementation

### 1. API Client Layer

#### Public API Client
**File:** `lib/api/homeSections.ts`

```typescript
export const getHeroSlides = async () => {
    return apiClient.get('/home-sections?type=hero');
};

export const getCollectionBanners = async () => {
    return apiClient.get('/home-sections?type=banner');
};
```

#### Admin API Client
**File:** `lib/api/admin/homeSections.ts`

```typescript
export const getAllHomeSections = async (type?: string) => {
    const params = type ? { type } : {};
    return apiClient.get('/admin/home-sections', { params });
};

export const getHomeSection = async (id: string) => {
    return apiClient.get(`/admin/home-sections/${id}`);
};

export const createHomeSection = async (data: HomeSectionCreateData) => {
    return apiClient.post('/admin/home-sections', data);
};

export const updateHomeSection = async (id: string, data: HomeSectionUpdateData) => {
    return apiClient.put(`/admin/home-sections/${id}`, data);
};

export const deleteHomeSection = async (id: string) => {
    return apiClient.delete(`/admin/home-sections/${id}`);
};
```

#### Upload API Client
**File:** `lib/api/admin/upload.ts`

```typescript
export const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data;
};

export const deleteImage = async (publicId: string) => {
    return apiClient.delete(`/admin/upload/${publicId}`);
};
```

### 2. Admin Pages

#### Homepage Content Listing
**File:** `app/admin/home-content/page.tsx`

**Features:**
- Lists all homepage sections (hero slides and banners)
- Filter tabs: All, Hero Slides, Collection Banners
- Display order and active status indicators
- Preview images
- Edit and delete actions
- "Add New Content" button

**Key Components:**
```typescript
const [sections, setSections] = useState<HomeSection[]>([]);
const [filter, setFilter] = useState<'all' | 'hero' | 'banner'>('all');

// Fetch sections based on filter
useEffect(() => {
    fetchSections();
}, [filter]);

// Delete handler with confirmation
const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
        await deleteHomeSection(id);
        fetchSections();
    }
};
```

#### Create New Content
**File:** `app/admin/home-content/new/page.tsx`

**Features:**
- Form to create new hero slide or collection banner
- Type selector (Hero Slide / Collection Banner)
- Conditional fields based on type
- Image upload with Cloudinary integration
- URL input as alternative to file upload
- File validation (size and format)
- Real-time image preview
- Error handling and display

**Form Fields:**
- **Common:** Type, Title, Image, Display Order, Active Status
- **Hero Slides:** Subtitle, CTA Text, CTA Link
- **Collection Banners:** Season, Description, Background Color, CTA Text, CTA Link

**Image Upload Implementation:**
```typescript
<input
    type="file"
    accept="image/jpeg,image/png"
    onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setError(`File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
                e.target.value = '';
                return;
            }

            // Validate file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Only JPG and PNG images are allowed');
                e.target.value = '';
                return;
            }

            // Upload to Cloudinary
            try {
                setLoading(true);
                setError(null);
                const { uploadImage } = await import('@/lib/api/admin/upload');
                const result = await uploadImage(file);
                setFormData({ ...formData, imageUrl: result.url });
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to upload image');
            } finally {
                setLoading(false);
                e.target.value = '';
            }
        }
    }}
/>
```

#### Edit Content
**File:** `app/admin/home-content/[id]/edit/page.tsx`

**Features:**
- Pre-filled form with existing data
- Same validation as create page
- Update and delete actions
- Next.js 15+ async params handling using `React.use()`

**Async Params Handling:**
```typescript
export default function EditHomeSectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // Unwrap Promise for Next.js 15+
    
    useEffect(() => {
        const fetchSection = async () => {
            const response = await getHomeSection(id);
            setFormData(response.data);
        };
        fetchSection();
    }, [id]);
}
```

### 3. Admin Navigation

**File:** `components/admin/AdminLayout.tsx`

Added "Homepage Content" to admin sidebar:
```typescript
const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Collections', href: '/admin/collections', icon: Grid },
    { name: 'Homepage Content', href: '/admin/home-content', icon: Image },
];
```

### 4. Homepage Components

#### Hero Section
**File:** `components/hero-section.tsx`

**Changes:**
- Removed hardcoded slide data
- Fetches slides from API using `getHeroSlides()`
- Displays loading state
- Handles empty state
- Dynamic rendering based on API data

**Implementation:**
```typescript
const [slides, setSlides] = useState<HeroSlide[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchSlides = async () => {
        try {
            const response = await getHeroSlides();
            setSlides(response.data || []);
        } catch (error) {
            console.error('Error fetching hero slides:', error);
            setSlides([]);
        } finally {
            setLoading(false);
        }
    };
    fetchSlides();
}, []);
```

#### Collection Banner
**File:** `components/collection-banner.tsx`

**Complete Rewrite:**
- Removed complex scroll-based animations
- Simple, clean layout with flexbox
- Auto-rotation every 5 seconds for multiple banners
- Navigation dots for manual switching
- Responsive design (mobile and desktop)
- White text on colored backgrounds for visibility

**Key Features:**
```typescript
// Auto-rotate banners
useEffect(() => {
    if (collections.length <= 1) return;
    
    const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % collections.length);
    }, 5000);
    
    return () => clearInterval(interval);
}, [collections.length]);

// Dynamic background color
<section
    style={{ backgroundColor: currentBanner?.backgroundColor || '#A7C1A8' }}
>
    {/* Content */}
</section>
```

---

## Validation and Error Handling

### Frontend Validation

**File Upload:**
- File size: Maximum 5MB
- File format: JPG and PNG only
- Clear error messages with file size display

**Form Validation:**
- Title: Required
- Image: Required (URL or upload)
- Type: Required
- Display Order: Numeric validation

**Error Display:**
```typescript
{error && (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
        {error}
    </div>
)}
```

### Backend Validation

**Model Validation:**
- Required fields enforced by Mongoose schema
- Enum validation for `type` field
- Default values for optional fields

**Route Validation:**
- Authentication check (verifyAuth)
- Admin authorization check (verifyAdmin)
- File type and size validation in multer
- Error responses with descriptive messages

---

## User Flow

### Admin Creating Homepage Content

1. **Navigate:** Go to `/admin/home-content`
2. **Click:** "Add New Content" button
3. **Select Type:** Choose "Hero Slide" or "Collection Banner"
4. **Fill Form:**
   - Enter title and other required fields
   - Upload image (drag & drop or choose file) OR paste image URL
   - Set display order and active status
5. **Submit:** Click "Create Section"
6. **Redirect:** Returns to listing page showing new content

### Admin Editing Content

1. **Navigate:** Go to `/admin/home-content`
2. **Click:** "Edit" button on desired content
3. **Modify:** Update any fields
4. **Upload New Image:** (Optional) Replace existing image
5. **Submit:** Click "Update Section"
6. **Redirect:** Returns to listing page

### Admin Deleting Content

1. **Navigate:** Go to `/admin/home-content`
2. **Click:** "Delete" button on desired content
3. **Confirm:** Confirm deletion in browser alert
4. **Refresh:** Content removed from list

### Visitor Viewing Homepage

1. **Visit:** Homepage at `/`
2. **See:** Hero carousel with slides from database
3. **Scroll:** Collection banner section displays
4. **Auto-rotate:** Banners change every 5 seconds (if multiple)
5. **Click:** CTA buttons navigate to specified links

---

## File Structure

```
backend/
├── config/
│   └── cloudinary.js              # Cloudinary configuration
├── models/
│   └── HomeSection.js             # Database model
├── routes/
│   ├── homeSections.js            # Public API routes
│   └── admin/
│       ├── homeSections.js        # Admin CRUD routes
│       └── upload.js              # Cloudinary upload routes
└── server.js                      # Route registration

frontend/
├── app/
│   └── admin/
│       └── home-content/
│           ├── page.tsx           # Listing page
│           ├── new/
│           │   └── page.tsx       # Create page
│           └── [id]/
│               └── edit/
│                   └── page.tsx   # Edit page
├── components/
│   ├── hero-section.tsx           # Dynamic hero carousel
│   ├── collection-banner.tsx      # Dynamic collection banner
│   └── admin/
│       └── AdminLayout.tsx        # Updated navigation
└── lib/
    └── api/
        ├── homeSections.ts        # Public API client
        └── admin/
            ├── homeSections.ts    # Admin API client
            └── upload.ts          # Upload API client
```

---

## Technical Decisions

### 1. Single Model for Multiple Content Types
**Decision:** Use one `HomeSection` model with a `type` field instead of separate models.

**Rationale:**
- Reduces code duplication
- Easier to manage and query
- Flexible for future content types
- Simpler API structure

### 2. Cloudinary for Image Hosting
**Decision:** Use Cloudinary instead of local storage or base64 encoding.

**Rationale:**
- Professional CDN delivery
- Automatic image optimization
- No server storage concerns
- Built-in transformations
- Scalable solution

### 3. File Size Validation on Frontend
**Decision:** Validate file size before upload attempt.

**Rationale:**
- Better user experience
- Saves bandwidth
- Prevents server errors
- Immediate feedback
- Clear error messages

### 4. Simplified Collection Banner
**Decision:** Removed scroll-based animations in favor of simple auto-rotation.

**Rationale:**
- Scroll animations were causing visibility issues
- Simpler code is more maintainable
- Better cross-browser compatibility
- Auto-rotation provides dynamic feel
- Easier to debug and modify

### 5. Next.js 15+ Async Params
**Decision:** Use `React.use()` to handle async params in dynamic routes.

**Rationale:**
- Required for Next.js 15+ compatibility
- Follows official Next.js guidelines
- Prevents runtime errors
- Future-proof implementation

---

## Testing Checklist

### Backend
- [x] Create home section via API
- [x] Fetch all home sections
- [x] Fetch sections by type (hero/banner)
- [x] Update home section
- [x] Delete home section
- [x] Upload image to Cloudinary
- [x] Validate file size and format
- [x] Admin authentication required

### Frontend - Admin
- [x] List all homepage content
- [x] Filter by type (All/Hero/Banner)
- [x] Create new hero slide
- [x] Create new collection banner
- [x] Upload image via file input
- [x] Paste image URL
- [x] File size validation (5MB)
- [x] File format validation (JPG/PNG)
- [x] Edit existing content
- [x] Delete content
- [x] Toggle active status
- [x] Error messages display

### Frontend - Public
- [x] Hero carousel displays slides
- [x] Collection banner displays
- [x] Auto-rotation works (5s interval)
- [x] Navigation dots functional
- [x] CTA buttons navigate correctly
- [x] Responsive on mobile
- [x] Loading states show
- [x] Empty states handled

---

## Known Issues and Solutions

### Issue 1: Backend Server Crash
**Problem:** Server crashed with "Cannot find module '../../config/cloudinary'"

**Solution:** Created missing `backend/config/cloudinary.js` file with proper Cloudinary configuration.

### Issue 2: Upload Route 404
**Problem:** POST to `/api/admin/upload` returned 404

**Solution:** Registered upload route in `server.js`:
```javascript
app.use('/api/admin/upload', require('./routes/admin/upload'));
```

### Issue 3: Middleware Error
**Problem:** "Router.use() requires a middleware function" error

**Solution:** Fixed import statement in `upload.js`:
```javascript
// Before (incorrect)
const { verifyAuth, verifyAdmin } = require('../../middleware/auth');

// After (correct)
const { verifyAuth } = require('../../middleware/auth');
const { verifyAdmin } = require('../../middleware/adminAuth');
```

### Issue 4: Collection Banner Not Visible
**Problem:** Banner background showed but no text or image visible

**Root Cause:** 
- Dark background (#030826) with black text
- Complex scroll animations causing positioning issues

**Solution:** 
- Changed text colors to white
- Removed scroll-based animations
- Simplified layout structure
- Used flexbox instead of absolute positioning

### Issue 5: Payload Too Large
**Problem:** Large base64 images caused 413 error

**Solution:** Increased body size limit in `server.js`:
```javascript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

**Note:** This is now less relevant with Cloudinary integration, but kept for compatibility.

### Issue 6: Next.js 15 Params Undefined
**Problem:** `params.id` was undefined in edit page

**Solution:** Used `React.use()` to unwrap async params:
```typescript
const { id } = use(params);
```

---

## Future Enhancements

### Potential Improvements

1. **Drag-and-Drop Reordering**
   - Allow admins to reorder content by dragging
   - Update `displayOrder` automatically

2. **Bulk Actions**
   - Select multiple items
   - Bulk activate/deactivate
   - Bulk delete

3. **Image Cropping**
   - Built-in image editor
   - Crop and resize before upload
   - Maintain aspect ratios

4. **Preview Mode**
   - Preview content before publishing
   - See how it looks on homepage
   - Test different devices

5. **Scheduling**
   - Schedule content activation
   - Auto-activate/deactivate on dates
   - Seasonal content automation

6. **Analytics**
   - Track banner click-through rates
   - View engagement metrics
   - A/B testing support

7. **Version History**
   - Track content changes
   - Revert to previous versions
   - Audit trail

8. **Multi-language Support**
   - Translate content
   - Language-specific banners
   - Locale detection

---

## Maintenance Notes

### Regular Tasks

1. **Monitor Cloudinary Usage**
   - Check storage limits
   - Review bandwidth usage
   - Clean up unused images

2. **Review Active Content**
   - Ensure seasonal content is current
   - Update outdated banners
   - Refresh hero slides periodically

3. **Performance Monitoring**
   - Check image load times
   - Monitor API response times
   - Optimize large images

### Troubleshooting

**Images Not Loading:**
1. Check Cloudinary credentials in `.env`
2. Verify image URLs are valid
3. Check browser console for CORS errors

**Content Not Appearing:**
1. Verify `isActive` is set to `true`
2. Check `displayOrder` values
3. Ensure backend server is running
4. Check browser console for API errors

**Upload Failures:**
1. Verify file size < 5MB
2. Check file format (JPG/PNG only)
3. Ensure Cloudinary credentials are correct
4. Check network connection

---

## Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cloudinary` - Image hosting service
- `multer` - File upload handling
- `dotenv` - Environment variables

### Frontend
- `next` - React framework
- `react` - UI library
- `axios` - HTTP client
- `lucide-react` - Icons

---

## Environment Variables

### Required
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/clothing-website

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Conclusion

The Homepage Content Management System provides a complete solution for dynamically managing homepage hero slides and collection banners. With Cloudinary integration, file validation, and a user-friendly admin interface, administrators can easily update homepage content without touching code.

The system is scalable, maintainable, and follows best practices for both backend and frontend development. All components are fully functional and tested.
