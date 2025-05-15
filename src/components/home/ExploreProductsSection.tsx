import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define types for the API response
interface ExploreProduct {
  _id: string;
  title: string;
  description: string;
  redirectUrl: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  createdAt: string;
  updatedAt: string;
}

interface ExploreProductApiResponse {
  success: boolean;
  count: number;
  data: ExploreProduct[];
}

const ExploreProductsSection: React.FC = () => {
  const [exploreProducts, setExploreProducts] = useState<ExploreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExploreProducts = async () => {
      try {
        setIsLoading(true);
        // Use environment variable with fallback
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get<ExploreProductApiResponse>(`${apiUrl}/api/explore-products`);
        
        if (response.data.success) {
          setExploreProducts(response.data.data);
        } else {
          setError('Failed to fetch explore products');
        }
      } catch (error) {
        console.error('Error fetching explore products:', error);
        setError('Failed to fetch explore products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExploreProducts();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">Explore Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="mt-4 h-4 w-20 bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">Explore Products</h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // Show empty state
  if (exploreProducts.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">Explore Products</h2>
          <p className="text-center text-gray-500">No explore products found.</p>
        </div>
      </section>
    );
  }

  // Show explore products
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">Explore Products</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10">
          {exploreProducts.map((product) => (
            <Link 
              key={product._id} 
              to={product.redirectUrl}
              className="group flex flex-col items-center"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 overflow-hidden rounded-full border-2 border-gray-200 group-hover:border-indigo-600 transition-all duration-300">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="mt-4 text-sm md:text-base font-medium text-center group-hover:text-indigo-600 transition-colors">
                {product.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreProductsSection; 