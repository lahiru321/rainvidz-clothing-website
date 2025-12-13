"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import OrderStatusBadge from "@/components/admin/OrderStatusBadge"
import OrderStatusSelect from "@/components/admin/OrderStatusSelect"
import type { OrderStatus } from "@/components/admin/OrderStatusBadge"
import { getOrderById } from "@/lib/api/admin/orders"
import { formatCurrency, formatDateTime, formatOrderId, formatPhone } from "@/lib/utils/formatters"
import { ArrowLeft, Copy, Package, User, MapPin, CreditCard } from "lucide-react"

interface OrderItem {
    productId: string;
    productName: string;
    productCode: string;
    color: string;
    size: string;
    quantity: number;
    priceAtPurchase: number;
}

interface Order {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    shippingAddress: {
        addressLine1: string;
        city: string;
        postalCode: string;
    };
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
}

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const orderId = params.id as string

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchOrder()
    }, [orderId])

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const response = await getOrderById(orderId)
            setOrder(response.data)
        } catch (err: any) {
            console.error('Error fetching order:', err)
            setError(err.response?.data?.message || 'Failed to load order')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = (newStatus: OrderStatus) => {
        if (order) {
            setOrder({ ...order, status: newStatus })
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert('Copied to clipboard!')
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-foreground/60">Loading order...</p>
                </div>
            </AdminLayout>
        )
    }

    if (error || !order) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/orders"
                            className="p-2 hover:bg-secondary rounded-md transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-primary">Order Not Found</h1>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error || "The order you're looking for doesn't exist."}
                    </div>
                    <Link
                        href="/admin/orders"
                        className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Back to Orders
                    </Link>
                </div>
            </AdminLayout>
        )
    }

    const subtotal = order.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0)

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/orders"
                            className="p-2 hover:bg-secondary rounded-md transition-colors"
                            title="Back to Orders"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-primary">
                                Order {formatOrderId(order._id)}
                            </h1>
                            <p className="text-foreground/60 mt-1">
                                Placed on {formatDateTime(order.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <OrderStatusBadge status={order.status} size="lg" />
                        <OrderStatusSelect
                            currentStatus={order.status}
                            orderId={order._id}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-secondary p-6 rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold text-primary">Order Items</h2>
                            </div>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-md">
                                        <div className="flex-1">
                                            <p className="font-medium text-primary">
                                                {item.productName}
                                            </p>
                                            <p className="text-sm text-foreground/60 mt-1">
                                                {item.color} • {item.size} • Code: {item.productCode}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {item.quantity} × {formatCurrency(item.priceAtPurchase)}
                                            </p>
                                            <p className="text-sm text-foreground/60 mt-1">
                                                {formatCurrency(item.priceAtPurchase * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 pt-6 border-t border-border space-y-2">
                                <div className="flex justify-between text-foreground/60">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-foreground/60">
                                    <span>Shipping</span>
                                    <span>Rs 0</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold text-primary pt-2 border-t border-border">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <div className="bg-secondary p-6 rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold text-primary">Customer</h2>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="font-medium">{order.firstName} {order.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-foreground/60">Email</p>
                                    <p className="text-sm">{order.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-foreground/60">Phone</p>
                                    <p className="text-sm">{formatPhone(order.phone)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-secondary p-6 rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-primary">Shipping Address</h2>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(`${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`)}
                                    className="p-2 hover:bg-background rounded-md transition-colors"
                                    title="Copy Address"
                                >
                                    <Copy className="w-4 h-4 text-foreground/60" />
                                </button>
                            </div>
                            <div className="text-sm space-y-1">
                                <p>{order.shippingAddress.addressLine1}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p>Sri Lanka</p>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-secondary p-6 rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold text-primary">Payment</h2>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-foreground/60">Payment Method</p>
                                    <p className="text-sm font-medium">{order.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-foreground/60">Payment Status</p>
                                    <OrderStatusBadge status={order.status} size="sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
