import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">Explore Products</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10">
          {categories.map((category) => {
            let imageSrc = category.image;
            if (category.slug === 'explore-clothing') {
              imageSrc = '/image/hero page front image/Explore Clothing.jpg';
            } else if (category.slug === 'mens-collection') {
              imageSrc = '/image/men/Men\'s Collection (2).jpeg';
            } else if (category.slug === 'womens-collection') {
              imageSrc = '/image/women/dummy women cloth (1).jpeg';
            } else if (category.slug === 'explore-skins') {
              imageSrc = '/image/Skins Collection/SUPERHERO.jpg.jpeg';
            } else if (category.slug === 'mobile-skins') {
              imageSrc = '/image/Skins Collection/mobile-skins.webp_6.jpeg';
            } else if (category.slug === 'laptop-skins') {
              imageSrc = '/image/laptop skins/Collection Laptop Skins  (1).jpeg';
            }
            return (
              <Link 
                key={category.id} 
                to={`/products/${category.slug}`}
                className="group flex flex-col items-center"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 overflow-hidden rounded-full border-2 border-gray-200 group-hover:border-indigo-600 transition-all duration-300">
                  <img 
                    src={imageSrc} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="mt-4 text-sm md:text-base font-medium text-center group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;