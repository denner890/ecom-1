import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth-token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Product API
export const productApi = {
  getAll: (params?: Record<string, any>) => 
    apiClient.get('/products', { params }).then(res => res.data),
  getBySlug: (slug: string) => 
    apiClient.get(`/products/${slug}`).then(res => res.data),
  create: (data: any) => 
    apiClient.post('/products', data).then(res => res.data),
  update: (id: string, data: any) => 
    apiClient.put(`/products/${id}`, data).then(res => res.data),
  delete: (id: string) => 
    apiClient.delete(`/products/${id}`).then(res => res.data),
};

// Auth API
export const authApi = {
  login: (credentials: any) => 
    apiClient.post('/auth/login', credentials).then(res => res.data),
  register: (userData: any) => 
    apiClient.post('/auth/register', userData).then(res => res.data),
  logout: () => 
    apiClient.post('/auth/logout').then(res => res.data),
  getProfile: () => 
    apiClient.get('/auth/profile').then(res => res.data),
  refreshToken: () => 
    apiClient.post('/auth/refresh').then(res => res.data),
};

// Order API
export const orderApi = {
  getAll: () => 
    apiClient.get('/orders').then(res => res.data),
  getById: (id: string) => 
    apiClient.get(`/orders/${id}`).then(res => res.data),
  create: (data: any) => 
    apiClient.post('/orders', data).then(res => res.data),
  update: (id: string, data: any) => 
    apiClient.put(`/orders/${id}`, data).then(res => res.data),
  cancel: (id: string) => 
    apiClient.post(`/orders/${id}/cancel`).then(res => res.data),
};

// Cart API
export const cartApi = {
  get: () => 
    apiClient.get('/cart').then(res => res.data),
  addItem: (data: any) => 
    apiClient.post('/cart/items', data).then(res => res.data),
  updateItem: (itemId: string, data: any) => 
    apiClient.put(`/cart/items/${itemId}`, data).then(res => res.data),
  removeItem: (itemId: string) => 
    apiClient.delete(`/cart/items/${itemId}`).then(res => res.data),
  clear: () => 
    apiClient.delete('/cart').then(res => res.data),
};

export default apiClient;