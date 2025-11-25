"use client"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"

interface Product {
  id: number
  name: string
  price: string
  category: string
  image: string
  hoverImage: string
}

export default function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="group cursor-pointer">
      {/* Product Image */}
      <div
        className="relative overflow-hidden bg-secondary aspect-[2/3] mb-4 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isHovered ? product.hoverImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-primary/20 mix-blend-multiply transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />

        {/* Add to Cart Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button
            onClick={(e) => {
              e.preventDefault()
              onAddToCart()
            }}
            className="bg-primary text-primary-foreground px-6 py-3 font-semibold flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Bag
          </button>
        </div>


      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">{product.category}</p>
        <h3 className="font-medium text-primary hover:text-accent transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-primary">{product.price}</p>
      </div>
    </div>
  )
}
