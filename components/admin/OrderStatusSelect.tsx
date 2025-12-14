"use client"

import { useState } from "react"
import { updateOrderStatus } from "@/lib/api/admin/orders"
import type { OrderStatus } from "./OrderStatusBadge"

interface OrderStatusSelectProps {
    currentStatus: OrderStatus;
    orderId: string;
    onStatusChange?: (newStatus: OrderStatus) => void;
}

const statuses: OrderStatus[] = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusLabels: Record<OrderStatus, string> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};

export default function OrderStatusSelect({ currentStatus, orderId, onStatusChange }: OrderStatusSelectProps) {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus)
    const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as OrderStatus;

        console.log('Status dropdown changed:', { from: currentStatus, to: newStatus })

        if (newStatus === currentStatus) {
            console.log('Same status selected, ignoring')
            return;
        }

        // Show confirmation UI
        setPendingStatus(newStatus)
    }

    const confirmStatusChange = async () => {
        if (!pendingStatus) return;

        try {
            setLoading(true)
            setError(null)
            console.log('Updating order status:', { orderId, newStatus: pendingStatus })

            const response = await updateOrderStatus(orderId, pendingStatus)
            console.log('Status update response:', response)

            // Update local state
            setSelectedStatus(pendingStatus)

            // Notify parent component
            onStatusChange?.(pendingStatus)

            // Clear pending
            setPendingStatus(null)

            alert('Order status updated successfully!')
        } catch (err: any) {
            console.error('Error updating order status:', err)
            console.error('Error details:', err.response?.data)

            // Reset to current status on error
            setSelectedStatus(currentStatus)

            setError(err.response?.data?.message || 'Failed to update status')
            alert(`Failed to update order status: ${err.response?.data?.message || err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const cancelStatusChange = () => {
        console.log('User cancelled status change')
        setSelectedStatus(currentStatus)
        setPendingStatus(null)
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <select
                    value={selectedStatus}
                    onChange={handleDropdownChange}
                    disabled={loading || pendingStatus !== null}
                    className="px-3 py-2 border border-border rounded-md bg-background text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {statusLabels[status]}
                        </option>
                    ))}
                </select>

                {pendingStatus && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={confirmStatusChange}
                            disabled={loading}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={cancelStatusChange}
                            disabled={loading}
                            className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {pendingStatus && (
                <p className="text-xs text-orange-600 mt-1">
                    Change status to "{statusLabels[pendingStatus]}"? Click Confirm or Cancel.
                </p>
            )}

            {loading && (
                <p className="text-xs text-blue-500 mt-1">Updating...</p>
            )}
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    )
}
