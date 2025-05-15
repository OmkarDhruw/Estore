import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ENDPOINT = `${API_URL}/api/video-gallery`;

export interface VideoItem {
  _id: string;
  title: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  videoUrl: string;
  thumbnail: string;
  cloudinaryPublicId: string;
  socialMediaUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoItemForm {
  title: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  socialMediaUrl: string;
  media?: File | string;
  mediaPreview?: string;
}

export interface ApiResponse {
  success: boolean;
  count?: number;
  data: VideoItem[] | VideoItem;
  message?: string;
}

export interface ApiDeleteResponse {
  success: boolean;
  message: string;
}

// Get all video items
export const fetchVideoItems = async (): Promise<VideoItem[]> => {
  const response = await axios.get<ApiResponse>(ENDPOINT);
  return response.data.data as VideoItem[];
};

// Get video item by ID
export const fetchVideoItemById = async (id: string): Promise<VideoItem> => {
  const response = await axios.get<ApiResponse>(`${ENDPOINT}/${id}`);
  return response.data.data as VideoItem;
};

// Create video item
export const createVideoItem = async (formData: any): Promise<ApiResponse> => {
  const response = await axios.post<ApiResponse>(ENDPOINT, formData);
  return response.data;
};

// Update video item
export const updateVideoItem = async ({ id, formData }: { id: string; formData: any }): Promise<ApiResponse> => {
  const response = await axios.put<ApiResponse>(`${ENDPOINT}/${id}`, formData);
  return response.data;
};

// Delete video item
export const deleteVideoItem = async (id: string): Promise<ApiDeleteResponse> => {
  const response = await axios.delete<ApiDeleteResponse>(`${ENDPOINT}/${id}`);
  return response.data;
}; 