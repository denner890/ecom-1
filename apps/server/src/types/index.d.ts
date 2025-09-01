import { Request } from 'express';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'user' | 'admin';
      };
    }
  }
}

// Common API Response types
export interface ApiResponse<T = any> {
  ok: boolean;
  message?: string;
  data?: T;
  details?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

// Auth DTOs
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
  token: string;
}

// Product DTOs
export interface CreateProductRequest {
  title: string;
  slug?: string;
  description: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  category: string;
  stock: number;
  variants?: Array<{
    name: string;
    values: string[];
  }>;
  isActive?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}

// Cart DTOs
export interface AddToCartRequest {
  productId: string;
  qty: number;
  variant?: Record<string, string>;
}

export interface UpdateCartItemRequest {
  qty: number;
}

// Order DTOs
export interface CreateOrderRequest {
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentRef?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
}

// File upload types
export interface UploadedFile {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export {};