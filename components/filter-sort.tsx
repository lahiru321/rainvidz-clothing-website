
"use client"

import { useState } from "react"
import { ChevronDown, SlidersHorizontal, X, Check } from "lucide-react"
import { FilterState, SortOption } from "@/lib/data"

interface FilterSortProps {
    filters: FilterState
    sort: SortOption
    onFilterChange: (filters: FilterState) => void
    onSortChange: (sort: SortOption) => void
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "One Size"]
const AVAILABLE_COLORS = ["Black", "White", "Brown", "Beige", "Red", "Blue", "Green", "Pink", "Cream"]
const AVAILABLE_TYPES = ["Tops", "Bottoms", "Dresses", "Accessories", "Outerwear"]

export default function FilterSort({ filters, sort, onFilterChange, onSortChange }: FilterSortProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const toggleFilter = (type: keyof FilterState, value: string) => {
        const current = filters[type]
        const updated = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value]

        onFilterChange({ ...filters, [type]: updated })
    }

    return (
        <div className="mb-12 space-y-6">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-b border-border/60">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="group flex items-center gap-2 text-sm font-medium tracking-wide hover:text-accent transition-colors"
                >
                    <SlidersHorizontal className="w-4 h-4 transition-transform group-hover:rotate-90" />
                    <span className="uppercase">Filter Products</span>
                </button>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-serif italic">Sort by</span>
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => onSortChange(e.target.value as SortOption)}
                            className="appearance-none bg-transparent pl-3 pr-8 py-1 text-sm font-medium focus:outline-none cursor-pointer hover:text-accent transition-colors text-right"
                        >
                            <option value="featured">Featured</option>
                            <option value="availability">Availability</option>
                            <option value="best-selling">Best Selling</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isFilterOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="bg-secondary/10 rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Type Filter */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-lg font-medium border-b border-border/50 pb-2">Category</h3>
                        <div className="space-y-3">
                            {AVAILABLE_TYPES.map((type) => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${filters.types.includes(type) ? 'bg-primary border-primary' : 'border-muted-foreground/50 group-hover:border-primary'
                                        }`}>
                                        {filters.types.includes(type) && <Check className="w-3 h-3 text-primary-foreground" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={filters.types.includes(type)}
                                        onChange={() => toggleFilter('types', type)}
                                        className="hidden"
                                    />
                                    <span className={`text-sm transition-colors ${filters.types.includes(type) ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-primary'
                                        }`}>
                                        {type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-lg font-medium border-b border-border/50 pb-2">Size</h3>
                        <div className="flex flex-wrap gap-3">
                            {AVAILABLE_SIZES.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => toggleFilter('sizes', size)}
                                    className={`h-10 min-w-[40px] px-3 text-sm border rounded-md transition-all duration-300 ${filters.sizes.includes(size)
                                            ? 'bg-primary text-primary-foreground border-primary shadow-md transform scale-105'
                                            : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Filter */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-lg font-medium border-b border-border/50 pb-2">Color</h3>
                        <div className="flex flex-wrap gap-4">
                            {AVAILABLE_COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => toggleFilter('colors', color)}
                                    className={`group relative w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ${filters.colors.includes(color) ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                                        }`}
                                    title={color}
                                >
                                    <span
                                        className="absolute inset-0 rounded-full border border-black/10 shadow-sm"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                    {filters.colors.includes(color) && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <div className={`w-1.5 h-1.5 rounded-full ${['White', 'Cream', 'Beige'].includes(color) ? 'bg-black' : 'bg-white'}`} />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Filters Summary */}
            {(filters.sizes.length > 0 || filters.colors.length > 0 || filters.types.length > 0) && (
                <div className="flex flex-wrap items-center gap-3 pt-2 animate-fade-in">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active:</span>
                    {[...filters.types, ...filters.sizes, ...filters.colors].map((filter) => (
                        <span key={filter} className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/20 text-xs font-medium rounded-full text-secondary-foreground border border-secondary/30">
                            {filter}
                            <button
                                onClick={() => {
                                    if (filters.types.includes(filter)) toggleFilter('types', filter)
                                    else if (filters.sizes.includes(filter)) toggleFilter('sizes', filter)
                                    else toggleFilter('colors', filter)
                                }}
                                className="hover:text-destructive transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <button
                        onClick={() => onFilterChange({ sizes: [], colors: [], types: [] })}
                        className="text-xs font-medium text-muted-foreground hover:text-primary border-b border-transparent hover:border-primary transition-all ml-2"
                    >
                        Clear All
                    </button>
                </div>
            )}
        </div>
    )
}
