"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Header from "@/components/header"
import ContentCards from "@/components/content-cards"
import NewArrivals from "@/components/new-arrivals"
import TrendingCollection from "@/components/trending-collection"
import ShopSection from "@/components/shop-section"
import Footer from "@/components/footer"

// Lazy load heavy components for better performance
const HeroSection = dynamic(() => import('@/components/hero-section'), {
  loading: () => <div className="h-screen bg-background animate-pulse" />
})

const CollectionBanner = dynamic(() => import('@/components/collection-banner'))
const AboutSection = dynamic(() => import('@/components/about-section'))

export default function Home() {
  const handleAddToCart = () => {
    // Cart is managed by Zustand store
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <NewArrivals onAddToCart={handleAddToCart} />
      <ContentCards />
      <TrendingCollection onAddToCart={handleAddToCart} />
      <CollectionBanner />
      <ShopSection onAddToCart={handleAddToCart} />
      <AboutSection />
      <Footer />
    </main>
  )
}
