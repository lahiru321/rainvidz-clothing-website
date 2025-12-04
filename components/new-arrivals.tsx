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

export default function NewArrivals({ onAddToCart }: { onAddToCart: () => void }) {
    const [api, setApi] = useState<CarouselApi>()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch new arrivals from API
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await getProducts({
                    isNewArrival: true,
                    limit: 8
                })
                console.log('=== NEW ARRIVALS API RESPONSE ===')
                console.log('Full response:', response)
                console.log('response.data:', response.data)
                console.log('response.data.products:', response.data.products)
                if (response.data.products && response.data.products[0]) {
                    console.log('First product:', response.data.products[0])
                    console.log('First product primaryImage:', response.data.products[0].primaryImage)
                }
                setProducts(response.data.products || [])
            } catch (error) {
                console.error('Error fetching new arrivals:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNewArrivals()
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
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-foreground/60">Loading new arrivals...</p>
                    </div>
                </div>
            </section>
        )
    }

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
