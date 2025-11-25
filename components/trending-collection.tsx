"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from "@/components/ui/carousel"
import ProductCard from "./product-card"

const trendingProducts = [
    {
        id: 7,
        name: "Tiered Midi Dress",
        price: "$110",
        category: "Dresses",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    },
    {
        id: 8,
        name: "Vintage Denim Jacket",
        price: "$145",
        category: "Outerwear",
        image: "https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80",
    },
    {
        id: 9,
        name: "Kimono Cardigan",
        price: "$85",
        category: "Outerwear",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    },
    {
        id: 10,
        name: "Wide Brim Fedora",
        price: "$55",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=800&q=80",
    }
]

export default function TrendingCollection({ onAddToCart }: { onAddToCart: () => void }) {
    const [api, setApi] = useState<CarouselApi>()

    useEffect(() => {
        if (!api) return

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, 4000)

        return () => clearInterval(intervalId)
    }, [api])

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">Trending Collection</h2>
                        <p className="text-foreground/60">Most loved pieces by our community</p>
                    </div>
                </div>

                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {trendingProducts.map((product) => (
                            <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                                <ProductCard product={product} onAddToCart={onAddToCart} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-8">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>
                </Carousel>
            </div>
        </section>
    )
}
