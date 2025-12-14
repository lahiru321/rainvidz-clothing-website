"use client"

import * as React from "react"
import { useEffect, useState, useCallback } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { getHeroSlides } from "@/lib/api/homeSections"

interface HeroSlide {
  _id: string
  title: string
  subtitle?: string
  imageUrl: string
  ctaText?: string
  ctaLink?: string
}

export default function HeroSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await getHeroSlides()
        setSlides(response.data || [])
      } catch (error) {
        console.error('Error fetching hero slides:', error)
        setSlides([])
      } finally {
        setLoading(false)
      }
    }
    fetchSlides()
  }, [])

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
    }, 7000)
    return () => clearInterval(intervalId)
  }, [api])

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30
      const y = (e.clientY / window.innerHeight - 0.5) * 30
      setMousePosition({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-white/50 rounded-full animate-spin-reverse" />
          </div>
        </div>
      ) : slides.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-white/60">No hero slides available</p>
        </div>
      ) : (
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
              <CarouselItem key={slide._id} className="pl-0 h-full relative">
                <div className="relative w-full h-full overflow-hidden">

                  {/* Multi-Layer Background with Parallax */}
                  <div className="absolute inset-0">
                    {/* Base Image Layer */}
                    <div
                      className="absolute inset-0 transition-all duration-700 will-change-transform"
                      style={{
                        transform: `translate3d(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2 - scrollY * 0.3}px, 0) scale(${index === current ? 1.1 : 1.05})`,
                        opacity: index === current ? 1 : 0
                      }}
                    >
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Animated Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    {/* Dynamic Color Splash */}
                    <div
                      className="absolute inset-0 mix-blend-overlay opacity-30"
                      style={{
                        background: `radial-gradient(circle at ${50 + mousePosition.x * 0.5}% ${50 + mousePosition.y * 0.5}%, #A7C1A8 0%, transparent 60%)`,
                        transition: 'background 0.3s ease-out'
                      }}
                    />
                  </div>

                  {/* Floating Particles - Reduced for Performance */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `float-particle ${8 + Math.random() * 8}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 5}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Glowing Orbs - Optimized */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                      className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] will-change-transform"
                      style={{
                        background: 'radial-gradient(circle, #A7C1A8, transparent)',
                        top: '10%',
                        right: '10%',
                        animation: 'pulse-glow 8s ease-in-out infinite',
                        transform: `translate3d(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px, 0)`
                      }}
                    />
                    <div
                      className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] will-change-transform"
                      style={{
                        background: 'radial-gradient(circle, #8B9D83, transparent)',
                        bottom: '20%',
                        left: '15%',
                        animation: 'pulse-glow 6s ease-in-out infinite reverse',
                        transform: `translate3d(${-mousePosition.x * 0.2}px, ${-mousePosition.y * 0.2}px, 0)`
                      }}
                    />
                  </div>

                  {/* Content Container */}
                  <div className="relative h-full flex items-center z-10">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                      <div className="max-w-4xl">

                        {/* Animated Title with Split Text Effect */}
                        <div className="overflow-hidden mb-6">
                          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-white">
                            {slide.title.split(' ').map((word, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "inline-block transition-all duration-700",
                                  index === current
                                    ? "translate-y-0 opacity-100 blur-0"
                                    : "translate-y-full opacity-0 blur-sm"
                                )}
                                style={{
                                  transitionDelay: index === current ? `${i * 100 + 300}ms` : '0ms',
                                  textShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 80px rgba(167,193,168,0.3)'
                                }}
                              >
                                {word}{' '}
                              </span>
                            ))}
                          </h1>
                        </div>

                        {/* Subtitle with Fade & Slide */}
                        {slide.subtitle && (
                          <div className="overflow-hidden mb-10">
                            <p className={cn(
                              "text-xl md:text-2xl text-white/90 leading-relaxed font-light max-w-2xl transition-all duration-700",
                              index === current
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            )}
                              style={{
                                transitionDelay: index === current ? '600ms' : '0ms',
                                textShadow: '0 4px 12px rgba(0,0,0,0.6)'
                              }}>
                              {slide.subtitle}
                            </p>
                          </div>
                        )}

                        {/* Premium CTA Button */}
                        <div className={cn(
                          "transition-all duration-700",
                          index === current
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                        )}
                          style={{ transitionDelay: index === current ? '900ms' : '0ms' }}>
                          <button
                            onClick={() => window.location.href = slide.ctaLink || '/shop'}
                            className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-5 text-lg font-bold overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_80px_rgba(255,255,255,0.4)]"
                          >
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-sage via-[#8B9D83] to-sage bg-[length:200%_100%] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left animate-gradient-shift" />

                            {/* Shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                              {slide.ctaText || 'Discover Now'}
                            </span>

                            <svg
                              className="w-7 h-7 relative z-10 transition-all duration-300 group-hover:translate-x-2 group-hover:text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>

                            {/* Glowing Border Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 border-2 border-white/50 animate-pulse-border" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Ultra-Modern Navigation */}
          <div className="absolute bottom-12 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

              {/* Progress Dots with Numbers */}
              <div className="flex items-center gap-6">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className="group relative"
                  >
                    {/* Dot */}
                    <div className={cn(
                      "relative w-3 h-3 rounded-full transition-all duration-300",
                      i === current
                        ? "bg-white scale-150"
                        : "bg-white/30 hover:bg-white/60 hover:scale-125"
                    )}>
                      {i === current && (
                        <div className="absolute inset-0 bg-white/50 rounded-full blur-md animate-pulse" />
                      )}
                    </div>

                    {/* Number Label */}
                    <span className={cn(
                      "absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-bold transition-all duration-300",
                      i === current ? "text-white opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
                    )}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Arrow Navigation with Hover Effects */}
              <div className="flex gap-4">
                <button
                  onClick={() => api?.scrollPrev()}
                  className="group relative w-14 h-14 border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-110 hover:border-white"
                >
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
                  <svg className="w-6 h-6 relative z-10 group-hover:text-black transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <button
                  onClick={() => api?.scrollNext()}
                  className="group relative w-14 h-14 border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-110 hover:border-white"
                >
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <svg className="w-6 h-6 relative z-10 group-hover:text-black transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block">
            <div className="flex flex-col items-center gap-3 animate-bounce-slow">
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-2 bg-white/60 rounded-full animate-scroll-down" />
              </div>
              <span className="text-xs text-white/60 uppercase tracking-widest">Scroll</span>
            </div>
          </div>
        </Carousel>
      )}

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-100px) translateX(50px); opacity: 0.8; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes pulse-border {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(16px); opacity: 0; }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-scroll-down { animation: scroll-down 2s ease-in-out infinite; }
        .animate-spin-reverse { animation: spin-reverse 1s linear infinite; }
        .animate-gradient-shift { animation: gradient-shift 3s ease infinite; }
        .animate-pulse-border { animation: pulse-border 2s ease-in-out infinite; }
      `}</style>
    </section>
  )
}