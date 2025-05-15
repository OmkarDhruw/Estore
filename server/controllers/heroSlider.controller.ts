import { Request, Response } from 'express';
import HeroSlider, { IHeroSlider } from '../models/HeroSlider';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

// Generate a filename for Cloudinary based on title and timestamp
const generateFilename = (title: string): string => {
  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  return `hero-${sanitizedTitle}-${timestamp}`;
};

// Get all hero sliders
export const getAllHeroSliders = async (req: Request, res: Response) => {
  try {
    const heroSliders = await HeroSlider.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: heroSliders.length,
      data: heroSliders,
    });
  } catch (error) {
    console.error('Error fetching hero sliders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching hero sliders',
    });
  }
};

// Get single hero slider by ID
export const getHeroSliderById = async (req: Request, res: Response) => {
  try {
    const heroSlider = await HeroSlider.findById(req.params.id);
    
    if (!heroSlider) {
      return res.status(404).json({
        success: false,
        message: 'Hero slider not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: heroSlider,
    });
  } catch (error) {
    console.error('Error fetching hero slider:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching hero slider',
    });
  }
};

// Create new hero slider
export const createHeroSlider = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, buttonLabel, redirectUrl, media } = req.body;
    
    if (!title || !subtitle || !buttonLabel || !redirectUrl || !media) {
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
      'heroslider',
      filename
    );
    
    // Create new hero slider in database
    const heroSlider = await HeroSlider.create({
      title,
      subtitle,
      buttonLabel,
      redirectUrl,
      mediaUrl: uploadResult.url,
      mediaType: uploadResult.resourceType === 'video' ? 'video' : 'image',
      cloudinaryPublicId: uploadResult.publicId,
    });
    
    return res.status(201).json({
      success: true,
      data: heroSlider,
    });
  } catch (error) {
    console.error('Error creating hero slider:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating hero slider',
    });
  }
};

// Update hero slider
export const updateHeroSlider = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, buttonLabel, redirectUrl, media } = req.body;
    const heroSliderId = req.params.id;
    
    // Find existing hero slider
    const existingHeroSlider = await HeroSlider.findById(heroSliderId);
    
    if (!existingHeroSlider) {
      return res.status(404).json({
        success: false,
        message: 'Hero slider not found',
      });
    }
    
    // Prepare update data
    const updateData: Partial<IHeroSlider> = {
      title: title || existingHeroSlider.title,
      subtitle: subtitle || existingHeroSlider.subtitle,
      buttonLabel: buttonLabel || existingHeroSlider.buttonLabel,
      redirectUrl: redirectUrl || existingHeroSlider.redirectUrl,
    };
    
    // If there's new media, upload it and update media-related fields
    if (media) {
      // Delete old media from Cloudinary
      await deleteFromCloudinary(
        existingHeroSlider.cloudinaryPublicId,
        existingHeroSlider.mediaType
      );
      
      // Generate new filename for Cloudinary
      const filename = generateFilename(updateData.title || existingHeroSlider.title);
      
      // Upload new media to Cloudinary
      const uploadResult = await uploadToCloudinary(
        media,
        'heroslider',
        filename
      );
      
      // Update media-related fields
      updateData.mediaUrl = uploadResult.url;
      
      // Map Cloudinary resource type to our mediaType
      const resourceType = uploadResult.resourceType;
      updateData.mediaType = resourceType === 'video' ? 'video' : 'image';
      
      updateData.cloudinaryPublicId = uploadResult.publicId;
    }
    
    // Update hero slider in database
    const updatedHeroSlider = await HeroSlider.findByIdAndUpdate(
      heroSliderId,
      updateData,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedHeroSlider,
    });
  } catch (error) {
    console.error('Error updating hero slider:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating hero slider',
    });
  }
};

// Delete hero slider
export const deleteHeroSlider = async (req: Request, res: Response) => {
  try {
    // Find the hero slider to be deleted
    const heroSlider = await HeroSlider.findById(req.params.id);
    
    if (!heroSlider) {
      return res.status(404).json({
        success: false,
        message: 'Hero slider not found',
      });
    }
    
    // Delete media from Cloudinary
    await deleteFromCloudinary(heroSlider.cloudinaryPublicId, heroSlider.mediaType);
    
    // Delete hero slider from database
    await HeroSlider.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
      success: true,
      message: 'Hero slider deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hero slider:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting hero slider',
    });
  }
}; 