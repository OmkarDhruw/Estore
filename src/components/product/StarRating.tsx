import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5 }) => {
  return (
    <div className="flex">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        
        // Full star
        if (starValue <= Math.floor(rating)) {
          return (
            <Star
              key={index}
              size={14}
              className="text-yellow-400 fill-current"
            />
          );
        }
        
        // Half star
        if (starValue <= Math.floor(rating) + 0.5 && starValue > Math.floor(rating)) {
          return (
            <div key={index} className="relative">
              <Star
                size={14}
                className="text-gray-300"
              />
              <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                <Star
                  size={14}
                  className="text-yellow-400 fill-current"
                />
              </div>
            </div>
          );
        }
        
        // Empty star
        return (
          <Star
            key={index}
            size={14}
            className="text-gray-300"
          />
        );
      })}
    </div>
  );
};

export default StarRating;