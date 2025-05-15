import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <Link 
      to={`/products/${category.slug}`}
      className="group relative rounded-full overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow aspect-square"
      onClick={handleClick}
    >
      <div className="w-full h-full overflow-hidden rounded-full">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
          <h3 className="text-white text-center font-bold text-lg px-4">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 