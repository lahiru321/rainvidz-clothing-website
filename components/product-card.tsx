"use client"

import Link from "next/link"
import { useEffect } from "react"

interface ProductCardProps {
  name: string
  price: number
  salePrice?: number
  image: string
  slug: string
}

export default function ProductCard({ name, price, salePrice, image, slug }: ProductCardProps) {
  const displayPrice = salePrice || price
  const hasDiscount = salePrice && salePrice < price

  useEffect(() => {
    console.log('ProductCard rendered:', { name, price, salePrice, image, slug })
  }, [name, price, salePrice, image, slug])

  return (
    <Link href={`/products/${slug}`} className="group">
      <div className="cursor-pointer">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-secondary aspect-[2/3] mb-4 transition-all duration-300">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                console.error('Image failed to load:', image, 'for product:', name)
                e.currentTarget.style.display = 'none'
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', image)
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/40">
              No Image
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              SALE
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-primary group-hover:text-accent transition-colors duration-300 line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <p className="text-lg font-semibold text-primary">
                  Rs {(salePrice || 0).toLocaleString()}
                </p>
                <p className="text-sm text-foreground/60 line-through">
                  Rs {(price || 0).toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-lg font-semibold text-primary">
                Rs {(price || 0).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
