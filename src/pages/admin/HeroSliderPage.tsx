import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PlusCircle, Pencil, Trash2, Check, X, Image, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

// Hero Slider interface
interface HeroSlider {
  _id: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  redirectUrl: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  cloudinaryPublicId: string;
  createdAt: string;
}

// Form state interface
interface HeroSliderForm {
  title: string;
  subtitle: string;
  buttonLabel: string;
  redirectUrl: string;
  media?: File | string;
  mediaPreview?: string;
}

// API functions
const API_URL = 'http://localhost:5000/api/hero-sliders';

interface ApiResponse {
  data: HeroSlider[];
  success: boolean;
  count: number;
}

interface ApiSingleResponse {
  data: HeroSlider;
  success: boolean;
}

interface ApiDeleteResponse {
  success: boolean;
  message: string;
}

const fetchHeroSliders = async (): Promise<HeroSlider[]> => {
  const response = await axios.get<ApiResponse>(API_URL);
  return response.data.data;
};

const createHeroSlider = async (formData: any): Promise<ApiSingleResponse> => {
  const response = await axios.post<ApiSingleResponse>(API_URL, formData);
  return response.data;
};

const updateHeroSlider = async ({ id, formData }: { id: string; formData: any }): Promise<ApiSingleResponse> => {
  const response = await axios.put<ApiSingleResponse>(`${API_URL}/${id}`, formData);
  return response.data;
};

const deleteHeroSlider = async (id: string): Promise<ApiDeleteResponse> => {
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

const HeroSliderPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HeroSliderForm>({
    title: '',
    subtitle: '',
    buttonLabel: '',
    redirectUrl: '',
  });
  
  // Fetch hero sliders
  const { data: heroSliders = [], isLoading, isError } = useQuery({
    queryKey: ['heroSliders'],
    queryFn: fetchHeroSliders
  });
  
  // Mutations
  const createMutation = useMutation({
    mutationFn: createHeroSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['heroSliders']});
      toast.success('Hero slider created successfully');
      handleCloseEditor();
    },
    onError: () => {
      toast.error('Failed to create hero slider');
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateHeroSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['heroSliders']});
      toast.success('Hero slider updated successfully');
      handleCloseEditor();
    },
    onError: () => {
      toast.error('Failed to update hero slider');
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteHeroSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['heroSliders']});
      toast.success('Hero slider deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete hero slider');
    },
  });
  
  // Editor handlers
  const handleOpenEditor = (slider?: HeroSlider) => {
    if (slider) {
      setForm({
        title: slider.title,
        subtitle: slider.subtitle,
        buttonLabel: slider.buttonLabel,
        redirectUrl: slider.redirectUrl,
        mediaPreview: slider.mediaUrl,
      });
      setEditingId(slider._id);
    } else {
      setForm({
        title: '',
        subtitle: '',
        buttonLabel: '',
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
      buttonLabel: '',
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
      if (!form.title || !form.subtitle || !form.buttonLabel || !form.redirectUrl) {
        return toast.error('Please fill in all fields');
      }
      
      if (!editingId && !form.media) {
        return toast.error('Please select a media file');
      }
      
      // Prepare data for API
      let base64Media = '';
      
      if (form.media instanceof File) {
        base64Media = await convertToBase64(form.media);
      }
      
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        buttonLabel: form.buttonLabel,
        redirectUrl: form.redirectUrl,
        ...(base64Media && { media: base64Media })
      };
      
      if (editingId) {
        // Update existing slider
        await updateMutation.mutateAsync({ 
          id: editingId, 
          formData: payload
        });
      } else {
        // Create new slider
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save hero slider');
    }
  };
  
  // Delete handler
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };
  
  // Loading and error states
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  if (isError) {
    return <div className="text-center py-8 text-red-500">Error loading hero sliders</div>;
  }
  
  // Render main view or edit form
  if (isEditing) {
    // Edit form view
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Hero Slider</h1>
        </div>
        
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-6">Edit Slide</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="flex gap-8">
              {/* Left column - Form fields */}
              <div className="flex-1">
                <div className="mb-4">
                  <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
                    Slide Image (1920×1080 recommended)
                  </label>
                  <input
                    type="file"
                    id="media"
                    name="media"
                    accept="image/*,video/*"
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
                  <label htmlFor="buttonLabel" className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    id="buttonLabel"
                    name="buttonLabel"
                    value={form.buttonLabel}
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
                    form.media instanceof File && form.media.type.startsWith('video/') ? (
                      <video 
                        src={form.mediaPreview} 
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={form.mediaPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No media selected</p>
                    </div>
                  )}
                  
                  {/* Text overlay preview */}
                  <div className="absolute inset-0 flex items-center px-8">
                    <div className="max-w-md">
                      <h2 className="text-2xl md:text-3xl font-bold text-pink-500 mb-2">
                        {form.title || 'Premium Mobile Skins'}
                      </h2>
                      <p className="text-base md:text-lg text-white mb-4">
                        {form.subtitle || 'Exclusive designs for your device'}
                      </p>
                      <span className="inline-block bg-pink-500 text-white px-4 py-2 rounded">
                        {form.buttonLabel || 'Shop Now'}
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
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Slide'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Main list view
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Hero Slider</h1>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Hero Slider</h2>
          <button
            onClick={() => handleOpenEditor()}
            className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add New Slide
          </button>
        </div>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Slides (drag to reorder)</h3>
          
          <div className="space-y-4">
            {heroSliders.length === 0 ? (
              <p className="py-6 text-center text-gray-500">No hero sliders found. Add your first one!</p>
            ) : (
              heroSliders.map((slider) => (
                <div key={slider._id} className="border border-gray-200 rounded-md p-2 flex items-center">
                  <div className="mr-2 cursor-move">
                    <Menu size={18} className="text-gray-400" />
                  </div>
                  
                  <div className="h-16 w-24 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    {slider.mediaType === 'image' ? (
                      <img
                        src={slider.mediaUrl}
                        alt={slider.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-black">
                        <span className="text-white text-xs">Video</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 ml-4">
                    <h4 className="text-md font-medium text-gray-900">{slider.title}</h4>
                    <p className="text-sm text-gray-500">{slider.subtitle}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      Button: {slider.buttonLabel} → {slider.redirectUrl}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleOpenEditor(slider)}
                      className="text-blue-600 p-2 hover:bg-blue-50 rounded-full"
                      aria-label="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(slider._id)}
                      className="text-red-600 p-2 hover:bg-red-50 rounded-full"
                      aria-label="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-600 flex items-center p-4 bg-blue-50 rounded-md">
          <div className="mr-2 text-blue-600">ℹ️</div>
          <p>
            Note: In the complete implementation, images will be uploaded to Cloudinary and stored in MongoDB. 
            The current implementation simulates this process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSliderPage; 