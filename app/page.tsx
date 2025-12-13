"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ContentCards from "@/components/content-cards"
import NewArrivals from "@/components/new-arrivals"
import TrendingCollection from "@/components/trending-collection"
import CollectionBanner from "@/components/collection-banner"
import ShopSection from "@/components/shop-section"
import AboutSection from "@/components/about-section"
import Footer from "@/components/footer"

export default function Home() {
  const [cartCount, setCartCount] = useState(0)

  const handleAddToCart = () => {
    setCartCount((c) => c + 1)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={cartCount} />
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
