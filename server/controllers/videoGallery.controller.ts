import { Request, Response } from 'express';
import VideoItem, { IVideoItem } from '../models/VideoItem';
import { uploadToCloudinary, deleteFromCloudinary, generateThumbnail } from '../config/cloudinary';

// Generate a filename for Cloudinary based on title and timestamp
const generateFilename = (title: string): string => {
  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  return `video-${sanitizedTitle}-${timestamp}`;
};

// Get all video items
export const getAllVideoItems = async (req: Request, res: Response) => {
  try {
    const videoItems = await VideoItem.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: videoItems.length,
      data: videoItems,
    });
  } catch (error) {
    console.error('Error fetching video items:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching video items',
    });
  }
};

// Get single video item by ID
export const getVideoItemById = async (req: Request, res: Response) => {
  try {
    const videoItem = await VideoItem.findById(req.params.id);
    
    if (!videoItem) {
      return res.status(404).json({
        success: false,
        message: 'Video item not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: videoItem,
    });
  } catch (error) {
    console.error('Error fetching video item:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching video item',
    });
  }
};

// Create new video item
export const createVideoItem = async (req: Request, res: Response) => {
  try {
    const { title, description, newPrice, oldPrice, socialMediaUrl, media } = req.body;
    
    if (!title || !newPrice || !oldPrice || !media) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Generate filename for Cloudinary
    const filename = generateFilename(title);
    
    // Upload video to Cloudinary
    const uploadResult = await uploadToCloudinary(
      media,
      'videogallery',
      filename,
      'video'
    );
    
    // Generate thumbnail if not provided
    const thumbnail = uploadResult.thumbnailUrl || await generateThumbnail(uploadResult.url);
    
    // Create new video item in database
    const videoItem = await VideoItem.create({
      title,
      description: description || '',
      newPrice,
      oldPrice,
      videoUrl: uploadResult.url,
      thumbnail,
      cloudinaryPublicId: uploadResult.publicId,
      socialMediaUrl: socialMediaUrl || '',
    });
    
    return res.status(201).json({
      success: true,
      data: videoItem,
    });
  } catch (error) {
    console.error('Error creating video item:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating video item',
    });
  }
};

// Update video item
export const updateVideoItem = async (req: Request, res: Response) => {
  try {
    const { title, description, newPrice, oldPrice, socialMediaUrl, media } = req.body;
    const videoItemId = req.params.id;
    
    // Find existing video item
    const existingVideoItem = await VideoItem.findById(videoItemId);
    
    if (!existingVideoItem) {
      return res.status(404).json({
        success: false,
        message: 'Video item not found',
      });
    }
    
    // Prepare update data
    const updateData: Partial<IVideoItem> = {
      title: title || existingVideoItem.title,
      description: description !== undefined ? description : existingVideoItem.description,
      newPrice: newPrice || existingVideoItem.newPrice,
      oldPrice: oldPrice || existingVideoItem.oldPrice,
      socialMediaUrl: socialMediaUrl !== undefined ? socialMediaUrl : existingVideoItem.socialMediaUrl,
    };
    
    // If there's new media, upload it and update media-related fields
    if (media) {
      // Delete old video from Cloudinary
      await deleteFromCloudinary(
        existingVideoItem.cloudinaryPublicId,
        'video'
      );
      
      // Generate new filename for Cloudinary
      const filename = generateFilename(updateData.title || existingVideoItem.title);
      
      // Upload new video to Cloudinary
      const uploadResult = await uploadToCloudinary(
        media,
        'videogallery',
        filename,
        'video'
      );
      
      // Generate thumbnail if not provided
      const thumbnail = uploadResult.thumbnailUrl || await generateThumbnail(uploadResult.url);
      
      // Update media-related fields
      updateData.videoUrl = uploadResult.url;
      updateData.thumbnail = thumbnail;
      updateData.cloudinaryPublicId = uploadResult.publicId;
    }
    
    // Update video item in database
    const updatedVideoItem = await VideoItem.findByIdAndUpdate(
      videoItemId,
      updateData,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedVideoItem,
    });
  } catch (error) {
    console.error('Error updating video item:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating video item',
    });
  }
};

// Delete video item
export const deleteVideoItem = async (req: Request, res: Response) => {
  try {
    // Find the video item to be deleted
    const videoItem = await VideoItem.findById(req.params.id);
    
    if (!videoItem) {
      return res.status(404).json({
        success: false,
        message: 'Video item not found',
      });
    }
    
    // Delete video from Cloudinary
    await deleteFromCloudinary(videoItem.cloudinaryPublicId, 'video');
    
    // Delete video item from database
    await VideoItem.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
      success: true,
      message: 'Video item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting video item:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting video item',
    });
  }
}; 