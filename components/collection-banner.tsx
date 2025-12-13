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

  useEffect(() => {
    if (collections.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % collections.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [collections.length])

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[500px] bg-background">
        <p className="text-foreground/60">Loading...</p>
      </section>
    )
  }

  if (collections.length === 0) {
    return null
  }

  const currentBanner = collections[activeIndex]

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">

        {/* LEFT SIDE - Solid Color with Content */}
        <div
          className="relative flex items-center justify-center p-8 md:p-12 lg:p-16 transition-colors duration-700"
          style={{ backgroundColor: currentBanner?.backgroundColor || '#A7C1A8' }}
        >
          {/* Decorative Geometric Shapes */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 border-4 border-white rotate-45 animate-spin-slow" />
            <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full border-4 border-white animate-pulse" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-white transform -translate-y-1/2" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-xl space-y-6">
            {/* Large Number Indicator */}
            <div className="text-white/20 font-bold text-[120px] md:text-[180px] leading-none select-none">
              {String(activeIndex + 1).padStart(2, '0')}
            </div>

            {/* Season Tag */}
            {currentBanner.season && (
              <div className="inline-block">
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/80 bg-white/20 px-5 py-2 backdrop-blur-sm">
                  {currentBanner.season}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {currentBanner.title}
            </h2>

            {/* Description */}
            {currentBanner.description && (
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                {currentBanner.description}
              </p>
            )}

            {/* Minimal Line Separator */}
            <div className="w-24 h-1 bg-white/50" />

            {/* CTA - Minimal Text Link Style */}
            <button
              onClick={() => window.location.href = currentBanner.ctaLink || '/shop'}
              className="group inline-flex items-center gap-3 text-white font-semibold text-lg hover:gap-5 transition-all duration-300"
            >
              <span className="border-b-2 border-white pb-1">
                {currentBanner.ctaText || 'Explore Collection'}
              </span>
              <svg
                className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            {/* Navigation Dots - Vertical */}
            {collections.length > 1 && (
              <div className="flex flex-col gap-3 pt-8">
                {collections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-1 h-8 transition-all duration-300",
                      index === activeIndex
                        ? "bg-white"
                        : "bg-white/30 hover:bg-white/60 h-6"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Image Grid */}
        <div className="relative bg-gray-100">
          {/* Main Large Image */}
          <div className="absolute inset-0">
            {collections.map((collection, index) => (
              <div
                key={collection._id}
                className={cn(
                  "absolute inset-0 transition-all duration-700",
                  index === activeIndex ? "opacity-100" : "opacity-0"
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

          {/* Overlay Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />

          {/* Floating Info Card */}
          <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm p-6 shadow-2xl max-w-xs">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Collection Highlight
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {currentBanner.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-8 h-px bg-gray-400" />
                <span>Limited Edition</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  )
}
