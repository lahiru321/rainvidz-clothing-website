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
import { getProducts, type Product } from "@/lib/api/products"

export default function TrendingCollection({ onAddToCart }: { onAddToCart: () => void }) {
    const [api, setApi] = useState<CarouselApi>()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch trending/featured products from API
    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const response = await getProducts({
                    isFeatured: true,
                    limit: 8
                })
                setProducts(response.data.products)
            } catch (error) {
                console.error('Error fetching trending products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTrendingProducts()
    }, [])

    // Auto-scroll carousel
    useEffect(() => {
        if (!api) return

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, 4000)

        return () => clearInterval(intervalId)
    }, [api])

    if (loading) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border/40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-foreground/60">Loading trending products...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border/40">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">Trending Now</h2>
                        <p className="text-foreground/60">What everyone's loving</p>
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
                        {products.map((product) => (
                            <CarouselItem key={product._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                                <ProductCard
                                    name={product.name}
                                    price={product.price}
                                    salePrice={product.salePrice}
                                    image={product.primaryImage}
                                    slug={product.slug}
                                />
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
