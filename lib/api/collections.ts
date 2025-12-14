import apiClient from './client';
import { Product } from './products';

export interface Collection {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    displayOrder: number;
}

export interface CollectionsResponse {
    success: boolean;
    data: Collection[];
}

export interface CollectionWithProductsResponse {
    success: boolean;
    data: {
        collection: Collection;
        products: Product[];
    };
}

/**
 * Get all active collections
 */
export const getCollections = async (): Promise<CollectionsResponse> => {
    const response = await apiClient.get('/collections');
    return response.data;
};

/**
 * Get a single collection by slug with its products
 */
export const getCollectionBySlug = async (slug: string): Promise<CollectionWithProductsResponse> => {
    const response = await apiClient.get(`/collections/${slug}`);
    return response.data;
};
