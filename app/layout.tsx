import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Playfair_Display } from "next/font/google"
import { AuthProvider } from "@/lib/contexts/AuthContext"
import { ToastProvider } from "@/lib/contexts/ToastContext"
import { ConfirmDialogProvider } from "@/lib/contexts/ConfirmDialogContext"

const geist = Geist({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: {
    default: 'Rainvidz - Bohemian Fashion & Clothing',
    template: '%s | Rainvidz'
  },
  description: 'Discover unique bohemian fashion and free-spirited clothing. Shop our curated collection of dresses, tops, and accessories in Sri Lanka.',
  keywords: ['bohemian clothing', 'hippie fashion', 'women clothing', 'sustainable fashion', 'Sri Lanka', 'Rainvidz', 'boho style', 'free spirit fashion'],
  authors: [{ name: 'Rainvidz' }],
  creator: 'Rainvidz',
  publisher: 'Rainvidz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rainvidz.com',
    siteName: 'Rainvidz',
    title: 'Rainvidz - Bohemian Fashion & Clothing',
    description: 'Discover unique bohemian fashion and free-spirited clothing. Shop our curated collection in Sri Lanka.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rainvidz Bohemian Fashion Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rainvidz - Bohemian Fashion & Clothing',
    description: 'Discover unique bohemian fashion and free-spirited clothing.',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${playfair.variable}`}>
        <AuthProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              {children}
            </ConfirmDialogProvider>
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
