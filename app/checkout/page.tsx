"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, CreditCard, Truck, MapPin } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCartStore } from "@/lib/store/cartStore"
import { createOrder } from "@/lib/api/orders"

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotal, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: 'Sri Lanka',
        paymentMethod: 'COD',
        notes: ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            alert('Please fill in all required fields')
            return
        }

        if (items.length === 0) {
            alert('Your cart is empty')
            return
        }

        setLoading(true)
        try {
            // Split fullName into firstName and lastName
            const nameParts = formData.fullName.trim().split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

            const orderData = {
                email: formData.email,
                firstName,
                lastName,
                phone: formData.phone,
                shippingAddress: {
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country
                },
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity
                })),
                paymentMethod: formData.paymentMethod
            }

            const response = await createOrder(orderData)

            // Clear cart after successful order
            clearCart()

            // Redirect to order confirmation
            router.push(`/order-confirmation?orderId=${response.data._id}`)
        } catch (error: any) {
            console.error('Error creating order:', error)
            alert('Failed to create order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const total = getTotal()
    const shippingCost = 0 // Free shipping
    const tax = 0 // No tax for now
    const grandTotal = total + shippingCost + tax

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center py-16">
                        <ShoppingBag className="w-24 h-24 mx-auto text-foreground/20 mb-4" />
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
                        <p className="text-foreground/60 mb-6">Add some items before checking out!</p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <div className="bg-secondary p-6 rounded-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold text-primary">Contact Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.fullName ? 'border-red-500' : 'border-border'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-border'
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : 'border-border'
                                                }`}
                                            placeholder="+94 77 123 4567"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-secondary p-6 rounded-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <Truck className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold text-primary">Shipping Address</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Address Line 1 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={formData.addressLine1}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.addressLine1 ? 'border-red-500' : 'border-border'
                                                }`}
                                            placeholder="123 Main Street"
                                        />
                                        {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Address Line 2</label>
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={formData.addressLine2}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Apartment, suite, etc. (optional)"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? 'border-red-500' : 'border-border'
                                                    }`}
                                                placeholder="Colombo"
                                            />
                                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Postal Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.postalCode ? 'border-red-500' : 'border-border'
                                                    }`}
                                                placeholder="10100"
                                            />
                                            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-border rounded-md bg-secondary/50"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-secondary p-6 rounded-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold text-primary">Payment Method</h2>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border-2 border-border rounded-md cursor-pointer hover:border-primary transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={formData.paymentMethod === 'COD'}
                                            onChange={handleInputChange}
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">Cash on Delivery</p>
                                            <p className="text-sm text-foreground/60">Pay when you receive your order</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 border-border rounded-md cursor-pointer hover:border-primary transition-colors opacity-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online_payment"
                                            disabled
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">Online Payment</p>
                                            <p className="text-sm text-foreground/60">Coming soon</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="bg-secondary p-6 rounded-lg">
                                <h2 className="text-xl font-semibold text-primary mb-4">Order Notes (Optional)</h2>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Any special instructions for your order..."
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-secondary p-6 rounded-lg sticky top-24">
                                <h2 className="text-xl font-semibold text-primary mb-4">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.variantId} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="w-16 h-20 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.productName}</p>
                                                <p className="text-xs text-foreground/60">
                                                    {item.variantColor} / {item.variantSize}
                                                </p>
                                                <p className="text-sm">Qty: {item.quantity}</p>
                                                <p className="text-sm font-semibold">
                                                    Rs {(item.effectivePrice * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 border-t border-border pt-4">
                                    <div className="flex justify-between text-foreground/80">
                                        <span>Subtotal</span>
                                        <span>Rs {total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-foreground/80">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-foreground/80">
                                        <span>Tax</span>
                                        <span>Rs 0</span>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-primary">
                                        <span>Total</span>
                                        <span>Rs {grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>

                                <Link
                                    href="/cart"
                                    className="block text-center text-sm text-foreground/60 hover:text-primary transition-colors mt-4"
                                >
                                    ← Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    )
}
