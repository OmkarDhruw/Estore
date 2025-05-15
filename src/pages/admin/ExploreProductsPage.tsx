import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PlusCircle, Pencil, Trash2, Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchExploreProducts, 
  createExploreProduct, 
  updateExploreProduct, 
  deleteExploreProduct, 
  ExploreProduct, 
  ExploreProductForm 
} from '../../services/exploreProduct.service';

// Log when the component is loaded
console.log('ExploreProductsPage component loaded - UPDATED VERSION WITH CIRCULAR LAYOUT');

// Base64 converter for media
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Default products to create if none exist
const defaultProducts = [
  {
    title: 'Explore Skins',
    description: 'Find unique skins for your devices',
    redirectUrl: '/products/explore-skins',
    mediaUrl: '/image/Skins Collection/SUPERHERO.jpg.jpeg'
  },
  {
    title: 'Mobile Skins',
    description: 'Premium skins for your mobile devices',
    redirectUrl: '/products/mobile-skins',
    mediaUrl: '/image/Skins Collection/mobile-skins.webp_6.jpeg'
  },
  {
    title: 'Laptop Skins',
    description: 'High-quality skins for your laptop',
    redirectUrl: '/products/laptop-skins',
    mediaUrl: '/image/laptop skins/Collection Laptop Skins  (1).jpeg'
  },
  {
    title: 'Explore Clothing',
    description: 'Discover our clothing collection',
    redirectUrl: '/products/explore-clothing',
    mediaUrl: '/image/hero page front image/Explore Clothing.jpg'
  },
  {
    title: 'Men\'s Collection',
    description: 'Stylish clothing for men',
    redirectUrl: '/products/mens-collection',
    mediaUrl: '/image/men/Men\'s Collection (2).jpeg'
  },
  {
    title: 'Women\'s Collection',
    description: 'Fashionable clothing for women',
    redirectUrl: '/products/womens-collection',
    mediaUrl: '/image/women/dummy women cloth (1).jpeg'
  }
];

// Function to convert image URL to base64
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    // For remote URLs
    if (url.startsWith('http')) {
      const response = await fetch(url);
      const blob = await response.blob();
      return await convertToBase64(blob as File);
    } 
    // For local files
    else {
      const response = await fetch(url);
      const blob = await response.blob();
      return await convertToBase64(blob as File);
    }
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

const ExploreProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExploreProductForm>({
    title: '',
    description: '',
    redirectUrl: '',
  });
  const [isCreatingDefaults, setIsCreatingDefaults] = useState(false);
  
  // Fetch explore products
  const { data: exploreProducts = [], isLoading, isError } = useQuery({
    queryKey: ['exploreProducts'],
    queryFn: fetchExploreProducts
  });
  
  // Mutations
  const createMutation = useMutation({
    mutationFn: createExploreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['exploreProducts']});
      toast.success('Explore product created successfully');
      handleCloseEditor();
    },
    onError: () => {
      toast.error('Failed to create explore product');
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateExploreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['exploreProducts']});
      toast.success('Explore product updated successfully');
      handleCloseEditor();
    },
    onError: () => {
      toast.error('Failed to update explore product');
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteExploreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['exploreProducts']});
      toast.success('Explore product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete explore product');
    },
  });

  // Function to create default products if none exist
  const createDefaultProducts = async () => {
    try {
      setIsCreatingDefaults(true);
      toast.loading('Creating default explore products...');
      
      // Process each default product sequentially
      for (const product of defaultProducts) {
        try {
          // Convert the image URL to base64
          const base64Media = await urlToBase64(product.mediaUrl);
          
          // Create the product
          await createMutation.mutateAsync({
            title: product.title,
            description: product.description,
            redirectUrl: product.redirectUrl,
            media: base64Media
          });
          
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error creating default product ${product.title}:`, error);
        }
      }
      
      toast.dismiss();
      toast.success('Default explore products created successfully');
      
      // Refresh the product list
      queryClient.invalidateQueries({queryKey: ['exploreProducts']});
    } catch (error) {
      console.error('Error creating default products:', error);
      toast.dismiss();
      toast.error('Failed to create default explore products');
    } finally {
      setIsCreatingDefaults(false);
    }
  };
  
  // Editor handlers
  const handleOpenEditor = (product?: ExploreProduct) => {
    if (product) {
      setForm({
        title: product.title,
        description: product.description,
        redirectUrl: product.redirectUrl,
        mediaPreview: product.imageUrl,
      });
      setEditingId(product._id);
    } else {
      setForm({
        title: '',
        description: '',
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
      description: '',
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
      if (!form.title || !form.description || !form.redirectUrl) {
        return toast.error('Please fill in all fields');
      }
      
      if (!editingId && !form.media) {
        return toast.error('Please select an image');
      }
      
      // Prepare data for API
      let base64Media = '';
      
      if (form.media instanceof File) {
        base64Media = await convertToBase64(form.media);
      }
      
      const payload = {
        title: form.title,
        description: form.description,
        redirectUrl: form.redirectUrl,
        ...(base64Media && { media: base64Media })
      };
      
      if (editingId) {
        // Update existing explore product
        await updateMutation.mutateAsync({ 
          id: editingId, 
          formData: payload
        });
      } else {
        // Create new explore product
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save explore product');
    }
  };
  
  // Delete handler
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this explore product?')) {
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
    return <div className="text-center py-8 text-red-500">Error loading explore products</div>;
  }
  
  // Render main view or edit form
  if (isEditing) {
    // Edit form view
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Explore Products</h1>
        </div>
        
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? 'Edit Explore Product' : 'Add New Explore Product'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="flex gap-8">
              {/* Left column - Form fields */}
              <div className="flex-1">
                <div className="mb-4">
                  <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
                    Image (1:1 ratio recommended)
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="redirectUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Redirect URL
                  </label>
                  <input
                    type="text"
                    id="redirectUrl"
                    name="redirectUrl"
                    value={form.redirectUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="/products/category-name"
                  />
                </div>
              </div>
              
              {/* Right column - Preview */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">Preview</h3>
                <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center">
                  {form.mediaPreview ? (
                    <>
                      <div className="w-40 h-40 overflow-hidden rounded-full border-2 border-gray-200 hover:border-indigo-600 transition-all duration-300">
                        <img
                          src={form.mediaPreview}
                          alt="Preview"
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="mt-4 text-base font-medium text-center hover:text-indigo-600 transition-colors">
                        {form.title || 'Product Title'}
                      </h3>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-400">No image selected</p>
                      </div>
                      <div className="mt-4 h-4 w-20 bg-gray-200"></div>
                    </div>
                  )}
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
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Product'}
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
        <h1 className="text-2xl font-bold">Explore Products</h1>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Explore Products</h2>
          <div className="flex gap-2">
            {exploreProducts.length === 0 && (
              <button
                onClick={createDefaultProducts}
                disabled={isCreatingDefaults}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                Create Default Products
              </button>
            )}
            <button
              onClick={() => handleOpenEditor()}
              className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Add New Product
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Products (drag to reorder)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {exploreProducts.length === 0 ? (
              <p className="py-6 text-center text-gray-500 col-span-full">No explore products found. Add your first one or click "Create Default Products" to automatically add sample products.</p>
            ) : (
              exploreProducts.map((product) => (
                <div key={product._id} className="flex flex-col items-center bg-white p-4 rounded-lg">
                  <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-2 border-gray-200 hover:border-indigo-600 transition-all duration-300">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="mt-4 text-sm md:text-base font-medium text-center">
                    {product.title}
                  </h3>
                  
                  <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                    <span className="font-medium mr-1">URL:</span> 
                    <span className="truncate max-w-[120px]">{product.redirectUrl}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenEditor(product)}
                      className="text-blue-600 p-2 hover:bg-blue-50 rounded-full"
                      aria-label="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
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
      </div>
    </div>
  );
};

export default ExploreProductsPage; 