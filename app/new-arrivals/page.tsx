"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import CustomDropdown from "@/components/custom-dropdown"
import { getProducts, type Product } from "@/lib/api/products"

export default function NewArrivalsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState<string>('newest')

    useEffect(() => {
        fetchProducts()
    }, [sortBy])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const params: any = {
                isNewArrival: true,
                limit: 50
            }

            if (sortBy === 'price-low') {
                params.sortBy = 'price'
                params.sortOrder = 'asc'
            } else if (sortBy === 'price-high') {
                params.sortBy = 'price'
                params.sortOrder = 'desc'
            } else if (sortBy === 'newest') {
                params.sortBy = 'createdAt'
                params.sortOrder = 'desc'
            }

            const response = await getProducts(params)
            setProducts(response.data.products || [])
        } catch (error) {
            console.error('Error fetching new arrivals:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">New Arrivals</h1>
                    <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                        Fresh finds for your free spirit. Discover our latest additions.
                    </p>
                </div>

                {/* Sort */}
                <div className="flex justify-between items-center mb-8">
                    <p className="text-foreground/60">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </p>
                    <CustomDropdown
                        options={[
                            { value: 'newest', label: 'Newest First' },
                            { value: 'price-low', label: 'Price: Low to High' },
                            { value: 'price-high', label: 'Price: High to Low' }
                        ]}
                        value={sortBy}
                        onChange={setSortBy}
                        placeholder="Sort By"
                        className="w-48"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-foreground/60">Loading new arrivals...</p>
                    </div>
                ) : products.length > 0 ? (
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
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-foreground/60">No new arrivals found.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
