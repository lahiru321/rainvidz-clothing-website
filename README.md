# Rainvidz - Bohemian Clothing E-Commerce Website

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8?style=flat-square&logo=tailwind-css)

A modern, full-stack e-commerce website for a Sri Lankan clothing brand featuring a bohemian/hippie aesthetic. Built with Next.js 16, React 19, and designed for seamless shopping experiences.

## 🌟 Features

### Current Features (Frontend)
- ✅ **Responsive Design** - Mobile-first approach with beautiful layouts
- ✅ **Auto-playing Hero Carousel** - Ken Burns effect with smooth transitions
- ✅ **Product Showcase** - Multiple sections (New Arrivals, Trending, Collections)
- ✅ **Advanced Filtering & Sorting** - Filter by size, color, category; Sort by price, popularity
- ✅ **Dynamic Collections** - Collection-based product organization
- ✅ **Shopping Cart** - Add to cart functionality with live counter
- ✅ **Smooth Animations** - Premium feel with custom CSS animations
- ✅ **Dark Mode Ready** - Theme system in place
- ✅ **SEO Optimized** - Proper metadata and semantic HTML

### Planned Features (Backend - In Progress)
- 🔄 **User Authentication** - Login/Register with Supabase Auth
- 🔄 **Database Integration** - PostgreSQL via Supabase
- 🔄 **Payment Gateway** - PayHere & WebXPay integration for Sri Lankan market
- 🔄 **Admin Dashboard** - Product, order, and customer management
- 🔄 **Order Management** - Full checkout flow with order tracking
- 🔄 **Email Notifications** - Order confirmations and newsletters
- 🔄 **Persistent Cart** - Database-backed shopping cart for logged-in users

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16.0.3 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4.1.9
- **Icons:** Lucide React
- **Carousel:** Embla Carousel
- **UI Components:** Radix UI
- **Animations:** Custom CSS Keyframes

### Backend (Planned)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Payment:** PayHere, WebXPay
- **Email:** Resend (planned)

## 📁 Project Structure

```
rainvidz-clothing-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Homepage
│   ├── shop/                    # Shop page
│   ├── new-arrivals/            # New arrivals page
│   ├── collections/[slug]/      # Dynamic collection pages
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── header.tsx               # Navigation header
│   ├── footer.tsx               # Site footer
│   ├── hero-section.tsx         # Hero carousel
│   ├── product-card.tsx         # Product display card
│   ├── filter-sort.tsx          # Filtering & sorting UI
│   ├── about-section.tsx        # About Us section
│   └── ui/                      # Radix UI components
├── lib/                         # Utilities and data
│   └── data.ts                  # Product data (temporary)
├── documentation/               # Comprehensive docs
│   ├── README.md                # Documentation index
│   ├── 01-project-setup.md      # Setup guide
│   ├── 02-design-system.md      # Design tokens
│   ├── 15-backend-migration-plan.md  # Backend blueprint
│   └── ...                      # 16 detailed docs
└── public/                      # Static assets
```

## 🎨 Design Philosophy

**Bohemian/Hippie Aesthetic** with:
- 🌿 Earthy, natural color palette (sage greens, creams, blacks)
- ✨ Elegant serif typography (Playfair Display)
- 🎯 Clean, minimalist layouts
- 💫 Smooth, premium animations
- 🌱 Sustainable, eco-conscious vibe

### Color Palette
- **Primary:** `#819A91` (Sage Green)
- **Secondary:** `#A7C1A8` (Light Sage)
- **Accent:** `#819A91` (Sage Green)
- **Background:** `#ffffff` / `#0a0a0a` (Light/Dark)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/lahiru321/rainvidz-clothing-website.git
   cd rainvidz-clothing-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📖 Documentation

Comprehensive documentation is available in the `/documentation` folder:

- **[00-SUMMARY.md](./documentation/00-SUMMARY.md)** - Project overview
- **[01-project-setup.md](./documentation/01-project-setup.md)** - Setup guide
- **[02-design-system.md](./documentation/02-design-system.md)** - Design tokens
- **[15-backend-migration-plan.md](./documentation/15-backend-migration-plan.md)** - Backend blueprint
- **[README.md](./documentation/README.md)** - Full documentation index

## 🗺️ Roadmap

### Phase 1: Frontend ✅ (Completed)
- [x] Project setup and design system
- [x] Homepage with hero carousel
- [x] Product display components
- [x] Collection pages
- [x] Filtering and sorting
- [x] Responsive design

### Phase 2: Backend Integration 🔄 (In Progress)
- [ ] Supabase setup and schema
- [ ] User authentication
- [ ] Product database migration
- [ ] Shopping cart persistence
- [ ] Checkout flow

### Phase 3: Payment & Orders 📋 (Planned)
- [ ] PayHere integration
- [ ] Order management
- [ ] Email notifications
- [ ] Order tracking

### Phase 4: Admin Dashboard 📋 (Planned)
- [ ] Admin authentication
- [ ] Product management
- [ ] Order management
- [ ] Analytics dashboard

### Phase 5: Launch 🚀 (Planned)
- [ ] Production deployment
- [ ] Performance optimization
- [ ] SEO enhancements
- [ ] Analytics integration

## 🌐 Deployment

The site is designed to be deployed on **Vercel** (recommended) or any Node.js hosting platform.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lahiru321/rainvidz-clothing-website)

### Environment Variables (For Backend)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payment Gateway (PayHere)
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
NEXT_PUBLIC_PAYHERE_SANDBOX=true

# Site
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

## 🤝 Contributing

This is a private commercial project. For collaboration inquiries, please contact the project owner.

## 📝 License

All rights reserved. This is proprietary software for Rainvidz.

## 👥 Team

- **Developer:** [Your Name]
- **Design:** Bohemian/Hippie aesthetic
- **Target Market:** Sri Lanka

## 📞 Contact

For inquiries about the project:
- **GitHub:** [@lahiru321](https://github.com/lahiru321)
- **Repository:** [rainvidz-clothing-website](https://github.com/lahiru321/rainvidz-clothing-website)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Radix UI for accessible components
- Unsplash for placeholder images
- TailwindCSS for the utility-first CSS framework

---

**Built with ❤️ for Rainvidz** | Last Updated: November 2025
