"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import OrderStatusBadge from "@/components/admin/OrderStatusBadge"
import type { OrderStatus } from "@/components/admin/OrderStatusBadge"
import { getAllOrders, type OrderFilters } from "@/lib/api/admin/orders"
import { formatCurrency, formatDate, formatOrderId } from "@/lib/utils/formatters"
import { Search, Filter, X, Eye, ChevronLeft, ChevronRight } from "lucide-react"

interface Order {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: OrderStatus;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [paymentFilter, setPaymentFilter] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState('')

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)

    useEffect(() => {
        fetchOrders()
    }, [currentPage, statusFilter, paymentFilter, searchQuery])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const filters: OrderFilters = {
                page: currentPage,
                limit: 20
            }

            if (statusFilter) filters.status = statusFilter
            if (paymentFilter) filters.paymentMethod = paymentFilter
            if (searchQuery) filters.search = searchQuery

            const response = await getAllOrders(filters)
            setOrders(response.data)
            setTotalPages(response.pagination.pages)
            setTotalOrders(response.pagination.total)
        } catch (err: any) {
            console.error('Error fetching orders:', err)
            setError('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const clearFilters = () => {
        setStatusFilter('')
        setPaymentFilter('')
        setSearchQuery('')
        setCurrentPage(1)
    }

    const hasFilters = statusFilter || paymentFilter || searchQuery

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Orders</h1>
                    <p className="text-foreground/60 mt-1">Manage customer orders and update statuses</p>
                </div>

                {/* Filters */}
                <div className="bg-secondary p-6 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-primary">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="PAID">Paid</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        {/* Payment Method Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Payment Method</label>
                            <select
                                value={paymentFilter}
                                onChange={(e) => {
                                    setPaymentFilter(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                            >
                                <option value="">All Methods</option>
                                <option value="COD">Cash on Delivery</option>
                                <option value="PAYHERE">PayHere</option>
                                <option value="WEBXPAY">WebXPay</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Search by order ID or customer email..."
                                    className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasFilters && (
                        <div className="mt-4">
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Orders Table */}
                <div className="bg-secondary rounded-lg border border-border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-foreground/60">
                            Loading orders...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-8 text-center text-foreground/60">
                            {hasFilters ? 'No orders found matching your filters.' : 'No orders yet.'}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-background">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-medium text-foreground/60">Order ID</th>
                                            <th className="text-left py-3 px-4 font-medium text-foreground/60">Customer</th>
                                            <th className="text-left py-3 px-4 font-medium text-foreground/60">Date</th>
                                            <th className="text-left py-3 px-4 font-medium text-foreground/60">Amount</th>
                                            <th className="text-left py-3 px-4 font-medium text-foreground/60">Payment</th>
                                            <th className="text-left py-3 px-4 font-medium text-foreground/60">Status</th>
                                            <th className="text-right py-3 px-4 font-medium text-foreground/60">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className="border-t border-border hover:bg-background">
                                                <td className="py-3 px-4">
                                                    <Link
                                                        href={`/admin/orders/${order._id}`}
                                                        className="font-mono text-sm text-primary hover:underline"
                                                    >
                                                        {formatOrderId(order._id)}
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="font-medium">{order.firstName} {order.lastName}</p>
                                                        <p className="text-sm text-foreground/60">{order.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-foreground/60">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="py-3 px-4 font-medium">
                                                    {formatCurrency(order.totalAmount)}
                                                </td>
                                                <td className="py-3 px-4 text-foreground/60">
                                                    {order.paymentMethod}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <OrderStatusBadge status={order.status} size="sm" />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/orders/${order._id}`}
                                                            className="p-2 hover:bg-background rounded-md transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4 text-blue-500" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                                    <div className="text-sm text-foreground/60">
                                        Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalOrders)} of {totalOrders} orders
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1 px-3 py-2 border border-border rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </button>
                                        <span className="text-sm text-foreground/60">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1 px-3 py-2 border border-border rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
