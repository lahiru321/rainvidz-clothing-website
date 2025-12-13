"use client"

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
