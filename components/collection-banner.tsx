"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

const collections = [
  {
    id: 1,
    season: "New Season",
    title: "Autumn Collection",
    description: "Embrace the season's richest hues with our carefully curated autumn collection. From warm earth tones to sophisticated layering pieces, discover everything you need for effortless elegance.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    color: "bg-[#819A91]" // Sage
  },
  {
    id: 2,
    season: "Winter Edit",
    title: "Winter Solstice",
    description: "Cozy knits and structured coats designed to keep you warm without compromising on style. Experience the luxury of premium wool and cashmere blends.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    color: "bg-[#3E3B32]" // Dark Olive
  },
  {
    id: 3,
    season: "Spring Preview",
    title: "Spring Awakening",
    description: "Fresh florals and light linens mark the return of brighter days. Our spring collection features breathable fabrics and soft pastels for the changing season.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    color: "bg-[#A7C1A8]" // Light Green
  },
  {
    id: 4,
    season: "Summer Vibes",
    title: "Summer Breeze",
    description: "Effortless silhouettes for endless summer days. From beachside cover-ups to evening maxi dresses, find your perfect warm-weather wardrobe.",
    image: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=800&q=80",
    color: "bg-[#C17F59]" // Terracotta
  }
]

export default function CollectionBanner() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const { top, height } = sectionRef.current.getBoundingClientRect()
      const scrollPosition = -top
      const viewportHeight = window.innerHeight

      // Calculate progress through the section
      // We want the transition to happen as we scroll through the sticky height
      // The total scrollable distance is height - viewportHeight
      const scrollableDistance = height - viewportHeight

      if (scrollableDistance <= 0) return

      const progress = Math.max(0, Math.min(1, scrollPosition / scrollableDistance))

      // Map progress to index
      const newIndex = Math.min(
        collections.length - 1,
        Math.floor(progress * collections.length)
      )

      setActiveIndex(newIndex)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-background"
    >
      <div className="sticky top-0 h-[45vh] min-h-[800px] flex items-center justify-center overflow-hidden">

        {/* Main Card Container */}
        <div className="relative w-full h-full bg-[#A7C1A8] overflow-hidden transition-all duration-500">

          <div className="absolute inset-0 flex flex-col md:flex-row items-center">
            {/* Left Content - 40% width */}
            <div className="relative w-full md:w-[40%] h-full flex flex-col justify-center px-8 md:px-16 z-10">
              {collections.map((collection, index) => (
                <div
                  key={collection.id}
                  className={cn(
                    "transition-all duration-700 absolute left-8 md:left-16 right-8 md:right-4",
                    index === activeIndex
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-8 pointer-events-none"
                  )}
                >
                  <p className="text-sm uppercase tracking-widest font-semibold mb-4 text-black/60">
                    {collection.season}
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-black">
                    {collection.title}
                  </h2>
                  <p className="text-lg text-black/80 mb-8 leading-relaxed">
                    {collection.description}
                  </p>
                  <button className="bg-black text-white px-8 py-4 font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 rounded-full">
                    Shop Collection
                  </button>
                </div>
              ))}
            </div>

            {/* Right Image - 60% width (Bigger) */}
            <div className="relative w-full md:w-[60%] h-full overflow-hidden">
              {collections.map((collection, index) => (
                <div
                  key={collection.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-1000 ease-in-out",
                    index === activeIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-110"
                  )}
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay for text readability on mobile if needed, or style */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#A7C1A8] via-transparent to-transparent md:w-1/4" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
