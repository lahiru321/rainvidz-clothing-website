"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Grid3x3, SlidersHorizontal } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { getProducts, type Product } from "@/lib/api/products"
import { getCategories, type Category } from "@/lib/api/categories"

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [sortBy, setSortBy] = useState<string>('newest')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

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

    const filteredProducts = (products || []).filter(product => {
        const price = product.salePrice || product.price
        return price >= priceRange[0] && price <= priceRange[1]
    })

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-foreground/60 mb-8">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground">Shop</span>
                </nav>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Shop All Products
                    </h1>
                    <p className="text-foreground/60">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                    </p>
                </div>

                {/* Horizontal Filters */}
                <div className="mb-8 bg-secondary p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-6">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold text-primary">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Category Filter */}
                        <div>
                            <h3 className="font-medium mb-3">Category</h3>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                            >
                                <option value="">All Products</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-medium mb-3">Price Range</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    className="w-full px-3 py-2 border border-border rounded-md text-sm"
                                    placeholder="Min"
                                />
                                <span className="text-foreground/60">-</span>
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="w-full px-3 py-2 border border-border rounded-md text-sm"
                                    placeholder="Max"
                                />
                            </div>
                            <p className="text-xs text-foreground/60 mt-2">
                                Rs {priceRange[0].toLocaleString()} - Rs {priceRange[1].toLocaleString()}
                            </p>
                        </div>

                        {/* Sort By */}
                        <div>
                            <h3 className="font-medium mb-3">Sort By</h3>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid - 4 columns */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-foreground/60">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <Grid3x3 className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                        <p className="text-foreground/60 mb-6">Try adjusting your filters</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('')
                                setPriceRange([0, 10000])
                            }}
                            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
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
