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
                setProducts(response.data.products)
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
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">Best Sellers</h2>
                        <p className="text-foreground/60">Our most popular pieces</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            name={product.name}
                            price={product.price}
                            salePrice={product.salePrice}
                            image={product.primaryImage}
                            slug={product.slug}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
