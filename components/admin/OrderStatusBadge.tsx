type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    PENDING: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    PAID: {
        label: 'Paid',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    PROCESSING: {
        label: 'Processing',
        className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    SHIPPED: {
        label: 'Shipped',
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    DELIVERED: {
        label: 'Delivered',
        className: 'bg-green-100 text-green-800 border-green-200'
    },
    CANCELLED: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-200'
    }
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
};

export default function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full border ${config.className} ${sizeClasses[size]}`}
        >
            {config.label}
        </span>
    );
}

export { type OrderStatus };
