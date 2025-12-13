import apiClient from '../client';

export interface UploadResponse {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    size: number;
}

/**
 * Upload a single image to Cloudinary
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/admin/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

/**
 * Delete an image from Cloudinary
 */
export const deleteImage = async (publicId: string) => {
    const response = await apiClient.delete(`/admin/upload/${publicId}`);
    return response.data;
};
