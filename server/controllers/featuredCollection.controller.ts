import { Request, Response } from 'express';
import FeaturedCollection, { IFeaturedCollection } from '../models/FeaturedCollection';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

// Generate a filename for Cloudinary based on title and timestamp
const generateFilename = (title: string): string => {
  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  return `featured-${sanitizedTitle}-${timestamp}`;
};

// Get all featured collections
export const getAllFeaturedCollections = async (req: Request, res: Response) => {
  try {
    const featuredCollections = await FeaturedCollection.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: featuredCollections.length,
      data: featuredCollections,
    });
  } catch (error) {
    console.error('Error fetching featured collections:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching featured collections',
    });
  }
};

// Get single featured collection by ID
export const getFeaturedCollectionById = async (req: Request, res: Response) => {
  try {
    const featuredCollection = await FeaturedCollection.findById(req.params.id);
    
    if (!featuredCollection) {
      return res.status(404).json({
        success: false,
        message: 'Featured collection not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: featuredCollection,
    });
  } catch (error) {
    console.error('Error fetching featured collection:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching featured collection',
    });
  }
};

// Create new featured collection
export const createFeaturedCollection = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, buttonText, redirectUrl, media } = req.body;
    
    if (!title || !buttonText || !redirectUrl || !media) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Generate filename for Cloudinary
    const filename = generateFilename(title);
    
    // Upload media to Cloudinary
    const uploadResult = await uploadToCloudinary(
      media,
      'featuredcollections',
      filename
    );
    
    // Create new featured collection in database
    const featuredCollection = await FeaturedCollection.create({
      title,
      subtitle: subtitle || '',
      buttonText,
      redirectUrl,
      imageUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
    });
    
    return res.status(201).json({
      success: true,
      data: featuredCollection,
    });
  } catch (error) {
    console.error('Error creating featured collection:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating featured collection',
    });
  }
};

// Update featured collection
export const updateFeaturedCollection = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, buttonText, redirectUrl, media } = req.body;
    const featuredCollectionId = req.params.id;
    
    // Find existing featured collection
    const existingFeaturedCollection = await FeaturedCollection.findById(featuredCollectionId);
    
    if (!existingFeaturedCollection) {
      return res.status(404).json({
        success: false,
        message: 'Featured collection not found',
      });
    }
    
    // Prepare update data
    const updateData: Partial<IFeaturedCollection> = {
      title: title || existingFeaturedCollection.title,
      subtitle: subtitle !== undefined ? subtitle : existingFeaturedCollection.subtitle,
      buttonText: buttonText || existingFeaturedCollection.buttonText,
      redirectUrl: redirectUrl || existingFeaturedCollection.redirectUrl,
    };
    
    // If there's new media, upload it and update media-related fields
    if (media) {
      // Delete old image from Cloudinary
      await deleteFromCloudinary(
        existingFeaturedCollection.cloudinaryPublicId
      );
      
      // Generate new filename for Cloudinary
      const filename = generateFilename(updateData.title || existingFeaturedCollection.title);
      
      // Upload new image to Cloudinary
      const uploadResult = await uploadToCloudinary(
        media,
        'featuredcollections',
        filename
      );
      
      // Update image-related fields
      updateData.imageUrl = uploadResult.url;
      updateData.cloudinaryPublicId = uploadResult.publicId;
    }
    
    // Update featured collection in database
    const updatedFeaturedCollection = await FeaturedCollection.findByIdAndUpdate(
      featuredCollectionId,
      updateData,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedFeaturedCollection,
    });
  } catch (error) {
    console.error('Error updating featured collection:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating featured collection',
    });
  }
};

// Delete featured collection
export const deleteFeaturedCollection = async (req: Request, res: Response) => {
  try {
    // Find the featured collection to be deleted
    const featuredCollection = await FeaturedCollection.findById(req.params.id);
    
    if (!featuredCollection) {
      return res.status(404).json({
        success: false,
        message: 'Featured collection not found',
      });
    }
    
    // Delete image from Cloudinary
    await deleteFromCloudinary(featuredCollection.cloudinaryPublicId);
    
    // Delete featured collection from database
    await FeaturedCollection.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
      success: true,
      message: 'Featured collection deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting featured collection:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting featured collection',
    });
  }
}; 