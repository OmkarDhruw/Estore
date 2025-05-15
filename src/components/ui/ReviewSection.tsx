import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface ReviewSectionProps {
  reviews: Review[];
  ratingCounts: Record<number, number>;
  totalReviews: number;
  averageRating: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  reviews, 
  ratingCounts, 
  totalReviews, 
  averageRating 
}) => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rating Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star 
                  key={index}
                  size={20}
                  className={index < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">{totalReviews} reviews</p>
          
          {/* Rating Bars */}
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center mb-2">
              <span className="text-sm text-gray-600 w-8">{rating} ★</span>
              <div className="flex-1 h-2 mx-2 bg-gray-200 rounded">
                <div 
                  className="h-2 bg-indigo-600 rounded"
                  style={{ 
                    width: `${((ratingCounts[rating] || 0) / totalReviews) * 100}%` 
                  }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{ratingCounts[rating] || 0}</span>
            </div>
          ))}
          
          <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">
            Write a review
          </button>
        </div>
        
        {/* Reviews List */}
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="font-medium">Most Recent</h3>
            <select className="text-sm border rounded px-2 py-1">
              <option>Most Recent</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
          </div>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star 
                        key={index}
                        size={16}
                        className={index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {review.userName.charAt(0)}
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">{review.userName}</p>
                    {review.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Verified</span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
                
                {review.images && review.images.length > 0 && (
                  <div className="mt-2 flex space-x-2">
                    {review.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`Review ${index}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection; 