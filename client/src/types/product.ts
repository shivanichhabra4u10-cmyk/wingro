// client/src/types/product.ts
export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  category: string;
  productType: 'individual' | 'enterprise';
  images: string[];
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  message?: string;
}
