import axios from 'axios';
import { supabase } from '@/lib/supabase/client';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach auth token
apiClient.interceptors.request.use(
    async (config) => {
        // Get Supabase session token
        if (typeof window !== 'undefined') {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`;
                }
            } catch (error) {
                console.error('Error getting session:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
