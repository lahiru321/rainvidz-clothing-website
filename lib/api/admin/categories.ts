import apiClient from '../client';

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryCreateData {
    name: string;
    slug: string;
    description?: string;
}

/**
 * Create a new category
 */
export const createCategory = async (data: CategoryCreateData) => {
    const response = await apiClient.post('/admin/categories', data);
    return response.data;
};

/**
 * Update an existing category
 */
export const updateCategory = async (id: string, data: Partial<CategoryCreateData>) => {
    const response = await apiClient.put(`/admin/categories/${id}`, data);
    return response.data;
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
};

/**
 * Get category statistics
 */
export const getCategoryStats = async (): Promise<{ success: boolean; data: any }> => {
    const response = await apiClient.get('/admin/categories/stats');
    return response.data;
};
