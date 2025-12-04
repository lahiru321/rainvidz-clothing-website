import apiClient from '../client';

export interface DashboardStats {
    products: {
        total: number;
        active: number;
        lowStock: number;
    };
    orders: {
        total: number;
        pending: number;
        processing: number;
        shipped: number;
    };
    revenue: {
        total: number;
    };
    recentOrders: any[];
    lowStockList: any[];
    bestSelling: any[];
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<{ success: boolean; data: DashboardStats }> => {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data;
};
