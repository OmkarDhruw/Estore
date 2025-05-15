import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PlusCircle, Pencil, Trash2, Check, X, Image } from 'lucide-react';
import toast from 'react-hot-toast';

// Featured Collection interface
interface FeaturedCollection {
  _id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  redirectUrl: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  createdAt: string;
}

// Form state interface
interface FeaturedCollectionForm {
  title: string;
  subtitle: string;
  buttonText: string;
  redirectUrl: string;
  media?: File | string;
  mediaPreview?: string;
}

// API functions
const API_URL = 'http://localhost:5000/api/featured-collections';

interface ApiResponse {
  data: FeaturedCollection[];
  success: boolean;
  count: number;
}

interface ApiSingleResponse {
  data: FeaturedCollection;
  success: boolean;
}

interface ApiDeleteResponse {
  success: boolean;
  message: string;
}

const fetchFeaturedCollections = async (): Promise<FeaturedCollection[]> => {
  const response = await axios.get<ApiResponse>(API_URL);
  return response.data.data;
};

const createFeaturedCollection = async (formData: any): Promise<ApiSingleResponse> => {
  const response = await axios.post<ApiSingleResponse>(API_URL, formData);
  return response.data;
};

const updateFeaturedCollection = async ({ id, formData }: { id: string; formData: any }): Promise<ApiSingleResponse> => {
  const response = await axios.put<ApiSingleResponse>(`${API_URL}/${id}`, formData);
  return response.data;
};

const deleteFeaturedCollection = async (id: string): Promise<ApiDeleteResponse> => {
  const response = await axios.delete<ApiDeleteResponse>(`${API_URL}/${id}`);
  return response.data;
};

// Base64 converter for media
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const FeaturedCollectionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FeaturedCollectionForm>({
    title: '',
    subtitle: '',
    buttonText: '',
    redirectUrl: '',
  });
  
  // Fetch featured collections
  const { data: featuredCollections = [], isLoading, isError } = useQuery({
    queryKey: ['featuredCollections'],
    queryFn: fetchFeaturedCollections
  });
  
  // Mutations
  const createMutation = useMutation({
    mutationFn: createFeaturedCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['featuredCollections']});
      toast.success('Featured collection created successfully');
      handleCloseEditor();
    },
    onError: () => {
      toast.error('Failed to create featured collection');
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateFeaturedCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['featuredCollections']});
      toast.success('Featured collection updated successfully');
      handleCloseEditor();
    },
    onError: () => {
      toast.error('Failed to update featured collection');
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteFeaturedCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['featuredCollections']});
      toast.success('Featured collection deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete featured collection');
    },
  });
  
  // Editor handlers
  const handleOpenEditor = (collection?: FeaturedCollection) => {
    if (collection) {
      setForm({
        title: collection.title,
        subtitle: collection.subtitle || '',
        buttonText: collection.buttonText,
        redirectUrl: collection.redirectUrl,
        mediaPreview: collection.imageUrl,
      });
      setEditingId(collection._id);
    } else {
      setForm({
        title: '',
        subtitle: '',
        buttonText: '',
        redirectUrl: '',
      });
      setEditingId(null);
    }
    setIsEditing(true);
  };
  
  const handleCloseEditor = () => {
    setIsEditing(false);
    setForm({
      title: '',
      subtitle: '',
      buttonText: '',
      redirectUrl: '',
    });
    setEditingId(null);
  };
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      setForm((prev) => ({
        ...prev,
        media: file,
        mediaPreview: preview,
      }));
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Error processing file');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!form.title || !form.buttonText || !form.redirectUrl) {
        return toast.error('Please fill in all required fields');
      }

      // If creating new, image is required
      if (!editingId && !form.media) {
        return toast.error('Please select an image');
      }
      
      // Prepare form data
      const formData: any = {
        title: form.title,
        subtitle: form.subtitle,
        buttonText: form.buttonText,
        redirectUrl: form.redirectUrl,
      };
      
      // Convert File to Base64 for API
      if (form.media instanceof File) {
        formData.media = await convertToBase64(form.media);
      }
      
      // Create or update
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error saving featured collection');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this featured collection?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting featured collection:', error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-700"></div>
    </div>;
  }

  // Error state
  if (isError) {
    return <div className="text-center py-12 text-red-600">
      <p>Error loading featured collections. Please refresh the page.</p>
    </div>;
  }
  
  // Render main view or edit form
  if (isEditing) {
    // Edit form view
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Featured Collections</h1>
        </div>
        
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-6">Edit Collection</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="flex gap-8">
              {/* Left column - Form fields */}
              <div className="flex-1">
                <div className="mb-4">
                  <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Image (1920×1080 recommended)
                  </label>
                  <input
                    type="file"
                    id="media"
                    name="media"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a high-quality image for best results</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    id="buttonText"
                    name="buttonText"
                    value={form.buttonText}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="redirectUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    id="redirectUrl"
                    name="redirectUrl"
                    value={form.redirectUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Right column - Preview */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">Preview</h3>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[16/9]">
                  {form.mediaPreview ? (
                    <img
                      src={form.mediaPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No media selected</p>
                    </div>
                  )}
                  
                  {/* Text overlay preview */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-transparent flex items-center px-8">
                    <div className="max-w-md">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {form.title || 'Mobile Skins'}
                      </h2>
                      <p className="text-base md:text-lg text-white mb-4">
                        {form.subtitle || 'Discover our exclusive range of premium designs'}
                      </p>
                      <span className="inline-block bg-white text-purple-700 px-4 py-2 rounded">
                        {form.buttonText || 'Explore Now'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer with buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCloseEditor}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Collection'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Main list view - using the original card-based layout
  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Featured Collections</h1>
          <p className="text-gray-600 mt-1">
            Manage featured collections for the homepage
          </p>
        </div>
        <button
          onClick={() => handleOpenEditor()}
          className="flex items-center bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition"
        >
          <PlusCircle size={20} className="mr-2" />
          <span>Add New Collection</span>
        </button>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Featured Collections</h2>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Collections (drag to reorder)</h3>
      
          {/* Collection List */}
          {featuredCollections.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Image size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No featured collections</h3>
              <p className="text-gray-500 mt-1">
                Add your first featured collection to display on the homepage.
              </p>
              <button
                onClick={() => handleOpenEditor()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredCollections.map((collection) => (
                <div
                  key={collection._id}
                  className="relative overflow-hidden rounded-lg shadow-md"
                >
                  <div className="aspect-video">
                    <img
                      src={collection.imageUrl}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-transparent flex items-center">
                      <div className="p-6 text-white max-w-xs">
                        <h3 className="text-xl font-bold mb-1">{collection.title}</h3>
                        {collection.subtitle && (
                          <p className="text-sm opacity-90 mb-2">{collection.subtitle}</p>
                        )}
                        <span className="inline-block px-3 py-1 bg-white text-purple-800 rounded text-sm">
                          {collection.buttonText}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => handleOpenEditor(collection)}
                      className="p-1.5 bg-white/90 hover:bg-white rounded-full text-blue-600 shadow-sm"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(collection._id)}
                      className="p-1.5 bg-white/90 hover:bg-white rounded-full text-red-600 shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollectionsPage; 