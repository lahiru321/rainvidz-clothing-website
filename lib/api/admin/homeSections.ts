import apiClient from '../client';

export interface HomeSection {
    _id: string;
    type: 'hero' | 'banner';
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundColor?: string;
    season?: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface HomeSectionCreateData {
    type: 'hero' | 'banner';
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundColor?: string;
    season?: string;
    displayOrder?: number;
    isActive?: boolean;
}

/**
 * Get all home sections
 */
export const getHomeSections = async (type?: 'hero' | 'banner') => {
    const url = type ? `/admin/home-sections?type=${type}` : '/admin/home-sections';
    const response = await apiClient.get(url);
    return response.data;
};

/**
 * Get a single home section
 */
export const getHomeSection = async (id: string) => {
    const response = await apiClient.get(`/admin/home-sections/${id}`);
    return response.data;
};

/**
 * Create a new home section
 */
export const createHomeSection = async (data: HomeSectionCreateData) => {
    const response = await apiClient.post('/admin/home-sections', data);
    return response.data;
};

/**
 * Update a home section
 */
export const updateHomeSection = async (id: string, data: Partial<HomeSectionCreateData>) => {
    const response = await apiClient.put(`/admin/home-sections/${id}`, data);
    return response.data;
};

/**
 * Delete a home section
 */
export const deleteHomeSection = async (id: string) => {
    const response = await apiClient.delete(`/admin/home-sections/${id}`);
    return response.data;
};
