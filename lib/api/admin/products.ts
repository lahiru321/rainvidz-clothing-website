import apiClient from '../client';
import { Product } from '../products';

export interface ProductCreateData {
    name: string;
    slug: string;
    productCode: string;
    description: string;
    price: number;
    salePrice?: number;
    category: string;
    collection?: string;
    stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
    isNewArrival?: boolean;
    isFeatured?: boolean;
    images: Array<{
        url: string;
        isPrimary: boolean;
        isHover: boolean;
        displayOrder: number;
    }>;
    variants: Array<{
        color: string;
        size: string;
        quantity: number;
        sku: string;
    }>;
}

export interface ProductStats {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
    newArrivals: number;
    featured: number;
    lowStockList: Product[];
    bestSelling: Product[];
}

/**
 * Create a new product
 */
export const createProduct = async (data: ProductCreateData) => {
    const response = await apiClient.post('/admin/products', data);
    return response.data;
};

/**
 * Get a product by ID
 */
export const getProductById = async (id: string) => {
    const response = await apiClient.get(`/admin/products/${id}`);
    return response.data;
};

/**
 * Update an existing product
 */
export const updateProduct = async (id: string, data: Partial<ProductCreateData>) => {
    const response = await apiClient.put(`/admin/products/${id}`, data);
    return response.data;
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string) => {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
};

/**
 * Get product statistics
 */
export const getProductStats = async (): Promise<{ success: boolean; data: ProductStats }> => {
    const response = await apiClient.get('/admin/products/stats');
    return response.data;
};
