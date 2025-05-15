import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { Product, ProductForm } from '../../services/product.service';
import { Category } from '../../services/category.service';
import toast from 'react-hot-toast';

interface ProductEditorProps {
  product?: Product;
  categories: Category[];
  categoryId?: string;
  onClose: () => void;
  onSubmit: (productData: ProductForm) => void;
  isSubmitting: boolean;
}

// Base64 converter for media
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ProductEditor: React.FC<ProductEditorProps> = ({
  product,
  categories,
  categoryId,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const [form, setForm] = useState<ProductForm>({
    title: '',
    description: '',
    price: 0,
    oldPrice: undefined,
    categoryId: categoryId || '',
    parentPage: '',
    slug: '',
    mediaFiles: [],
    mediaPreview: [],
    tags: [],
    stockStatus: 'In Stock',
    isActive: true,
    variantType: 'mobileModel',
    variantOptions: [],
  });
  
  const [tag, setTag] = useState('');
  const [variantOption, setVariantOption] = useState('');
  
  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        description: product.description,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
        categoryId: typeof product.categoryId === 'string' ? product.categoryId : (product.categoryId as Category)._id,
        parentPage: product.parentPage,
        slug: product.slug,
        mediaPreview: product.images || (product.imageUrl ? [product.imageUrl] : []),
        tags: product.tags || [],
        stockStatus: product.stockStatus || 'In Stock',
        isActive: product.isActive !== undefined ? product.isActive : true,
        variantType: product.variants?.type || 'mobileModel',
        variantOptions: product.variants?.options || [],
      });
    } else if (categoryId) {
      // If adding a new product within a category, set the parent page
      const category = categories.find(c => c._id === categoryId);
      if (category) {
        setForm(prev => ({
          ...prev,
          categoryId,
          parentPage: category.parentPage || '',
        }));
      }
    }
  }, [product, categoryId, categories]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        [name]: isChecked,
      }));
      return;
    }
    
    // Handle number inputs
    if (type === 'number') {
      setForm(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // When category changes, update the parent page
    if (name === 'categoryId') {
      const category = categories.find(c => c._id === value);
      if (category) {
        setForm(prev => ({
          ...prev,
          parentPage: category.parentPage || '',
        }));
      }
    }
  };
  
  // Generate slug automatically when title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    setForm(prev => ({
      ...prev,
      title,
      slug,
    }));
  };
  
  // Handle single file uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const files = Array.from(e.target.files);
        const base64Promises = files.map(convertToBase64);
        const base64Results = await Promise.all(base64Promises);
        
        // Create object URLs for preview
        const previews = files.map(file => URL.createObjectURL(file));
        
        setForm(prev => ({
          ...prev,
          mediaFiles: [...(prev.mediaFiles || []), ...base64Results],
          mediaPreview: [...(prev.mediaPreview as string[] || []), ...previews],
        }));
      } catch (error) {
        console.error('Error converting files to base64:', error);
        toast.error('Error processing images');
      }
    }
  };
  
  // Remove a media file
  const removeMedia = (index: number) => {
    setForm(prev => {
      const newMediaFiles = [...(prev.mediaFiles || [])];
      const newMediaPreview = [...(prev.mediaPreview as string[] || [])];
      
      newMediaFiles.splice(index, 1);
      newMediaPreview.splice(index, 1);
      
      return {
        ...prev,
        mediaFiles: newMediaFiles,
        mediaPreview: newMediaPreview,
      };
    });
  };
  
  // Add a tag
  const addTag = () => {
    if (tag && !form.tags?.includes(tag)) {
      setForm(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTag('');
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tagToRemove) || [],
    }));
  };
  
  // Add a variant option
  const addVariantOption = () => {
    if (variantOption && !form.variantOptions?.includes(variantOption)) {
      setForm(prev => ({
        ...prev,
        variantOptions: [...(prev.variantOptions || []), variantOption],
      }));
      setVariantOption('');
    }
  };
  
  // Remove a variant option
  const removeVariantOption = (optionToRemove: string) => {
    setForm(prev => ({
      ...prev,
      variantOptions: prev.variantOptions?.filter(o => o !== optionToRemove) || [],
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || form.price === undefined || !form.categoryId || !form.parentPage) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!product && (!form.mediaFiles || form.mediaFiles.length === 0)) {
      toast.error('Please upload at least one image');
      return;
    }
    
    // Always ensure there's at least one variant option (Default)
    let updatedForm = {...form};
    if (!updatedForm.variantOptions || updatedForm.variantOptions.length === 0) {
      updatedForm.variantOptions = ['Default'];
    }
    
    // Make sure we have a slug
    if (!updatedForm.slug) {
      updatedForm.slug = updatedForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    
    onSubmit(updatedForm);
  };
  
  // Common styling
  const inputClass = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className={labelClass}>
                  Product Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleTitleChange}
                  className={inputClass}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL slug will be auto-generated from title: /product/{form.slug || 'example-product'}
                </p>
              </div>
              
              {/* Description */}
              <div>
                <label className={labelClass}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={inputClass}
                />
              </div>
              
              {/* Price fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Price*
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Old Price
                  </label>
                  <input
                    type="number"
                    name="oldPrice"
                    value={form.oldPrice || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={inputClass}
                  />
                </div>
              </div>
              
              {/* Category and Parent Page */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Category*
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Parent Page
                  </label>
                  <input
                    type="text"
                    name="parentPage"
                    value={form.parentPage}
                    className={inputClass}
                    disabled
                  />
                </div>
              </div>
              
              {/* Stock Status and Active Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Stock Status
                  </label>
                  <select
                    name="stockStatus"
                    value={form.stockStatus}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={form.isActive}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, isActive: e.target.checked }));
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Product is active and visible to customers
                  </label>
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-4">
              {/* Product Images */}
              <div>
                <label className={labelClass}>
                  Product Images*
                  {!product && <span className="text-red-500"> (Required)</span>}
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                  {/* Image preview section */}
                  {form.mediaPreview && (form.mediaPreview as string[]).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                      {(form.mediaPreview as string[]).map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  
                  {/* Upload button */}
                  <div 
                    className="flex items-center justify-center border border-gray-300 rounded-md p-4 hover:bg-gray-50"
                    onClick={() => document.getElementById('productImagesInput')?.click()}
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Click to add more images</p>
                    </div>
                  </div>
                  <input
                    id="productImagesInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                </div>
              </div>
              
              {/* Tags/Labels */}
              <div>
                <label className={labelClass}>
                  Tags/Labels
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className={inputClass}
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {form.tags && form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag, index) => (
                      <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Variant Type and Options */}
              <div>
                <label className={labelClass}>
                  Variant Type*
                </label>
                <select
                  name="variantType"
                  value={form.variantType}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                >
                  <option value="mobileModel">Mobile Model</option>
                  <option value="clothingSize">Clothing Size</option>
                </select>
                
                {/* Hidden input to automatically add "Default" as a variant option */}
                <input 
                  type="hidden" 
                  name="defaultVariant" 
                  value="Default" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditor; 