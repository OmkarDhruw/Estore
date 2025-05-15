import React, { useState, useEffect } from 'react';
import { Star, X, Check, ThumbsUp, Calendar, User, Camera, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { Review, ReviewStats } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerReviewsProps {
  productId: string;
  reviews: Review[];
  stats?: ReviewStats;
  isLoading: boolean;
  error: unknown;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  productId,
  reviews,
  stats,
  isLoading,
  error
}) => {
  // State for the review modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for filtering reviews
  const [sortOption, setSortOption] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');
  // State for expanded reviews
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  // State for helpful reviews - simulating user interaction
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});
  // State to track if user is logged in (for future implementation)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to track if user has purchased this product (for future implementation)
  const [hasPurchased, setHasPurchased] = useState(false);
  // State to track user's existing review (for future implementation)
  const [userReview, setUserReview] = useState<Review | null>(null);
  
  // Safely typed ratingCounts
  const typedRatingCounts: Record<string, number> = stats?.ratingCounts || {};
  
  // Mocked function for login prompt - to be replaced with real implementation later
  const promptLogin = () => {
    alert("This feature will require login in the future. Currently in demo mode.");
    setIsModalOpen(true); // For demo, we still open the modal
  };
  
  // Toggle helpful state for a review
  const toggleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };
  
  // Toggle expanded state for a review
  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };
  
  // Calculate if a review text is long and needs to be truncated
  const isReviewLong = (text: string) => text.length > 250;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-indigo-600 font-medium">Loading reviews...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md text-center my-8">
        <p className="font-medium">Unable to load reviews</p>
        <p className="text-sm mt-1">Please try again later</p>
      </div>
    );
  }
  
  const averageRating = stats?.averageRating || 0;
  const totalReviews = stats?.totalReviews || 0;
  
  // Helper to render rating stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star 
            key={index}
            size={16}
            className={index < Math.floor(rating) 
              ? "text-yellow-400 fill-yellow-400" 
              : "text-gray-300"}
          />
        ))}
      </div>
    );
  };
  
  // Calculate percentage for the rating distribution bar
  const getRatingPercentage = (rating: number) => {
    if (totalReviews === 0) return 0;
    const ratingKey = rating.toString();
    const count = typedRatingCounts[ratingKey] || 0;
    return (count / totalReviews) * 100;
  };
  
  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'helpful':
        // Placeholder for helpful sorting - would need backend implementation
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });
  
  return (
    <div className="customer-reviews">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
      
      {/* Reviews summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Rating overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-2">out of 5</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex mb-1">
                {renderStars(averageRating)}
              </div>
              <p className="text-sm text-gray-500">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
          
          {/* Rating distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <div className="w-10 text-sm text-gray-600 font-medium">{rating} ★</div>
                <div className="w-full mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-yellow-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  ></div>
                </div>
                <div className="w-10 text-xs text-gray-500 text-right">
                  {typedRatingCounts[rating.toString()] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* User review section (would be updated based on login status) */}
        <div className="md:col-span-2 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Share your experience</h3>
            {userReview && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">You've reviewed this product</span>}
          </div>
          
          {userReview ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {renderStars(userReview.rating)}
                  <span className="ml-2 text-sm text-gray-600">{userReview.rating.toFixed(1)}</span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-indigo-600 text-sm hover:text-indigo-800 transition-colors"
                >
                  Edit Review
                </button>
              </div>
              <p className="text-gray-700 text-sm">{userReview.comment}</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Your honest feedback helps other shoppers make better decisions and helps us improve our products.
              </p>
              <button
                onClick={isLoggedIn ? () => setIsModalOpen(true) : promptLogin}
                className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <MessageSquare size={18} className="mr-2" />
                {isLoggedIn ? 'Write a Review' : 'Sign in to Review'}
              </button>
              {!isLoggedIn && (
                <p className="mt-2 text-xs text-gray-500">
                  * In the future, only logged-in users who have purchased this product will be able to review it.
                </p>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Review list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">{totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}</h3>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>
        
        {sortedReviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
            <p className="text-gray-500 max-w-md mx-auto">
              Be the first to share your thoughts about this product with the community.
            </p>
            <button
              onClick={isLoggedIn ? () => setIsModalOpen(true) : promptLogin}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Write a Review
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedReviews.map((review) => {
              const isExpanded = expandedReviews[review._id] || false;
              const isHelpful = helpfulReviews[review._id] || false;
              const needsExpansion = isReviewLong(review.comment);
              
              return (
                <div key={review._id} className="p-6 transition-colors hover:bg-gray-50">
                  <div className="flex flex-wrap items-start justify-between mb-3">
                    <div className="flex items-center mb-2 md:mb-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold mr-3">
                        {review.reviewerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{review.reviewerName}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm font-medium text-gray-700">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {needsExpansion ? (
                      <>
                        <p className="text-gray-700">
                          {isExpanded ? review.comment : `${review.comment.slice(0, 250)}...`}
                        </p>
                        <button 
                          onClick={() => toggleExpanded(review._id)}
                          className="mt-2 text-indigo-600 text-sm flex items-center hover:text-indigo-800 transition-colors"
                        >
                          {isExpanded ? (
                            <>Show less <ChevronUp size={16} className="ml-1" /></>
                          ) : (
                            <>Read more <ChevronDown size={16} className="ml-1" /></>
                          )}
                        </button>
                      </>
                    ) : (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                  
                  {/* Review images */}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 mb-4 flex flex-wrap gap-2">
                      {review.images.map((image, index) => (
                        <div key={index} className="h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                          <img 
                            src={image} 
                            alt={`Review image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Review actions */}
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <button
                      onClick={() => toggleHelpful(review._id)}
                      className={`flex items-center ${
                        isHelpful ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                      } transition-colors`}
                    >
                      <ThumbsUp size={16} className={`mr-1 ${isHelpful ? 'fill-indigo-600' : ''}`} />
                      {isHelpful ? 'Helpful' : 'Mark as helpful'}
                    </button>
                    
                    {/* This would be shown only if this review belongs to the logged-in user */}
                    {/* {isUserReview && (
                      <button 
                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Edit review
                      </button>
                    )} */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="review-modal" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                aria-hidden="true"
                onClick={() => setIsModalOpen(false)}
              />
              
              {/* Modal panel */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="text-center sm:text-left mb-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {userReview ? 'Edit Your Review' : 'Write a Review'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Share your experience to help others make better decisions
                    </p>
                  </div>
                  
                  <ReviewForm 
                    productId={productId} 
                    onSuccess={() => {
                      setIsModalOpen(false);
                      // In the future, you might want to update the userReview state here
                    }} 
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerReviews; 