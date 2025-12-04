"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShoppingBag, Heart, Truck, Shield, RefreshCw } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getProductBySlug, type Product } from "@/lib/api/products"
import { useCartStore } from "@/lib/store/cartStore"

export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const { addItem } = useCartStore()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [selectedColor, setSelectedColor] = useState<string>("")
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [selectedImage, setSelectedImage] = useState<string>("")
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductBySlug(slug)
                setProduct(response.data)

                // Set default selections
                if (response.data.images.length > 0) {
                    const primaryImage = response.data.images.find(img => img.isPrimary)
                    setSelectedImage(primaryImage?.url || response.data.images[0].url)
                }

                if (response.data.variants.length > 0) {
                    const firstVariant = response.data.variants[0]
                    setSelectedColor(firstVariant.color)
                    setSelectedSize(firstVariant.size)
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [slug])

    const handleAddToCart = async () => {
        if (!product) return

        setAdding(true)
        try {
            const variant = getSelectedVariant()
            if (!variant) {
                alert('Please select a variant')
                setAdding(false)
                return
            }

            await addItem(product.slug, variant.sku, quantity)
            alert('Added to cart!')
            router.push('/cart')
        } catch (error) {
            console.error('Error adding to cart:', error)
            alert('Failed to add to cart. Please try again.')
        } finally {
            setAdding(false)
        }
    }

    const getAvailableColors = () => {
        if (!product) return []
        return [...new Set(product.variants.map(v => v.color))]
    }

    const getAvailableSizes = () => {
        if (!product) return []
        return [...new Set(product.variants.filter(v => v.color === selectedColor).map(v => v.size))]
    }

    const getSelectedVariant = () => {
        if (!product) return null
        return product.variants.find(v => v.color === selectedColor && v.size === selectedSize)
    }

    const isInStock = () => {
        const variant = getSelectedVariant()
        return variant && variant.quantity > 0
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center h-screen">
                    <p className="text-foreground/60">Loading product...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    const variant = getSelectedVariant()
    const availableColors = getAvailableColors()
    const availableSizes = getAvailableSizes()

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(image.url)}
                                        className={`aspect-square bg-secondary rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === image.url ? 'border-primary' : 'border-transparent'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Breadcrumb */}
                        <div className="text-sm text-foreground/60">
                            <button onClick={() => router.push('/')} className="hover:text-primary">Home</button>
                            {' / '}
                            <span>{product.category.name}</span>
                            {' / '}
                            <span className="text-foreground">{product.name}</span>
                        </div>

                        {/* Title & Price */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-bold text-primary">
                                    Rs {product.effectivePrice.toLocaleString()}
                                </p>
                                {product.isOnSale && (
                                    <p className="text-xl text-foreground/50 line-through">
                                        Rs {product.price.toLocaleString()}
                                    </p>
                                )}
                                {product.isOnSale && (
                                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                                        SALE
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-foreground/60 mt-2">SKU: {product.productCode}</p>
                        </div>

                        {/* Description */}
                        <div className="border-t border-b border-border/40 py-6">
                            <p className="text-foreground/80 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Color Selection */}
                        {availableColors.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    Color: <span className="font-bold">{selectedColor}</span>
                                </label>
                                <div className="flex gap-3">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => {
                                                setSelectedColor(color)
                                                // Reset size when color changes
                                                const firstSize = product.variants.find(v => v.color === color)?.size
                                                if (firstSize) setSelectedSize(firstSize)
                                            }}
                                            className={`px-6 py-2 border-2 rounded-md transition-all ${selectedColor === color
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-border hover:border-primary'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {availableSizes.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    Size: <span className="font-bold">{selectedSize}</span>
                                </label>
                                <div className="flex gap-3">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-6 py-2 border-2 rounded-md transition-all ${selectedSize === size
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-border hover:border-primary'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div>
                            {variant && (
                                <p className={`text-sm font-medium ${variant.quantity > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {variant.quantity > 0
                                        ? `In Stock (${variant.quantity} available)`
                                        : 'Out of Stock'
                                    }
                                </p>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium">Quantity:</label>
                                <div className="flex items-center border border-border rounded-md">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-secondary"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 py-2 border-x border-border">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 hover:bg-secondary"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!isInStock() || adding}
                                    className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    {adding ? 'Adding...' : isInStock() ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button className="px-6 py-4 border-2 border-border rounded-md hover:border-primary transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/40">
                            <div className="text-center">
                                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs text-foreground/60">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs text-foreground/60">Secure Payment</p>
                            </div>
                            <div className="text-center">
                                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs text-foreground/60">Easy Returns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
