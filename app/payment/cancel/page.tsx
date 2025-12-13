"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PaymentCancelPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    {/* Cancel Icon */}
                    <div className="mb-6">
                        <XCircle className="w-24 h-24 text-orange-500 mx-auto" />
                    </div>

                    {/* Cancel Message */}
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Payment Cancelled
                    </h1>
                    <p className="text-xl text-foreground/60 mb-8">
                        Your payment was cancelled. No charges were made.
                    </p>

                    {/* Info Card */}
                    <div className="bg-white rounded-lg border border-border p-8 text-left mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-4">What happened?</h2>
                        <p className="text-foreground/70 mb-6">
                            You cancelled the payment process. Your order has been created but is pending payment.
                            {orderId && (
                                <span className="block mt-2 text-sm">
                                    Order ID: <span className="font-mono font-semibold">{orderId.slice(-8).toUpperCase()}</span>
                                </span>
                            )}
                        </p>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-orange-800">
                                <strong>Note:</strong> Your order will be automatically cancelled if payment is not completed within 24 hours.
                            </p>
                        </div>

                        <h3 className="font-semibold text-lg mb-3">What would you like to do?</h3>
                        <ul className="space-y-2 text-foreground/70 mb-6">
                            <li className="flex items-start gap-2">
                                <span className="text-sage mt-1">•</span>
                                <span>Try the payment again with a different payment method</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-sage mt-1">•</span>
                                <span>Continue shopping and checkout later</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-sage mt-1">•</span>
                                <span>Contact us if you need assistance</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/checkout"
                                className="flex-1 px-6 py-3 bg-sage text-white rounded-lg font-semibold hover:bg-sage/90 transition-colors text-center flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Checkout
                            </Link>
                            <Link
                                href="/shop"
                                className="flex-1 px-6 py-3 border-2 border-sage text-sage rounded-lg font-semibold hover:bg-sage/5 transition-colors text-center flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="text-center">
                        <p className="text-foreground/60 mb-2">Need help?</p>
                        <Link
                            href="/#about"
                            className="text-sage hover:underline font-medium"
                        >
                            Contact our support team
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
