"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCartStore } from "@/lib/store/cartStore"
import { useConfirm } from "@/lib/contexts/ConfirmDialogContext"

export default function CartPage() {
    const router = useRouter()
    const { items, loading, updateQuantity, removeItem, clearCart, getTotal } = useCartStore()
    const { confirm } = useConfirm()

    const handleUpdateQuantity = (variantId: string, currentQuantity: number, change: number) => {
        const newQuantity = currentQuantity + change
        if (newQuantity > 0) {
            updateQuantity(variantId, newQuantity)
        }
    }

    const handleRemoveItem = (variantId: string) => {
        confirm('Remove this item from cart?', () => {
            removeItem(variantId)
        })
    }

    const handleClearCart = () => {
        confirm('Clear entire cart?', () => {
            clearCart()
        })
    }

    const total = getTotal()

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingBag className="w-24 h-24 mx-auto text-foreground/20 mb-4" />
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
                        <p className="text-foreground/60 mb-6">Add some items to get started!</p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.variantId} className="flex gap-4 p-4 bg-secondary rounded-lg">
                                    {/* Product Image */}
                                    <Link href={`/products/${item.productSlug}`} className="flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-24 h-32 object-cover rounded-md"
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <Link href={`/products/${item.productSlug}`}>
                                            <h3 className="font-semibold text-primary hover:text-accent transition-colors">
                                                {item.productName}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-foreground/60 mt-1">
                                            {item.variantColor} / {item.variantSize}
                                        </p>
                                        <p className="text-lg font-bold text-primary mt-2">
                                            Rs {item.effectivePrice.toLocaleString()}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="flex items-center border border-border rounded-md">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.variantId, item.quantity, -1)}
                                                    className="p-2 hover:bg-background transition-colors"
                                                    disabled={loading}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 py-2 border-x border-border min-w-[3rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.variantId, item.quantity, 1)}
                                                    className="p-2 hover:bg-background transition-colors"
                                                    disabled={loading}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item.variantId)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                disabled={loading}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Total */}
                                    <div className="text-right">
                                        <p className="font-bold text-primary">
                                            Rs {(item.effectivePrice * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleClearCart}
                                className="text-sm text-red-500 hover:text-red-700 transition-colors"
                                disabled={loading}
                            >
                                Clear Cart
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-secondary p-6 rounded-lg sticky top-24">
                                <h2 className="text-xl font-semibold text-primary mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-foreground/80">
                                        <span>Subtotal</span>
                                        <span>Rs {total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-foreground/80">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-primary">
                                        <span>Total</span>
                                        <span>Rs {total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/checkout')}
                                    className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors mb-3"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    href="/"
                                    className="block text-center text-sm text-foreground/60 hover:text-primary transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
