"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PaymentSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [orderDetails, setOrderDetails] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails()
        } else {
            router.push('/')
        }
    }, [orderId])

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`)
            const data = await response.json()
            if (data.success) {
                setOrderDetails(data.data)
            }
        } catch (error) {
            console.error('Error fetching order:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Payment Successful!
                    </h1>
                    <p className="text-xl text-foreground/60 mb-8">
                        Thank you for your order. We've received your payment.
                    </p>

                    {/* Order Details Card */}
                    {loading ? (
                        <div className="bg-white rounded-lg border border-border p-8">
                            <p className="text-foreground/60">Loading order details...</p>
                        </div>
                    ) : orderDetails ? (
                        <div className="bg-white rounded-lg border border-border p-8 text-left">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                                <Package className="w-6 h-6 text-sage" />
                                <div>
                                    <h2 className="text-2xl font-bold text-primary">Order Confirmed</h2>
                                    <p className="text-sm text-foreground/60">
                                        Order #{orderDetails.orderNumber || orderId.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-foreground/60">Order Date:</span>
                                    <span className="font-medium">
                                        {new Date(orderDetails.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/60">Payment Method:</span>
                                    <span className="font-medium">{orderDetails.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/60">Payment Status:</span>
                                    <span className="font-medium text-green-600 capitalize">
                                        {orderDetails.paymentStatus || 'Completed'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-4 border-t border-border">
                                    <span>Total Amount:</span>
                                    <span className="text-sage">Rs {orderDetails.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-sage/5 rounded-lg p-4 mb-6">
                                <p className="text-sm text-foreground/80">
                                    <strong>What's next?</strong> We'll send you an email confirmation shortly.
                                    You can track your order status in your account.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/profile"
                                    className="flex-1 px-6 py-3 bg-sage text-white rounded-lg font-semibold hover:bg-sage/90 transition-colors text-center flex items-center justify-center gap-2"
                                >
                                    View Order Details
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/"
                                    className="flex-1 px-6 py-3 border-2 border-sage text-sage rounded-lg font-semibold hover:bg-sage/5 transition-colors text-center"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-border p-8">
                            <p className="text-foreground/60 mb-4">Order not found</p>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-sage text-white rounded-lg font-semibold hover:bg-sage/90 transition-colors"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
