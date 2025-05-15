import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import Banner from '../components/ui/Banner';
import ProductCard from '../components/product/ProductCard';
import CategorySlider from '../components/product/CategorySlider';
import { getCategoryBySlug } from '../data/categories';
import { fetchProducts } from '../services/product.service';
import { Product as TypesProduct } from '../types';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Determine the parent page from the URL slug
  const parentPage = slug || 'explore-products';
  
  // Fetch all products
  const { 
    data: products = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['products', parentPage],
    queryFn: () => fetchProducts()
  });

  // Filter and Sort products
  const processedProducts = React.useMemo(() => {
    // First filter by parent page and selected category
    let filtered = products.filter(product => {
      // Filter by parent page
      if (product.parentPage !== parentPage) {
        return false;
      }
      
      // Filter by category if one is selected
      if (selectedCategoryId) {
        const categoryId = typeof product.categoryId === 'string' 
          ? product.categoryId 
          : (product.categoryId as any)._id;
        
        if (categoryId !== selectedCategoryId) return false;
      }
      
      return true;
    });
    
    // Then sort the filtered products
    return filtered.sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Default 'featured' sorting
      return 0;
    });
  }, [products, parentPage, selectedCategoryId, sortBy]);
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  // Format the title from the slug
  const formatTitle = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Convert service.Product to types.Product
  const convertToTypesProduct = (product: any): TypesProduct => {
    return {
      ...product,
      categoryId: typeof product.categoryId === 'string' 
        ? { _id: product.categoryId, name: '', imageUrl: '' } 
        : product.categoryId
    };
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600">Loading amazing products for you...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-600">Error loading products</h2>
          <p className="text-red-500 mt-2">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {(slug || parentPage !== 'explore-products') && (
        <Banner
          title={formatTitle(parentPage)}
          subtitle={slug ? 'Explore our collection of premium products' : 'Browse our curated collection'}
          backgroundImage={slug ? getCategoryBySlug(slug)?.image : undefined}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Skin Collections */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mobile Skin Collections</h2>
          <CategorySlider
            parentPage={parentPage} 
            onCategorySelect={handleCategorySelect} 
            selectedCategoryId={selectedCategoryId} 
          />
        </div>
        
        {/* Product Listing Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-600">
              {processedProducts.length} {processedProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          {/* Sort dropdown */}
          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1 bg-white border border-gray-300 rounded-md text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {processedProducts.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-64 bg-white p-8 rounded-lg"
            >
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-500">No products found</h2>
              <p className="text-gray-400 mt-2 text-center max-w-md">Try selecting a different category</p>
            </motion.div>
          ) : (
            <motion.div 
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {processedProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={convertToTypesProduct(product)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductsPage; 