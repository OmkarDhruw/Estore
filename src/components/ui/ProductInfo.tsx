import React from 'react';
import { Star, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductInfoProps {
  title: string;
  price: number;
  oldPrice?: number;
  stockStatus: string;
  tags: string[];
  averageRating: number;
  totalReviews: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  price,
  oldPrice,
  stockStatus,
  tags,
  averageRating,
  totalReviews
}) => {
  const discount = oldPrice && oldPrice > price 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="product-info"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Tags/Labels */}
      {tags && tags.length > 0 && (
        <motion.div variants={item} className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      )}
      
      <motion.h1 variants={item} className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
        {title}
      </motion.h1>
      
      {/* Rating display */}
      <motion.div variants={item} className="flex items-center mt-4">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star 
              key={index}
              size={18}
              className={index < Math.floor(averageRating) 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"}
            />
          ))}
        </div>
        <span className="ml-2 text-sm font-medium text-indigo-600">
          {averageRating.toFixed(1)}
        </span>
        <span className="mx-2 text-gray-300">•</span>
        <a href="#reviews" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </a>
      </motion.div>
      
      {/* Price display */}
      <motion.div variants={item} className="mt-6 flex items-end">
        <p className="text-3xl font-bold text-gray-900">
          ₹{price.toFixed(2)}
        </p>
        {oldPrice && oldPrice > price && (
          <>
            <p className="ml-3 text-xl text-gray-500 line-through">
              ₹{oldPrice.toFixed(2)}
            </p>
            <div className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {discount}% OFF
            </div>
          </>
        )}
      </motion.div>
      
      {/* Stock status */}
      <motion.div variants={item} className="mt-4 flex items-center">
        {stockStatus === 'In Stock' 
          ? <div className="flex items-center text-green-600">
              <Check size={16} className="mr-1" />
              <span className="text-sm font-medium">In Stock</span>
            </div>
          : <div className="flex items-center text-red-600">
              <AlertTriangle size={16} className="mr-1" />
              <span className="text-sm font-medium">Out of Stock - Currently unavailable</span>
            </div>
        }
      </motion.div>
    </motion.div>
  );
};

export default ProductInfo; 