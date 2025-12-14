'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getContentCards } from '@/lib/api/homeSections'
import type { HomeSection } from '@/lib/api/homeSections'

export default function ContentCards() {
    const router = useRouter()
    const [cards, setCards] = useState<HomeSection[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await getContentCards()
                // Limit to 3 cards
                setCards((response.data || []).slice(0, 3))
            } catch (error) {
                console.error('Error fetching content cards:', error)
                setCards([])
            } finally {
                setLoading(false)
            }
        }
        fetchCards()
    }, [])

    const handleTagClick = (tag: string) => {
        router.push(`/shop?tag=${encodeURIComponent(tag)}`)
    }

    if (loading) {
        return (
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (cards.length === 0) {
        return null
    }

    return (
        <section className="py-16 px-4 bg-background">
            <div className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card._id}
                            className="group relative h-[600px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Background Image */}
                            <Image
                                src={card.imageUrl}
                                alt={card.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                {/* Title */}
                                <h3 className="text-2xl md:text-3xl font-bold mb-2 font-serif">
                                    {card.title}
                                </h3>

                                {/* Description */}
                                {card.description && (
                                    <p className="text-sm md:text-base text-white/90 mb-4 line-clamp-2">
                                        {card.description}
                                    </p>
                                )}

                                {/* Tags */}
                                {card.tags && card.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {card.tags.map((tag, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleTagClick(tag)}
                                                className="px-3 py-1 text-xs font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 transition-colors duration-200"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
