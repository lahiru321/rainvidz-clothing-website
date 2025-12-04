import apiClient from './client';

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface CategoriesResponse {
    success: boolean;
    data: Category[];
}

export interface CategoryWithProductsResponse {
    success: boolean;
    data: {
        category: Category;
        products: any[]; // Use Product type from products.ts
    };
}

/**
 * Get all categories
 */
export const getCategories = async (): Promise<CategoriesResponse> => {
    const response = await apiClient.get('/categories');
    return response.data;
};

/**
 * Get a single category by slug with its products
 */
export const getCategoryBySlug = async (slug: string): Promise<CategoryWithProductsResponse> => {
    const response = await apiClient.get(`/categories/${slug}`);
    return response.data;
};
