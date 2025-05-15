import { Request, Response } from 'express';
import Review, { IReview } from '../models/Review';
import Product from '../models/Product';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import mongoose from 'mongoose';

// Generate a filename for Cloudinary based on review details
const generateFilename = (productId: string, reviewerName: string): string => {
  const sanitizedName = reviewerName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  return `${productId}-${sanitizedName}-${timestamp}`;
};

// Get all reviews for a product
export const getReviewsByProductId = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    // Fetch reviews for the product
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews',
    });
  }
};

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId, reviewerName, rating, comment, media } = req.body;
    
    console.log('Review submission received:');
    console.log('- productId:', productId);
    console.log('- reviewerName:', reviewerName);
    console.log('- rating:', rating);
    console.log('- comment:', comment ? 'Provided' : 'Missing');
    console.log('- media:', media ? `${Array.isArray(media) ? media.length : 'Not an array'} items` : 'No media');
    
    if (!productId || !reviewerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }
    
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    // Create review data
    const reviewData: Partial<IReview> = {
      productId,
      reviewerName,
      rating: Number(rating),
      comment,
      images: [],
      cloudinaryPublicIds: [],
    };
    
    // Upload media to Cloudinary if provided
    if (media && Array.isArray(media) && media.length > 0) {
      try {
        console.log(`Attempting to upload ${media.length} images for review`);
        
        // Get category information to organize by category slug
        const populatedProduct = await Product.findById(productId).populate('categoryId');
        if (!populatedProduct) {
          return res.status(404).json({
            success: false,
            message: 'Product not found',
          });
        }
        
        // Get category slug from populated product
        const categorySlug = typeof populatedProduct.categoryId === 'object' && populatedProduct.categoryId 
          ? (populatedProduct.categoryId as any).slug || 'uncategorized'
          : 'uncategorized';
        
        // Validate that media items are proper base64 strings
        const validMediaItems = media.filter(item => 
          typeof item === 'string' && item.startsWith('data:')
        );

        console.log(`Valid media items: ${validMediaItems.length} out of ${media.length}`);
        
        if (validMediaItems.length === 0) {
          console.error('No valid media items to upload');
          // Continue without images rather than failing the whole review
          reviewData.images = [];
          reviewData.cloudinaryPublicIds = [];
        } else {
          const uploadPromises = validMediaItems.map(async (mediaItem, index) => {
            try {
              // Generate folder path and filename for Cloudinary
              // New structure: reviews/{category-slug}/{product-slug}/{productId}-{reviewerName}-{timestamp}
              const folderPath = `reviews/${categorySlug}/${populatedProduct.slug}`;
              const filename = `${generateFilename(productId, reviewerName)}-${index + 1}`;
              
              console.log(`Uploading to folder: ${folderPath}, filename: ${filename}`);
              
              // Upload media to Cloudinary
              const uploadResult = await uploadToCloudinary(
                mediaItem,
                folderPath,
                filename
              );
              
              console.log(`Upload successful for image ${index + 1}. URL: ${uploadResult.url}`);
              
              return {
                url: uploadResult.url,
                publicId: uploadResult.publicId,
              };
            } catch (uploadError) {
              console.error(`Error uploading image ${index + 1}:`, uploadError);
              // Return null for failed uploads
              return null;
            }
          });
          
          const uploadResults = await Promise.all(uploadPromises);
          
          // Filter out null results (failed uploads)
          const successfulUploads = uploadResults.filter(result => result !== null);
          
          console.log(`Successfully uploaded ${successfulUploads.length} out of ${validMediaItems.length} images`);
          
          // Add uploaded media information to review data
          reviewData.images = successfulUploads.map(result => result.url);
          reviewData.cloudinaryPublicIds = successfulUploads.map(result => result.publicId);
        }
      } catch (mediaError) {
        console.error('Error processing review media:', mediaError);
        // Continue with the review without images rather than failing
        reviewData.images = [];
        reviewData.cloudinaryPublicIds = [];
      }
    }
    
    // Create new review in database
    const review = await Review.create(reviewData);
    
    // Update product with the new review
    await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: review._id } }
    );
    
    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating review',
    });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }
    
    // Delete review images from Cloudinary
    if (review.cloudinaryPublicIds && review.cloudinaryPublicIds.length > 0) {
      const deletePromises = review.cloudinaryPublicIds.map(publicId => 
        deleteFromCloudinary(publicId, 'image')
      );
      
      await Promise.all(deletePromises);
    }
    
    // Remove review reference from product
    await Product.findByIdAndUpdate(
      review.productId,
      { $pull: { reviews: review._id } }
    );
    
    // Delete review from database
    await Review.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting review',
    });
  }
};

// Get review statistics for a product
export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    // Get review statistics
    const totalReviews = await Review.countDocuments({ productId });
    
    // Get the count of reviews for each rating
    const ratingCounts = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    // Calculate the average rating
    const averageRating = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        totalReviews,
        ratingCounts: ratingCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {} as Record<number, number>),
        averageRating: averageRating.length > 0 ? averageRating[0].average : 0
      },
    });
  } catch (error) {
    console.error('Error fetching review statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching review statistics',
    });
  }
}; 