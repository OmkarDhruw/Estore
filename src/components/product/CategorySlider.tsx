import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, Category } from '../../services/category.service';
import { fetchProducts, Product } from '../../services/product.service';

interface CategorySliderProps {
  parentPage?: string;
  onCategorySelect?: (categoryId: string | null) => void;
  selectedCategoryId?: string | null;
}

const CategorySlider: React.FC<CategorySliderProps> = ({ 
  parentPage,
  onCategorySelect,
  selectedCategoryId = null
}) => {
  // Fetch categories
  const { 
    data: categories = [], 
    isLoading,
    isError 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // Filter categories by parentPage if provided
  const filteredCategories = parentPage 
    ? categories.filter(category => category.parentPage === parentPage)
    : categories;

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId === selectedCategoryId ? null : categoryId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to load categories
      </div>
    );
  }

  if (filteredCategories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No categories found
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {/* "All" option */}
        <div 
          className={`flex-shrink-0 cursor-pointer transition-all ${
            selectedCategoryId === null ? 'scale-105 opacity-100' : 'opacity-70 hover:opacity-100'
          }`}
          onClick={() => handleCategoryClick(selectedCategoryId || '')}
        >
          <div className={`rounded-lg overflow-hidden border-2 ${
            selectedCategoryId === null ? 'border-blue-500' : 'border-transparent'
          }`}>
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-medium">All</span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="font-medium">All Categories</span>
          </div>
        </div>
        
        {/* Category cards */}
        {filteredCategories.map(category => (
          <div 
            key={category._id}
            className={`flex-shrink-0 cursor-pointer transition-all ${
              selectedCategoryId === category._id ? 'scale-105 opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
            onClick={() => handleCategoryClick(category._id)}
          >
            <div className={`rounded-lg overflow-hidden border-2 ${
              selectedCategoryId === category._id ? 'border-blue-500' : 'border-transparent'
            }`}>
              <div className="w-32 h-32 bg-gray-200">
                {category.imageUrl && (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="font-medium">{category.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider; 