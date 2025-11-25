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

const newArrivals = [
    {
        id: 1,
        name: "Boho Maxi Dress",
        price: "$129",
        category: "Dresses",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80",
    },
    {
        id: 2,
        name: "Linen Wide Leg Pants",
        price: "$89",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1594631252976-72920f599419?w=800&q=80",
    },
    {
        id: 3,
        name: "Crochet Summer Top",
        price: "$65",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1617019114610-3367369f76f4?w=800&q=80",
    },
    {
        id: 4,
        name: "Embroidered Peasant Blouse",
        price: "$95",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1564584217180-2271feaeb3c5?w=800&q=80",
    },
    {
        id: 5,
        name: "Floral Wrap Skirt",
        price: "$79",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    },
    {
        id: 6,
        name: "Woven Straw Hat",
        price: "$45",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1521320226546-87b106956014?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1521320226546-87b106956014?w=800&q=80",
    }
]

export default function NewArrivals({ onAddToCart }: { onAddToCart: () => void }) {
    const [api, setApi] = useState<CarouselApi>()

    useEffect(() => {
        if (!api) return

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, 4000)

        return () => clearInterval(intervalId)
    }, [api])

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/40">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">New Arrivals</h2>
                        <p className="text-foreground/60">Fresh finds for your free spirit</p>
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
                        {newArrivals.map((product) => (
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
