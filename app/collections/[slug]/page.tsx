"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Grid3x3 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { getCollectionBySlug, type Collection } from "@/lib/api/collections"
import type { Product } from "@/lib/api/products"

export default function CollectionDetailPage() {
    const params = useParams()
    const slug = params.slug as string

    const [collection, setCollection] = useState<Collection | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetchCollection()
        }
    }, [slug])

    const fetchCollection = async () => {
        try {
            setLoading(true)
            const response = await getCollectionBySlug(slug)
            setCollection(response.data.collection)
            setProducts(response.data.products)
        } catch (error) {
            console.error('Error fetching collection:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center h-screen">
                    <p className="text-foreground/60">Loading collection...</p>
                </div>
            </div>
        )
    }

    if (!collection) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
                    <Link
                        href="/collections"
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Browse Collections
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-foreground/60 mb-8">
                    <Link href="/" className="hover:text-primary">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/collections" className="hover:text-primary">
                        Collections
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground">{collection.name}</span>
                </nav>

                {/* Collection Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        {collection.name}
                    </h1>
                    <p className="text-lg text-foreground/70 max-w-3xl">
                        {collection.description}
                    </p>
                    <p className="text-sm text-foreground/60 mt-4">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </p>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <Grid3x3 className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                        <p className="text-foreground/60 mb-6">
                            This collection is currently empty. Check back soon!
                        </p>
                        <Link
                            href="/collections"
                            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                            Browse Other Collections
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                )}
            </main>

            <Footer />
        </div>
    )
}
