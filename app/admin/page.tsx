"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { getDashboardStats, type DashboardStats } from "@/lib/api/admin/dashboard"
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await getDashboardStats()
            setStats(response.data)
        } catch (err: any) {
            console.error('Error fetching stats:', err)
            setError('Failed to load dashboard statistics')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-foreground/60">Loading dashboard...</p>
                </div>
            </AdminLayout>
        )
    }

    if (error || !stats) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-500">{error || 'Failed to load dashboard'}</p>
                </div>
            </AdminLayout>
        )
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats.products.total,
            icon: Package,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100',
            link: '/admin/products'
        },
        {
            title: 'Total Orders',
            value: stats.orders.total,
            icon: ShoppingCart,
            color: 'text-green-500',
            bgColor: 'bg-green-100',
            link: '/admin/orders'
        },
        {
            title: 'Total Revenue',
            value: `Rs ${stats.revenue.total.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-purple-500',
            bgColor: 'bg-purple-100',
            link: '/admin/orders'
        },
        {
            title: 'Low Stock Items',
            value: stats.products.lowStock,
            icon: AlertTriangle,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100',
            link: '/admin/products'
        },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Dashboard</h1>
                    <p className="text-foreground/60 mt-1">Welcome to your admin dashboard</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.link}
                            className="bg-secondary p-6 rounded-lg border border-border hover:border-primary transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-foreground/60 mb-1">{card.title}</h3>
                            <p className="text-2xl font-bold text-primary">{card.value}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-secondary p-6 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-primary">Recent Orders</h2>
                        <Link
                            href="/admin/orders"
                            className="text-sm text-accent hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    {stats.recentOrders.length === 0 ? (
                        <p className="text-foreground/60 text-center py-8">No recent orders</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Order ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Customer</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Amount</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order) => (
                                        <tr key={order._id} className="border-b border-border hover:bg-background">
                                            <td className="py-3 px-4">
                                                <Link
                                                    href={`/admin/orders/${order._id}`}
                                                    className="text-accent hover:underline"
                                                >
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4">
                                                {order.firstName} {order.lastName}
                                            </td>
                                            <td className="py-3 px-4">
                                                Rs {order.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                                                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-foreground/60">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Low Stock & Best Selling */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Low Stock Products */}
                    <div className="bg-secondary p-6 rounded-lg border border-border">
                        <h2 className="text-xl font-semibold text-primary mb-4">Low Stock Alert</h2>
                        {stats.lowStockList.length === 0 ? (
                            <p className="text-foreground/60 text-center py-8">No low stock items</p>
                        ) : (
                            <div className="space-y-3">
                                {stats.lowStockList.map((product) => (
                                    <div key={product._id} className="flex items-center gap-3 p-3 bg-background rounded-md">
                                        {product.primaryImage && (
                                            <img
                                                src={product.primaryImage}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{product.name}</p>
                                            <p className="text-sm text-foreground/60">{product.productCode}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                                            Low Stock
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Best Selling Products */}
                    <div className="bg-secondary p-6 rounded-lg border border-border">
                        <h2 className="text-xl font-semibold text-primary mb-4">Best Selling</h2>
                        {stats.bestSelling.length === 0 ? (
                            <p className="text-foreground/60 text-center py-8">No sales data</p>
                        ) : (
                            <div className="space-y-3">
                                {stats.bestSelling.map((product) => (
                                    <div key={product._id} className="flex items-center gap-3 p-3 bg-background rounded-md">
                                        {product.primaryImage && (
                                            <img
                                                src={product.primaryImage}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{product.name}</p>
                                            <p className="text-sm text-foreground/60">Rs {product.price.toLocaleString()}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                            {product.soldCount} sold
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
