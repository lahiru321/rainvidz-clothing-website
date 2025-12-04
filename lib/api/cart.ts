import apiClient from './client';

export interface CartItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        slug: string;
        price: number;
        effectivePrice: number;
        images: Array<{
            url: string;
            isPrimary: boolean;
        }>;
    };
    variantId: string;
    quantity: number;
    addedAt: string;
}

export interface Cart {
    _id: string;
    supabaseUserId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CartResponse {
    success: boolean;
    data: Cart;
}

/**
 * Get user's cart
 */
export const getCart = async (): Promise<CartResponse> => {
    const response = await apiClient.get('/cart');
    return response.data;
};

/**
 * Add item to cart
 */
export const addToCart = async (data: {
    productId: string;
    variantId: string;
    quantity: number;
}): Promise<CartResponse> => {
    const response = await apiClient.post('/cart/add', data);
    return response.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
    itemId: string,
    quantity: number
): Promise<CartResponse> => {
    const response = await apiClient.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (itemId: string): Promise<CartResponse> => {
    const response = await apiClient.delete(`/cart/remove/${itemId}`);
    return response.data;
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<CartResponse> => {
    const response = await apiClient.delete('/cart/clear');
    return response.data;
};
