
"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import FilterSort from "@/components/filter-sort"
import { getNewArrivals, filterAndSortProducts, FilterState, SortOption } from "@/lib/data"

export default function NewArrivalsPage() {
    const [cartCount, setCartCount] = useState(0)
    const [filters, setFilters] = useState<FilterState>({ sizes: [], colors: [], types: [] })
    const [sort, setSort] = useState<SortOption>('featured')

    const newProducts = getNewArrivals()
    const filteredProducts = filterAndSortProducts(newProducts, filters, sort)

    const handleAddToCart = () => {
        setCartCount((c) => c + 1)
    }

    return (
        <main className="min-h-screen bg-background">
            <Header cartCount={cartCount} />

            <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">New Arrivals</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Fresh finds for your free spirit. Discover our latest additions.
                    </p>
                </div>

                <FilterSort
                    filters={filters}
                    sort={sort}
                    onFilterChange={setFilters}
                    onSortChange={setSort}
                />

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">No products match your filters.</p>
                        <button
                            onClick={() => setFilters({ sizes: [], colors: [], types: [] })}
                            className="mt-4 text-primary underline hover:text-accent"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
