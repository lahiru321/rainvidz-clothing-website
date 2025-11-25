"use client"

import * as React from "react"
import { useEffect, useState, useCallback } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&q=80",
    title: "Free Spirit",
    subtitle: "Embrace your inner bohemian with our collection of flowing fabrics and earthy tones.",
    cta: "Shop the Look"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=1920&q=80",
    title: "Natural Beauty",
    subtitle: "Handcrafted pieces made from sustainable materials for the conscious soul.",
    cta: "Discover Nature"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1920&q=80",
    title: "Boho Chic",
    subtitle: "Timeless patterns and vintage-inspired designs for every adventure.",
    cta: "View Collection"
  }
]

export default function HeroSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Autoplay effect
  useEffect(() => {
    if (!api) return

    const intervalId = setInterval(() => {
      api.scrollNext()
    }, 6000)

    return () => clearInterval(intervalId)
  }, [api])

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  return (
    <section className="relative h-[45vh] min-h-[800px] w-full overflow-hidden bg-background">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          duration: 60
        }}
        className="w-full h-full [&_[data-slot=carousel-content]]:h-full"
      >
        <CarouselContent className="h-full -ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="pl-0 h-full relative">
              <div className="relative w-full h-full overflow-hidden">
                {/* Background Image with Ken Burns Effect */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-[10000ms] ease-out",
                      index === current ? "scale-110" : "scale-100"
                    )}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/60 via-secondary/40 to-transparent mix-blend-multiply" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                      <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight text-white overflow-hidden drop-shadow-lg">
                        <span className={cn(
                          "block transform transition-all duration-700 delay-300",
                          index === current ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                        )}>
                          {slide.title}
                        </span>
                      </h1>

                      <p className={cn(
                        "text-lg md:text-xl text-white/90 mb-8 leading-relaxed transform transition-all duration-700 delay-500",
                        index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      )}>
                        {slide.subtitle}
                      </p>

                      <div className={cn(
                        "transform transition-all duration-700 delay-700",
                        index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      )}>
                        <Button
                          size="lg"
                          className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 rounded-none"
                        >
                          {slide.cta}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation Controls */}
        <div className="absolute bottom-12 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-3">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "w-12 h-1 transition-all duration-300",
                    i === current ? "bg-white" : "bg-white/30 hover:bg-white/50"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-4">
              <button
                onClick={() => api?.scrollPrev()}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button
                onClick={() => api?.scrollNext()}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </Carousel>
    </section>
  )
}