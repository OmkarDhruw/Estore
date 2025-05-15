import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface RelatedProductsProps {
  products: Product[];
  isLoading: boolean;
  error: unknown;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  isLoading,
  error
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading related products...</div>;
  }
  
  if (error) {
    return null; // Don't show an error message for related products, just hide the section
  }
  
  if (products.length === 0) {
    return null; // Hide section if there are no related products
  }
  
  return (
    <div className="related-products">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link 
            key={product._id} 
            to={`/product/${product.slug}`}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </span>
              )}
            </div>
            
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                {product.title}
              </h3>
              
              <div className="mt-1 flex items-end">
                <p className="text-sm font-medium text-gray-900">
                  ₹{product.price.toFixed(2)}
                </p>
                {product.oldPrice && product.oldPrice > product.price && (
                  <p className="ml-2 text-xs text-gray-500 line-through">
                    ₹{product.oldPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 