import axios from 'axios';
import { Category } from './category.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ENDPOINT = `${API_URL}/api/products`;

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[]; // Array of image URLs
  cloudinaryPublicIds: string[]; // Array of Cloudinary public IDs
  imageUrl?: string; // For backwards compatibility
  cloudinaryPublicId?: string; // For backwards compatibility
  categoryId: string | Category;
  parentPage: string;
  tags: string[]; // Tags/Labels for the product
  stockStatus: 'In Stock' | 'Out of Stock';
  isActive: boolean;
  variants: {
    type: 'mobileModel' | 'clothingSize';
    options: string[];
  };
  reviews: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductForm {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  parentPage: string;
  slug?: string;
  media?: File | string | string[];
  mediaFiles?: (File | string)[];
  mediaPreview?: string | string[];
  tags?: string[];
  stockStatus?: 'In Stock' | 'Out of Stock';
  isActive?: boolean;
  variantType?: 'mobileModel' | 'clothingSize';
  variantOptions?: string[];
}

export interface ApiResponse {
  success: boolean;
  count?: number;
  data: Product[] | Product;
  message?: string;
}

export interface ApiDeleteResponse {
  success: boolean;
  message: string;
}

// Get all products
export const fetchProducts = async (categoryId?: string): Promise<Product[]> => {
  const url = categoryId ? `${ENDPOINT}?categoryId=${categoryId}` : ENDPOINT;
  const response = await axios.get<ApiResponse>(url);
  return response.data.data as Product[];
};

// Get product by ID
export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<ApiResponse>(`${ENDPOINT}/${id}`);
  return response.data.data as Product;
};

// Create product
export const createProduct = async (formData: any): Promise<ApiResponse> => {
  const response = await axios.post<ApiResponse>(ENDPOINT, formData);
  return response.data;
};

// Update product
export const updateProduct = async ({ id, formData }: { id: string; formData: any }): Promise<ApiResponse> => {
  const response = await axios.put<ApiResponse>(`${ENDPOINT}/${id}`, formData);
  return response.data;
};

// Delete product
export const deleteProduct = async (id: string): Promise<ApiDeleteResponse> => {
  const response = await axios.delete<ApiDeleteResponse>(`${ENDPOINT}/${id}`);
  return response.data;
}; 