"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck, MapPin, CreditCard } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getOrderById } from "@/lib/api/orders"

interface OrderItem {
    productName: string;
    productCode: string;
    color: string;
    size: string;
    quantity: number;
    priceAtPurchase: number;
}

interface BackendOrder {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: {
        addressLine1: string;
        city: string;
        postalCode: string;
    };
    items: OrderItem[];
    createdAt: string;
}

export default function OrderConfirmationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')

    const [order, setOrder] = useState<BackendOrder | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!orderId) {
            router.push('/')
            return
        }

        const fetchOrder = async () => {
            try {
                const response = await getOrderById(orderId)
                setOrder(response.data as any)
            } catch (error) {
                console.error('Error fetching order:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center h-screen">
                    <p className="text-foreground/60">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                    <Link
                        href="/"
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    const orderNumber = `ORD-${order._id.slice(-8).toUpperCase()}`

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Message */}
                <div className="text-center mb-12">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-foreground/60 mb-4">
                        Thank you for your order. We've received it and will process it shortly.
                    </p>
                    <p className="text-sm text-foreground/60">
                        Order Number: <span className="font-bold text-primary">{orderNumber}</span>
                    </p>
                </div>

                {/* Order Details */}
                <div className="space-y-6">
                    {/* Order Items */}
                    <div className="bg-secondary p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold text-primary">Order Items</h2>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
                                    <div className="flex-1">
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-foreground/60">Color: {item.color} / Size: {item.size}</p>
                                        <p className="text-sm text-foreground/60">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">Rs {(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Total */}
                        <div className="mt-6 pt-4 border-t border-border space-y-2">
                            <div className="flex justify-between text-foreground/80">
                                <span>Subtotal</span>
                                <span>Rs {order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-foreground/80">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-border">
                                <span>Total</span>
                                <span>Rs {order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-secondary p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold text-primary">Shipping Address</h2>
                        </div>

                        <div className="text-foreground/80">
                            <p className="font-medium">{order.firstName} {order.lastName}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            </p>
                            <p className="mt-2">Phone: {order.phone}</p>
                            <p>Email: {order.email}</p>
                        </div>
                    </div>

                    {/* Payment & Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-secondary p-6 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold text-primary">Payment Method</h2>
                            </div>
                            <p className="text-foreground/80">
                                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                            </p>
                            <p className="text-sm text-foreground/60 mt-1">
                                Status: Pending
                            </p>
                        </div>

                        <div className="bg-secondary p-6 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Truck className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold text-primary">Delivery Status</h2>
                            </div>
                            <p className="text-foreground/80 capitalize">{order.status.toLowerCase()}</p>
                            <p className="text-sm text-foreground/60 mt-1">
                                We'll send you updates via email
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Link
                            href="/"
                            className="flex-1 text-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                        >
                            Print Order
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
