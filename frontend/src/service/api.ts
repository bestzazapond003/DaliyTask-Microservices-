import axios from 'axios';

// Smart Base URL resolution:
// If running in Production (under Nginx port 8080 or port 80), use relative path '/api/v1' (No CORS)
// If running in Local Dev (Vite port 5173), use 'http://localhost:3000/api/v1' (Cross-Origin Allowed)
const getBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.port !== '5173') {
    return '/api/v1';
  }
  return 'http://localhost:3000/api/v1';
};

const BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token & User ID if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    const currentUserId = localStorage.getItem('current_user_id');
    if (currentUserId) {
      config.headers['X-User-Id'] = currentUserId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap TransformInterceptor envelope { success: true, data: ... }
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    console.warn('API Error (falling back to client state if offline):', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);
