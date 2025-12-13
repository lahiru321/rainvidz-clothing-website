"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, SlidersHorizontal, X } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { searchProducts, type Product } from "@/lib/api/products"
import { getCategories, type Category } from "@/lib/api/categories"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q') || ''

    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
    const [sortBy, setSortBy] = useState('relevance')

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (searchQuery.trim()) {
            performSearch()
        } else {
            setProducts([])
            setLoading(false)
        }
    }, [searchQuery, selectedCategory, priceRange, sortBy, currentPage])

    const fetchCategories = async () => {
        try {
            const response = await getCategories()
            setCategories(response.data)
        } catch (err) {
            console.error('Error fetching categories:', err)
        }
    }

    const performSearch = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await searchProducts({
                q: searchQuery,
                category: selectedCategory || undefined,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                sortBy: sortBy as any,
                page: currentPage,
                limit: 12
            })

            setProducts(response.data.products)
            setTotalPages(response.pagination.pages)
            setTotalResults(response.pagination.total)
        } catch (err: any) {
            console.error('Search error:', err)
            setError('Failed to search products')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        performSearch()
    }

    const clearFilters = () => {
        setSelectedCategory('')
        setPriceRange([0, 10000])
        setSortBy('relevance')
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for products..."
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Results Count */}
                {searchQuery && !loading && (
                    <div className="mb-6">
                        <h1 className="text-2xl font-serif font-bold text-primary">
                            {totalResults > 0
                                ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${searchQuery}"`
                                : `No results found for "${searchQuery}"`}
                        </h1>
                    </div>
                )}

                {/* Filters */}
                {searchQuery && (
                    <div className="mb-8 bg-secondary p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold text-primary">Filters</h2>
                            </div>
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-foreground/60 hover:text-primary transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Category Filter */}
                            <div>
                                <h3 className="font-medium mb-3">Category</h3>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                                >
                                    <option value="">All Categories</option>
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
                                        onChange={(e) => {
                                            setPriceRange([Number(e.target.value), priceRange[1]])
                                            setCurrentPage(1)
                                        }}
                                        placeholder="Min"
                                        className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                                    />
                                    <span className="text-foreground/60">-</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => {
                                            setPriceRange([priceRange[0], Number(e.target.value)])
                                            setCurrentPage(1)
                                        }}
                                        placeholder="Max"
                                        className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <h3 className="font-medium mb-3">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                                >
                                    <option value="relevance">Most Relevant</option>
                                    <option value="newest">Newest First</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-foreground/60">Searching...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {/* Empty State - No Search Query */}
                {!searchQuery && !loading && (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Search for Products</h3>
                        <p className="text-foreground/60">
                            Enter a search term to find products
                        </p>
                    </div>
                )}

                {/* No Results */}
                {searchQuery && !loading && products.length === 0 && !error && (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No products found</h3>
                        <p className="text-foreground/60 mb-6">
                            Try adjusting your search or filters
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Browse All Products
                        </Link>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && products.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-foreground/60">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}
