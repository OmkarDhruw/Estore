import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

// Base64 converter for media
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess }) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const files = Array.from(e.target.files);
        const base64Promises = files.map(convertToBase64);
        const base64Results = await Promise.all(base64Promises);
        
        // Create object URLs for preview
        const previews = files.map(file => URL.createObjectURL(file));
        
        setMediaFiles(prev => [...prev, ...base64Results]);
        setMediaPreview(prev => [...prev, ...previews]);
      } catch (error) {
        console.error('Error converting files to base64:', error);
        toast.error('Error processing images');
      }
    }
  };
  
  // Remove a media file
  const removeMedia = (index: number) => {
    const newMediaFiles = [...mediaFiles];
    const newMediaPreview = [...mediaPreview];
    
    newMediaFiles.splice(index, 1);
    newMediaPreview.splice(index, 1);
    
    setMediaFiles(newMediaFiles);
    setMediaPreview(newMediaPreview);
  };
  
  // Submit review mutation
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      console.log('Sending review data:', reviewData);
      const response = await axios.post(`${API_URL}/api/reviews`, reviewData);
      console.log('Review API response:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Review submission successful, data returned:', data);
      queryClient.invalidateQueries({queryKey: ['reviews', productId]});
      queryClient.invalidateQueries({queryKey: ['reviewStats', productId]});
      toast.success('Thank you for your review!');
      resetForm();
      onSuccess();
    },
    onError: (error) => {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  });
  
  // Reset form
  const resetForm = () => {
    setRating(5);
    setReviewerName('');
    setComment('');
    setMediaFiles([]);
    setMediaPreview([]);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewerName || !comment) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const reviewData = {
      productId,
      reviewerName,
      rating,
      comment,
      media: mediaFiles,
    };
    
    submitReviewMutation.mutate(reviewData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name*
        </label>
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating*
        </label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              size={24}
              className={`cursor-pointer ${
                (hoveredRating || rating) >= value
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(value)}
            />
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review*
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add Photos (Optional)
        </label>
        
        {mediaPreview.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {mediaPreview.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Review image ${index + 1}`}
                  className="h-20 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => document.getElementById('reviewImageInput')?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-1 text-sm text-gray-500">
            Click to add photos (max 5)
          </p>
          <input
            id="reviewImageInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple
            className="hidden"
            disabled={mediaFiles.length >= 5}
          />
        </div>
        {mediaFiles.length >= 5 && (
          <p className="mt-1 text-xs text-red-500">
            Maximum 5 images allowed
          </p>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={submitReviewMutation.isPending}
        >
          {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm; 