import apiClient from './client';

export interface Product {
    _id: string;
    name: string;
    slug: string;
    productCode: string;
    description: string;
    price: number;
    salePrice?: number;
    category: {
        _id: string;
        name: string;
        slug: string;
    };
    collection?: {
        _id: string;
        name: string;
        slug: string;
    };
    stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
    isNewArrival: boolean;
    isFeatured: boolean;
    soldCount: number;
    images: Array<{
        url: string;
        isPrimary: boolean;
        isHover: boolean;
        displayOrder: number;
    }>;
    primaryImage: string;
    hoverImage: string;
    variants: Array<{
        color: string;
        size: string;
        quantity: number;
        sku: string;
    }>;
    effectivePrice: number;
    isOnSale?: boolean;
}

export interface ProductsResponse {
    success: boolean;
    data: {
        products: Product[];
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ProductResponse {
    success: boolean;
    data: Product;
}

export interface ProductFilters {
    category?: string;
    collection?: string;
    isNewArrival?: boolean;
    isFeatured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    color?: string;
    size?: string;
    sortBy?: 'price' | 'soldCount' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

/**
 * Get all products with optional filters
 */
export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const response = await apiClient.get('/products', { params: filters });
    return response.data;
};

/**
 * Get a single product by slug
 */
export const getProductBySlug = async (slug: string): Promise<ProductResponse> => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
};

/**
 * Get product variants
 */
export const getProductVariants = async (productId: string) => {
    const response = await apiClient.get(`/products/${productId}/variants`);
    return response.data;
};
