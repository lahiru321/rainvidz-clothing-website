import apiClient from '../client';

export interface Order {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    items: Array<{
        productId: string;
        productName: string;
        variantId: string;
        color: string;
        size: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentMethod: 'PAYHERE' | 'WEBXPAY' | 'COD';
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderFilters {
    status?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface OrdersResponse {
    success: boolean;
    data: Order[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface OrderStats {
    total: number;
    byStatus: {
        pending: number;
        paid: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    totalRevenue: number;
    recentOrders: Order[];
}

/**
 * Get all orders with filters
 */
export const getAllOrders = async (filters?: OrderFilters): Promise<OrdersResponse> => {
    const response = await apiClient.get('/admin/orders', { params: filters });
    return response.data;
};

/**
 * Get single order by ID
 */
export const getOrderById = async (id: string): Promise<{ success: boolean; data: Order }> => {
    const response = await apiClient.get(`/admin/orders/${id}`);
    return response.data;
};

/**
 * Update order status
 */
export const updateOrderStatus = async (id: string, status: string) => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { status });
    return response.data;
};

/**
 * Get order statistics
 */
export const getOrderStats = async (): Promise<{ success: boolean; data: OrderStats }> => {
    const response = await apiClient.get('/admin/orders/stats/overview');
    return response.data;
};
