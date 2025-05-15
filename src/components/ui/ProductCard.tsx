import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickAddOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedModel) {
      alert('Please select a device model');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      deviceModel: selectedModel
    });

    setIsQuickAddOpen(false);
    setSelectedModel('');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickAddOpen(false);
  };

  return (
    <div className="group relative">
      {product.isOnSale && (
        <div className="absolute left-0 top-0 z-10 bg-red-500 px-2 py-1 text-sm font-semibold text-white">
          SALE
        </div>
      )}
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <button 
            onClick={handleQuickAdd}
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <div className="mt-1 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
          <div className="mt-2 flex items-center">
            <p className="text-sm font-medium text-gray-900">
              ₹{product.price.toLocaleString()}
            </p>
            {product.isOnSale && (
              <p className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div 
          className="absolute inset-0 bg-white shadow-lg rounded-lg p-4 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm">Quick Add</h3>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-1 px-2 text-sm mb-3 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">Select device model</option>
            {product.compatibility.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm hover:bg-indigo-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 