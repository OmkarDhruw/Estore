import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Featured Collection type definition
interface FeaturedCollection {
  _id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  redirectUrl: string;
  imageUrl: string;
  createdAt: string;
}

// API response type
interface ApiResponse {
  success: boolean;
  data: FeaturedCollection[];
  count: number;
}

const FeaturedCollectionsSection: React.FC = () => {
  const [collections, setCollections] = useState<FeaturedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse>('http://localhost:5000/api/featured-collections');
        
        if (response.data.success) {
          setCollections(response.data.data);
        } else {
          setError('Failed to fetch collections');
        }
      } catch (err) {
        console.error('Error fetching featured collections:', err);
        setError('An error occurred while fetching collections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // If there are no collections, don't render the section
  if (!isLoading && collections.length === 0) {
    return null;
  }

  return (
    <section id="featured-products" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Featured Collections</h2>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-700"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.slice(0, 2).map((collection) => (
              <div 
                key={collection._id} 
                className="relative overflow-hidden rounded-lg shadow-lg aspect-video md:aspect-[16/9]"
              >
                <img 
                  src={collection.imageUrl} 
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-transparent flex items-center">
                  <div className="p-6 text-white max-w-xs">
                    <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                    
                    {collection.subtitle && (
                      <p className="mb-4">{collection.subtitle}</p>
                    )}
                    
                    <Link 
                      to={collection.redirectUrl}
                      className="bg-white text-purple-700 hover:bg-purple-700 hover:text-white transition-colors px-4 py-2 rounded-md shadow-md inline-block"
                    >
                      {collection.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollectionsSection; 