import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ENDPOINT = `${API_URL}/api/categories`;

export interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  parentPage: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryForm {
  name: string;
  slug?: string;
  parentPage: string;
  media?: File | string;
  mediaPreview?: string;
}

export interface ApiResponse {
  success: boolean;
  count?: number;
  data: Category[] | Category;
  message?: string;
}

export interface ApiDeleteResponse {
  success: boolean;
  message: string;
}

// Get all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<ApiResponse>(ENDPOINT);
  return response.data.data as Category[];
};

// Get category by ID
export const fetchCategoryById = async (id: string): Promise<Category> => {
  const response = await axios.get<ApiResponse>(`${ENDPOINT}/${id}`);
  return response.data.data as Category;
};

// Create category
export const createCategory = async (formData: any): Promise<ApiResponse> => {
  const response = await axios.post<ApiResponse>(ENDPOINT, formData);
  return response.data;
};

// Update category
export const updateCategory = async ({ id, formData }: { id: string; formData: any }): Promise<ApiResponse> => {
  const response = await axios.put<ApiResponse>(`${ENDPOINT}/${id}`, formData);
  return response.data;
};

// Delete category
export const deleteCategory = async (id: string): Promise<ApiDeleteResponse> => {
  const response = await axios.delete<ApiDeleteResponse>(`${ENDPOINT}/${id}`);
  return response.data;
}; 