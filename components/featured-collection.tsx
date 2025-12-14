"use client"

import { useEffect, useState } from "react"
import { getCollections, type Collection } from "@/lib/api/collections"

export default function FeaturedCollection() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await getCollections()
                setCollections(response.data.slice(0, 3)) // Get first 3 collections
            } catch (error) {
                console.error('Error fetching collections:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCollections()
    }, [])

    if (loading) {
        return (
            <section className="w-full py-12 px-4 md:px-8 bg-background">
                <div className="flex items-center justify-center h-[600px]">
                    <p className="text-foreground/60">Loading collections...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full py-12 px-4 md:px-8 bg-background">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                {collections.map((collection) => (
                    <div
                        key={collection._id}
                        className="relative group overflow-hidden h-full w-full cursor-pointer"
                    >
                        {/* Background Image */}
                        <img
                            src={collection.imageUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'}
                            alt={collection.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-8 w-full text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-3xl md:text-4xl font-bold mb-2">
                                {collection.name}
                            </h3>
                            <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-[90%]">
                                {collection.description || 'Explore our collection'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
