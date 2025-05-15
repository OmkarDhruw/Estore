import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from './CategoryCard';
import { Category } from '../../types';

// Add modern scrollbar and styling
const customScrollbarCSS = `
  .category-slider-section {
    width: 100%;
    position: relative;
    background-color: #f5f7fa;
    padding: 1.5rem 0;
    margin: 0;
    overflow: hidden;
  }
  
  .category-slider-container {
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0 auto;
  }
  
  .modern-scrollbar {
    overflow-x: auto;
    padding: 1rem 0;
    margin: 0 72px; /* Make space for the arrow buttons */
    width: calc(100% - 144px); /* Adjust width to account for the side margins */
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
    cursor: grab;
  }
  
  .modern-scrollbar:active {
    cursor: grabbing;
  }
  
  .modern-scrollbar::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .modern-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(155, 155, 155, 0.8);
  }
  
  .arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(240, 240, 255, 0.9);
    border: 2px solid rgba(100, 100, 255, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .arrow-button:hover {
    background-color: rgba(230, 230, 255, 1);
    transform: translateY(-50%) scale(1.05);
  }
  
  .left-arrow {
    left: 0;
  }
  
  .right-arrow {
    right: 0;
  }
  
  .category-card-container {
    display: flex;
    flex: none;
    aspect-ratio: 1/1;
    cursor: pointer;
    border-radius: 50%;
    background-color: #f3f4f6;
    transition: transform 0.3s ease;
    margin: 0 10px;
  }
  
  .category-card-container:hover {
    transform: scale(1.05);
  }
  
  /* Make sure first and last items are fully visible */
  .category-card-wrapper {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Center categories when there are 5 or fewer */
  .centered-few-categories {
    justify-content: center !important;
    margin: 0 auto;
  }
  
  /* Extra space between items when few categories */
  .wide-spacing {
    margin: 0 20px;
  }
  
  @media (max-width: 768px) {
    .modern-scrollbar {
      margin: 0 50px;
      width: calc(100% - 100px);
    }
    
    .arrow-button {
      width: 45px;
      height: 45px;
    }
    
    .wide-spacing {
      margin: 0 15px;
    }
  }
`;

interface CategorySliderProps {
  categories: Category[];
  title?: string;
  cardSize?: 'sm' | 'md' | 'lg' | number;
  showArrows?: boolean;
  onCategoryClick?: (category: Category) => void;
}

const CategorySlider: React.FC<CategorySliderProps> = ({ 
  categories, 
  title, 
  cardSize = 'md', 
  showArrows = true, 
  onCategoryClick 
}) => {
  const sizeClass = typeof cardSize === 'number'
    ? `w-[${cardSize}px] h-[${cardSize}px]`
    : cardSize === 'sm'
      ? 'w-16 h-16'
      : cardSize === 'lg'
        ? 'w-28 h-28 md:w-30 md:h-30'
        : 'w-20 h-20 md:w-24 md:h-24';
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const hasFewCategories = categories.length <= 5;
  
  // Check if we need to show navigation arrows
  useEffect(() => {
    // Always show arrows if explicitly enabled, but respect the prop
    setShowNavigation(showArrows);
    
    // Check if container is scrollable
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };
    
    checkScrollable();
    
    // Re-check on window resize
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [categories.length, showArrows]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      
      // Calculate card width including margin
      const containerWidth = clientWidth;
      const cardWidth = containerWidth / 5; // Aim for 5 cards visible at once
      
      const scrollTo = direction === 'left' 
        ? scrollLeft - cardWidth * 3 // Scroll 3 cards at a time
        : scrollLeft + cardWidth * 3;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };
  
  // Mouse event handlers for drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
      scrollContainerRef.current.style.cursor = 'grabbing';
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      <style>{customScrollbarCSS}</style>
      
      <section className="category-slider-section w-full">
        <div className="category-slider-container max-w-screen-2xl mx-auto px-4">
          {title && (
            <h2 className="text-xl font-bold mb-6 text-center">{title}</h2>
          )}
          
          <div className="relative">
            <div className="category-card-wrapper">
              {showNavigation && isScrollable && !hasFewCategories && (
                <button
                  onClick={() => scroll('left')}
                  className="arrow-button left-arrow"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-7 w-7" strokeWidth={2.5} />
                </button>
              )}
              
              <div
                ref={scrollContainerRef}
                className={`modern-scrollbar flex items-center ${hasFewCategories ? 'centered-few-categories' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={hasFewCategories ? { justifyContent: 'center', margin: '0 auto' } : {}}
              >
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className={`category-card-container ${sizeClass} ${hasFewCategories ? 'wide-spacing' : ''}`}
                  >
                    <CategoryCard category={category} onClick={onCategoryClick ? () => onCategoryClick(category) : undefined} />
                  </div>
                ))}
              </div>
              
              {showNavigation && isScrollable && !hasFewCategories && (
                <button
                  onClick={() => scroll('right')}
                  className="arrow-button right-arrow"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-7 w-7" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategorySlider; 