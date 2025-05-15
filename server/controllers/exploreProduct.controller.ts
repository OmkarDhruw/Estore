import { Request, Response } from 'express';
import ExploreProduct, { IExploreProduct } from '../models/ExploreProduct';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

// Generate a filename for Cloudinary based on title and timestamp
const generateFilename = (title: string): string => {
  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  return `explore-${sanitizedTitle}-${timestamp}`;
};

// Get all explore products
export const getAllExploreProducts = async (req: Request, res: Response) => {
  try {
    const exploreProducts = await ExploreProduct.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: exploreProducts.length,
      data: exploreProducts,
    });
  } catch (error) {
    console.error('Error fetching explore products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching explore products',
    });
  }
};

// Get single explore product by ID
export const getExploreProductById = async (req: Request, res: Response) => {
  try {
    const exploreProduct = await ExploreProduct.findById(req.params.id);
    
    if (!exploreProduct) {
      return res.status(404).json({
        success: false,
        message: 'Explore product not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: exploreProduct,
    });
  } catch (error) {
    console.error('Error fetching explore product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching explore product',
    });
  }
};

// Create new explore product
export const createExploreProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, redirectUrl, media } = req.body;
    
    if (!title || !description || !redirectUrl || !media) {
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
      'exploreproducts',
      filename
    );
    
    // Create new explore product in database
    const exploreProduct = await ExploreProduct.create({
      title,
      description,
      redirectUrl,
      imageUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
    });
    
    return res.status(201).json({
      success: true,
      data: exploreProduct,
    });
  } catch (error) {
    console.error('Error creating explore product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating explore product',
    });
  }
};

// Update explore product
export const updateExploreProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, redirectUrl, media } = req.body;
    const exploreProductId = req.params.id;
    
    // Find existing explore product
    const existingExploreProduct = await ExploreProduct.findById(exploreProductId);
    
    if (!existingExploreProduct) {
      return res.status(404).json({
        success: false,
        message: 'Explore product not found',
      });
    }
    
    // Prepare update data
    const updateData: Partial<IExploreProduct> = {
      title: title || existingExploreProduct.title,
      description: description || existingExploreProduct.description,
      redirectUrl: redirectUrl || existingExploreProduct.redirectUrl,
    };
    
    // If there's new media, upload it and update media-related fields
    if (media) {
      // Delete old media from Cloudinary
      await deleteFromCloudinary(
        existingExploreProduct.cloudinaryPublicId,
        'image'
      );
      
      // Generate new filename for Cloudinary
      const filename = generateFilename(updateData.title || existingExploreProduct.title);
      
      // Upload new media to Cloudinary
      const uploadResult = await uploadToCloudinary(
        media,
        'exploreproducts',
        filename
      );
      
      // Update media-related fields
      updateData.imageUrl = uploadResult.url;
      updateData.cloudinaryPublicId = uploadResult.publicId;
    }
    
    // Update explore product in database
    const updatedExploreProduct = await ExploreProduct.findByIdAndUpdate(
      exploreProductId,
      updateData,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedExploreProduct,
    });
  } catch (error) {
    console.error('Error updating explore product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating explore product',
    });
  }
};

// Delete explore product
export const deleteExploreProduct = async (req: Request, res: Response) => {
  try {
    // Find the explore product to be deleted
    const exploreProduct = await ExploreProduct.findById(req.params.id);
    
    if (!exploreProduct) {
      return res.status(404).json({
        success: false,
        message: 'Explore product not found',
      });
    }
    
    // Delete media from Cloudinary
    await deleteFromCloudinary(exploreProduct.cloudinaryPublicId, 'image');
    
    // Delete explore product from database
    await ExploreProduct.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
      success: true,
      message: 'Explore product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting explore product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting explore product',
    });
  }
}; 