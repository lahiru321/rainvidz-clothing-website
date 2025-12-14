"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Package, Calendar, Mail, ShoppingBag } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/lib/contexts/AuthContext"
import { getOrders } from "@/lib/api/orders"

interface Order {
    _id: string
    email: string
    firstName: string
    lastName: string
    status: string
    totalAmount: number
    paymentMethod: string
    createdAt: string
    items: Array<{
        productName: string
        quantity: number
    }>
}

export default function ProfilePage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!authLoading && !user) {
            router.push('/login?redirect=/profile')
            return
        }

        // Fetch orders if authenticated
        if (user) {
            fetchOrders()
        }
    }, [user, authLoading, router])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await getOrders()
            setOrders(response.data)
        } catch (err: any) {
            console.error('Error fetching orders:', err)
            setError('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'PAID':
                return 'bg-blue-100 text-blue-800'
            case 'PROCESSING':
                return 'bg-purple-100 text-purple-800'
            case 'SHIPPED':
                return 'bg-indigo-100 text-indigo-800'
            case 'DELIVERED':
                return 'bg-green-100 text-green-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center h-screen">
                    <p className="text-foreground/60">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">My Account</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-secondary p-6 rounded-lg sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold text-primary">Profile</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-foreground/60 mb-1">Name</p>
                                    <p className="font-medium">
                                        {user.user_metadata?.full_name || 'User'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-foreground/60 mb-1">Email</p>
                                    <p className="font-medium break-all">{user.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-foreground/60 mb-1">Member Since</p>
                                    <p className="font-medium">
                                        {formatDate(user.created_at)}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm text-foreground/60 mb-2">Total Orders</p>
                                    <p className="text-2xl font-bold text-primary">{orders.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-secondary p-6 rounded-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <Package className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold text-primary">Order History</h2>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <p className="text-foreground/60">Loading orders...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <p className="text-red-500">{error}</p>
                                    <button
                                        onClick={fetchOrders}
                                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                                    <p className="text-foreground/60 mb-6">
                                        You haven't placed any orders yet.
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => {
                                        const orderNumber = `ORD-${order._id.slice(-8).toUpperCase()}`
                                        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

                                        return (
                                            <Link
                                                key={order._id}
                                                href={`/order-confirmation?orderId=${order._id}`}
                                                className="block p-4 border-2 border-border rounded-lg hover:border-primary transition-colors"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className="font-semibold text-primary">
                                                                {orderNumber}
                                                            </p>
                                                            <span
                                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                                    order.status
                                                                )}`}
                                                            >
                                                                {order.status}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-sm text-foreground/60">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {formatDate(order.createdAt)}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Package className="w-4 h-4" />
                                                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-foreground/60 mt-2">
                                                            {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                                                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-sm text-foreground/60 mb-1">Total</p>
                                                        <p className="text-xl font-bold text-primary">
                                                            Rs {order.totalAmount.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
