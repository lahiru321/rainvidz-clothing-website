"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Grid3x3 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import CustomDropdown from "@/components/custom-dropdown"
import { getProducts, type Product } from "@/lib/api/products"
import { getCategories, type Category } from "@/lib/api/categories"

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [sortBy, setSortBy] = useState<string>('newest')

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (!loading) {
            fetchProducts()
        }
    }, [selectedCategory, sortBy])

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                getProducts({ limit: 100 }),
                getCategories()
            ])
            setProducts(productsRes.data.products || [])
            setCategories(categoriesRes.data || [])
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setProducts([])
            setLoading(false)
        }
    }

    const fetchProducts = async () => {
        try {
            const params: any = { limit: 100 }

            if (selectedCategory) {
                params.category = selectedCategory
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
            console.error('Error fetching products:', error)
            setProducts([])
        }
    }

    const filteredProducts = products || []

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-foreground/60 mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">Shop</span>
                </nav>

                {/* Header with Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-6 border-b border-border">
                    {/* Title & Count */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                            Shop
                        </h1>
                        <p className="text-foreground/60">
                            {filteredProducts.length} products
                        </p>
                    </div>

                    {/* Inline Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Category Dropdown */}
                        <CustomDropdown
                            options={[
                                { value: '', label: 'All Categories' },
                                ...categories.map(cat => ({ value: cat._id, label: cat.name }))
                            ]}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="All Categories"
                            className="w-48"
                        />

                        {/* Sort Dropdown */}
                        <CustomDropdown
                            options={[
                                { value: 'newest', label: 'Newest' },
                                { value: 'price-low', label: 'Price: Low to High' },
                                { value: 'price-high', label: 'Price: High to Low' }
                            ]}
                            value={sortBy}
                            onChange={setSortBy}
                            placeholder="Sort By"
                            className="w-48"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-foreground/60">Loading...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <Grid3x3 className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No products found</h3>
                        <p className="text-foreground/60 mb-6">Try adjusting your filters</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('')
                                setSortBy('newest')
                            }}
                            className="px-6 py-3 bg-sage text-white rounded-lg font-medium hover:bg-sage/90 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
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
