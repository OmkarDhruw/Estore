import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import StarRating from './StarRating';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product._id);

  // Calculate dynamic discount percentage
  const discountPercentage = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Calculate average rating if needed
  const averageRating = product.reviews && product.reviews.length > 0 ? 4.5 : 0;
  const reviewCount = product.reviews ? product.reviews.length : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  // Get the first image URL only
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/fallback.jpg';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Make entire card clickable */}
      <Link to={`/product/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.title}></Link>
      
      {/* Outer container for the entire card with border */}
      <div className="border border-transparent rounded-lg overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-200">
        {/* Product Image with hover effect */}
        <div className="block relative aspect-[9/16] overflow-hidden bg-gray-100">
          <motion.img 
            src={imageUrl} 
            alt={product.title || "Product image"}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            onError={e => { (e.target as HTMLImageElement).src = '/fallback.jpg'; }}
            onLoad={() => setIsLoaded(true)}
          />
          
          {/* Overlay effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Product Info with hover effect */}
        <motion.div 
          className="p-4 bg-white text-center"
          initial={{ y: 0 }}
          animate={{ y: isHovered ? -5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Title */}
          <h3 className="text-base md:text-lg font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-300">
            {product.title}
          </h3>
          
          {/* Ratings */}
          <div className="flex items-center justify-center mt-2 transition-opacity duration-300 group-hover:opacity-80">
            <div className="flex items-center">
              <div className="scale-110">
                <StarRating rating={averageRating} />
              </div>
              <span className="text-sm text-gray-500 ml-1">
                {reviewCount > 0 ? `(${reviewCount})` : ""}
              </span>
            </div>
          </div>
          
          {/* Price with larger styling */}
          <div className="flex items-center justify-center mt-2 flex-wrap">
            {product.oldPrice && product.oldPrice > product.price ? (
              <>
                <div className="w-full flex justify-center items-center">
                  <span className="text-gray-500 line-through text-sm mr-2">Rs. {product.oldPrice.toFixed(0)}</span>
                </div>
                <span className="text-xl font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">
                  Rs. {product.price.toFixed(0)}
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">
                Rs. {product.price.toFixed(0)}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCard;