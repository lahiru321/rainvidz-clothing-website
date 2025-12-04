"use client"

import { useEffect, useState } from "react"
import ProductCard from "./product-card"
import { getProducts, type Product } from "@/lib/api/products"

export default function ShopSection({ onAddToCart }: { onAddToCart: () => void }) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts({
                    limit: 8,
                    sortBy: 'soldCount'
                })
                setProducts(response.data)
            } catch (error) {
                console.error('Error fetching shop products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border/40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-foreground/60">Loading products...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border/40">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Shop the Look</h2>
                    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                        Complete your wardrobe with these handpicked essentials
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => {
                        const cardProduct = {
                            id: index + 1,
                            name: product.name,
                            price: `Rs ${product.effectivePrice.toLocaleString()}`,
                            category: product.category.name,
                            image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '',
                            hoverImage: product.images.find(img => img.isHover)?.url || product.images[1]?.url || '',
                            slug: product.slug
                        }

                        return (
                            <div key={product._id}>
                                <ProductCard product={cardProduct} onAddToCart={onAddToCart} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
