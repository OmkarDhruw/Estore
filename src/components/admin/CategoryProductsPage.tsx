import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PlusCircle, Pencil, Trash2, ChevronDown, ChevronUp, AlertCircle, Upload, X, ImageIcon, ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchCategories, 
  createCategory,
  updateCategory, 
  deleteCategory,
  Category,
  CategoryForm
} from '../../services/category.service';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductForm
} from '../../services/product.service';
import ProductEditor from './ProductEditor';

// Base64 converter for media
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const CategoryProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State for categories
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: '',
    slug: '',
    parentPage: '',
  });
  
  // State for products
  const [isProductEditing, setIsProductEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    title: '',
    description: '',
    price: 0,
    oldPrice: undefined,
    categoryId: '',
    parentPage: '',
    slug: '',
  });
  
  // State for expanded categories
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Fetch data
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading, 
    isError: isCategoriesError 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  const { 
    data: products = [], 
    isLoading: isProductsLoading, 
    isError: isProductsError 
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts()
  });
  
  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['categories']});
      toast.success('Category created successfully');
      handleCloseCategoryEditor();
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });
  
  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['categories']});
      toast.success('Category updated successfully');
      handleCloseCategoryEditor();
    },
    onError: () => {
      toast.error('Failed to update category');
    },
  });
  
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['categories']});
      queryClient.invalidateQueries({queryKey: ['products']});
      toast.success('Category and associated products deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete category');
    },
  });
  
  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']});
      toast.success('Product created successfully');
      handleCloseProductEditor();
    },
    onError: () => {
      toast.error('Failed to create product');
    },
  });
  
  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']});
      toast.success('Product updated successfully');
      handleCloseProductEditor();
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']});
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  // Category editor handlers
  const handleOpenCategoryEditor = (category?: Category) => {
    if (category) {
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        parentPage: category.parentPage,
        mediaPreview: category.imageUrl,
      });
      setEditingCategoryId(category._id);
    } else {
      setCategoryForm({
        name: '',
        slug: '',
        parentPage: '',
      });
      setEditingCategoryId(null);
    }
    setIsCategoryEditing(true);
  };

  const handleCloseCategoryEditor = () => {
    setIsCategoryEditing(false);
    setEditingCategoryId(null);
    setCategoryForm({
      name: '',
      slug: '',
      parentPage: '',
    });
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCategoryForm({
      ...categoryForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setCategoryForm({
          ...categoryForm,
          media: base64,
          mediaPreview: URL.createObjectURL(file),
        });
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast.error('Error processing image');
      }
    }
  };

  // Generate slug automatically when name changes
  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    setCategoryForm({
      ...categoryForm,
      name,
      slug, // Keep generating the slug but don't show it in the UI
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name || !categoryForm.parentPage || !categoryForm.slug) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!editingCategoryId && !categoryForm.media) {
      toast.error('Please upload an image');
      return;
    }
    
    if (editingCategoryId) {
      // Update existing category
      updateCategoryMutation.mutate({
        id: editingCategoryId,
        formData: categoryForm,
      });
    } else {
      // Create new category
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all related products and images.')) {
      return;
    }
    
    deleteCategoryMutation.mutate(id);
  };

  // Product editor handlers
  const handleOpenProductEditor = (product?: Product, categoryId?: string) => {
    if (product) {
      setEditingProductId(product._id);
    } else {
      setEditingProductId(null);
    }
    setIsProductEditing(true);
  };

  const handleCloseProductEditor = () => {
    setIsProductEditing(false);
    setEditingProductId(null);
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setProductForm({
        ...productForm,
        [name]: value === '' ? undefined : Number(value),
      });
    } else {
      setProductForm({
        ...productForm,
        [name]: value,
      });
    }
  };

  // Generate slug automatically when title changes
  const handleProductTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    setProductForm({
      ...productForm,
      title,
      slug,
    });
  };

  const handleProductFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setProductForm({
          ...productForm,
          media: base64,
          mediaPreview: URL.createObjectURL(file),
        });
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast.error('Error processing image');
      }
    }
  };

  const handleProductSubmit = (productData: ProductForm) => {
    if (editingProductId) {
      // Update existing product
      updateProductMutation.mutate({
        id: editingProductId,
        formData: productData,
      });
    } else {
      // Create new product
      createProductMutation.mutate(productData);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    deleteProductMutation.mutate(id);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  // Get products by category
  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => 
      typeof product.categoryId === 'string' 
        ? product.categoryId === categoryId 
        : (product.categoryId as Category)._id === categoryId
    );
  };

  // Render loading state
  if (isCategoriesLoading || isProductsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (isCategoriesError || isProductsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg">Error loading data. Please try again.</p>
        </div>
      </div>
    );
  }

  // Render category editor
  const renderCategoryEditor = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {editingCategoryId ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button
              onClick={handleCloseCategoryEditor}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleCategorySubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name*
              </label>
              <input
                type="text"
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryNameChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Page*
              </label>
              <select
                name="parentPage"
                value={categoryForm.parentPage}
                onChange={handleCategoryInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Parent Page</option>
                <option value="explore-skins">Explore Skins</option>
                <option value="explore-clothing">Explore Clothing</option>
                <option value="explore-products">Explore Products</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Image*
                {!editingCategoryId && <span className="text-red-500"> (Required)</span>}
                {editingCategoryId && <span className="text-gray-500"> (Optional - Leave empty to keep current image)</span>}
              </label>
              
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('categoryImageInput')?.click()}>
                {categoryForm.mediaPreview ? (
                  <div className="relative w-full">
                    <img
                      src={categoryForm.mediaPreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryForm({
                          ...categoryForm,
                          media: undefined,
                          mediaPreview: undefined,
                        });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click or drag to upload an image</p>
                  </div>
                )}
                <input
                  id="categoryImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryFileChange}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCloseCategoryEditor}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending || updateCategoryMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Category & Products Management</h1>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <button
            onClick={() => handleOpenCategoryEditor()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Category
          </button>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg mb-4">No categories found</p>
            <button
              onClick={() => handleOpenCategoryEditor()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Your First Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expand
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Page
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => {
                  const categoryProducts = getProductsByCategory(category._id);
                  const isExpanded = expandedCategory === category._id;
                  
                  return (
                    <React.Fragment key={category._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => toggleCategoryExpansion(category._id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.imageUrl ? (
                            <img 
                              src={category.imageUrl} 
                              alt={category.name} 
                              className="h-12 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{category.parentPage}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{categoryProducts.length}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenCategoryEditor(category)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="mb-4 flex justify-between items-center">
                              <h3 className="text-lg font-medium">Products in {category.name}</h3>
                              <button
                                onClick={() => handleOpenProductEditor(undefined, category._id)}
                                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                <PlusCircle className="mr-1 h-4 w-4" />
                                Add Product
                              </button>
                            </div>
                            
                            {categoryProducts.length === 0 ? (
                              <div className="text-center py-8 bg-white rounded-md border border-gray-200">
                                <ShoppingBag className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-500">No products in this category</p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Old Price
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {categoryProducts.map(product => (
                                      <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap flex items-center space-x-3">
                                          {product.imageUrl || (product.images && product.images.length > 0) ? (
                                            <img 
                                              src={product.imageUrl || product.images[0]} 
                                              alt={product.title} 
                                              className="h-10 w-10 object-cover rounded"
                                            />
                                          ) : (
                                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                              <ImageIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                          )}
                                          <span className="text-sm font-medium text-gray-900">{product.title}</span>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {product.oldPrice ? `$${product.oldPrice.toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                          <div className="flex space-x-2">
                                            <a
                                              href={`/product/${product.slug}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-green-600 hover:text-green-900"
                                              title="View Product Details"
                                            >
                                              <Eye className="h-4 w-4" />
                                            </a>
                                            <button
                                              onClick={() => handleOpenProductEditor(product)}
                                              className="text-blue-600 hover:text-blue-900"
                                              title="Edit Product"
                                            >
                                              <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteProduct(product._id)}
                                              className="text-red-600 hover:text-red-900"
                                              title="Delete Product"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Category editor modal */}
      {isCategoryEditing && renderCategoryEditor()}
      
      {/* Product editor modal */}
      {isProductEditing && (
        <ProductEditor
          product={editingProductId ? products.find(p => p._id === editingProductId) : undefined}
          categories={categories}
          categoryId={expandedCategory || undefined}
          onClose={handleCloseProductEditor}
          onSubmit={handleProductSubmit}
          isSubmitting={createProductMutation.isPending || updateProductMutation.isPending}
        />
      )}
    </div>
  );
};

export default CategoryProductsPage; 