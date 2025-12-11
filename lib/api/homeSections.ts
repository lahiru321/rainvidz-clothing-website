import apiClient from './client';

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

/**
 * Get hero slides (public)
 */
export const getHeroSlides = async () => {
    const response = await apiClient.get('/home-sections?type=hero');
    return response.data;
};

/**
 * Get collection banners (public)
 */
export const getCollectionBanners = async () => {
    const response = await apiClient.get('/home-sections?type=banner');
    return response.data;
};
