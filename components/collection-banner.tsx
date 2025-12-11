"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getCollectionBanners } from "@/lib/api/homeSections"

interface BannerSection {
  _id: string
  title: string
  description?: string
  season?: string
  imageUrl: string
  backgroundColor?: string
  ctaText?: string
  ctaLink?: string
}

export default function CollectionBanner() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [collections, setCollections] = useState<BannerSection[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getCollectionBanners()
        setCollections(response.data || [])
      } catch (error) {
        console.error('Error fetching collection banners:', error)
        setCollections([])
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  // Auto-rotate banners every 5 seconds if multiple
  useEffect(() => {
    if (collections.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % collections.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [collections.length])

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[600px] bg-background">
        <p className="text-foreground/60">Loading...</p>
      </section>
    )
  }

  if (collections.length === 0) {
    return null // Don't show anything if no banners
  }

  const currentBanner = collections[activeIndex]

  return (
    <section
      className="relative w-full min-h-[600px] py-12 md:py-16 transition-colors duration-500"
      style={{ backgroundColor: currentBanner?.backgroundColor || '#A7C1A8' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left Content */}
          <div className="w-full md:w-5/12 space-y-6">
            {currentBanner.season && (
              <p className="text-sm uppercase tracking-widest font-semibold text-white/80">
                {currentBanner.season}
              </p>
            )}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {currentBanner.title}
            </h2>
            {currentBanner.description && (
              <p className="text-lg text-white/90 leading-relaxed">
                {currentBanner.description}
              </p>
            )}
            <button
              className="bg-white text-black px-8 py-4 font-semibold hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 rounded-full inline-block"
              onClick={() => window.location.href = currentBanner.ctaLink || '/shop'}
            >
              {currentBanner.ctaText || 'Shop Collection'}
            </button>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-7/12 h-[400px] md:h-[600px] relative rounded-lg overflow-hidden">
            {collections.map((collection, index) => (
              <div
                key={collection._id}
                className={cn(
                  "absolute inset-0 transition-all duration-700",
                  index === activeIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                )}
              >
                <img
                  src={collection.imageUrl}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation dots if multiple banners */}
      {collections.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {collections.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === activeIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75 w-2"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
