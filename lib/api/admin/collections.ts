import apiClient from '../client';

export interface Collection {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CollectionCreateData {
    name: string;
    slug: string;
    description?: string;
}

/**
 * Create a new collection
 */
export const createCollection = async (data: CollectionCreateData) => {
    const response = await apiClient.post('/admin/collections', data);
    return response.data;
};

/**
 * Update an existing collection
 */
export const updateCollection = async (id: string, data: Partial<CollectionCreateData>) => {
    const response = await apiClient.put(`/admin/collections/${id}`, data);
    return response.data;
};

/**
 * Delete a collection
 */
export const deleteCollection = async (id: string) => {
    const response = await apiClient.delete(`/admin/collections/${id}`);
    return response.data;
};

/**
 * Get collection statistics
 */
export const getCollectionStats = async (): Promise<{ success: boolean; data: any }> => {
    const response = await apiClient.get('/admin/collections/stats');
    return response.data;
};
