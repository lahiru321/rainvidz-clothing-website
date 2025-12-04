import apiClient from './client';

export interface CreateOrderData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    shippingAddress: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        postalCode: string;
        country: string;
    };
    items: Array<{
        productId: string;
        variantId: string;
        quantity: number;
    }>;
    paymentMethod: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    supabaseUserId?: string;
    guestEmail?: string;
    items: Array<{
        productId: {
            _id: string;
            name: string;
            slug: string;
        };
        variantId: string;
        quantity: number;
        price: number;
    }>;
    shippingAddress: {
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    createdAt: string;
}

export interface OrderResponse {
    success: boolean;
    data: Order;
}

/**
 * Create a new order
 */
export const createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
    const response = await apiClient.post('/orders/create', data);
    return response.data;
};

/**
 * Get user's order history
 */
export const getOrders = async (): Promise<{ success: boolean; data: Order[] }> => {
    const response = await apiClient.get('/orders/user');
    return response.data;
};

/**
 * Get specific order details
 */
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
};
