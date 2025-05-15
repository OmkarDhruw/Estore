import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import axios from 'axios';
import ProductCard from '../product/ProductCard';

interface RecentlyViewedProps {
  currentProductId?: string; // Optional - to exclude current product
  maxItems?: number;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  currentProductId,
  maxItems = 4
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recently viewed products from localStorage and API
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        setIsLoading(true);
        
        // Get recently viewed products from localStorage
        const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        
        // Filter out current product if provided
        const filteredIds = currentProductId 
          ? recentlyViewedIds.filter((id: string) => id !== currentProductId)
          : recentlyViewedIds;
        
        // Limit to maxItems
        const limitedIds = filteredIds.slice(0, maxItems);
        
        if (limitedIds.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch product details for each ID
        const API_URL = 'http://localhost:5000'; // Default API URL
        const promises = limitedIds.map((id: string) => 
          axios.get(`${API_URL}/api/products/${id}`)
            .then(response => {
              const data = response.data as any;
              return data.data as Product;
            })
            .catch(() => null) // Handle if a product can't be found
        );
        
        const results = await Promise.all(promises);
        const validProducts = results.filter(p => p !== null) as Product[];
        
        setProducts(validProducts);
      } catch (error) {
        console.error('Error fetching recently viewed products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentlyViewed();
  }, [currentProductId, maxItems]);
  
  // Don't render anything if no recently viewed products
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="recently-viewed">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed; 