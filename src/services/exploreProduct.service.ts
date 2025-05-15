import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ENDPOINT = `${API_URL}/api/explore-products`;

export interface ExploreProduct {
  _id: string;
  title: string;
  description: string;
  redirectUrl: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExploreProductForm {
  title: string;
  description: string;
  redirectUrl: string;
  media?: File | string;
  mediaPreview?: string;
}

export interface ApiResponse {
  success: boolean;
  count?: number;
  data: ExploreProduct[] | ExploreProduct;
  message?: string;
}

export interface ApiDeleteResponse {
  success: boolean;
  message: string;
}

// Get all explore products
export const fetchExploreProducts = async (): Promise<ExploreProduct[]> => {
  const response = await axios.get<ApiResponse>(ENDPOINT);
  return response.data.data as ExploreProduct[];
};

// Get explore product by ID
export const fetchExploreProductById = async (id: string): Promise<ExploreProduct> => {
  const response = await axios.get<ApiResponse>(`${ENDPOINT}/${id}`);
  return response.data.data as ExploreProduct;
};

// Create explore product
export const createExploreProduct = async (formData: any): Promise<ApiResponse> => {
  const response = await axios.post<ApiResponse>(ENDPOINT, formData);
  return response.data;
};

// Update explore product
export const updateExploreProduct = async ({ id, formData }: { id: string; formData: any }): Promise<ApiResponse> => {
  const response = await axios.put<ApiResponse>(`${ENDPOINT}/${id}`, formData);
  return response.data;
};

// Delete explore product
export const deleteExploreProduct = async (id: string): Promise<ApiDeleteResponse> => {
  const response = await axios.delete<ApiDeleteResponse>(`${ENDPOINT}/${id}`);
  return response.data;
}; 