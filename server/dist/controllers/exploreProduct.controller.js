"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExploreProduct = exports.updateExploreProduct = exports.createExploreProduct = exports.getExploreProductById = exports.getAllExploreProducts = void 0;
const ExploreProduct_1 = __importDefault(require("../models/ExploreProduct"));
const cloudinary_1 = require("../config/cloudinary");
// Generate a filename for Cloudinary based on title and timestamp
const generateFilename = (title) => {
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    return `explore-${sanitizedTitle}-${timestamp}`;
};
// Get all explore products
const getAllExploreProducts = async (req, res) => {
    try {
        const exploreProducts = await ExploreProduct_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: exploreProducts.length,
            data: exploreProducts,
        });
    }
    catch (error) {
        console.error('Error fetching explore products:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching explore products',
        });
    }
};
exports.getAllExploreProducts = getAllExploreProducts;
// Get single explore product by ID
const getExploreProductById = async (req, res) => {
    try {
        const exploreProduct = await ExploreProduct_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error('Error fetching explore product:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching explore product',
        });
    }
};
exports.getExploreProductById = getExploreProductById;
// Create new explore product
const createExploreProduct = async (req, res) => {
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
        const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, 'exploreproducts', filename);
        // Create new explore product in database
        const exploreProduct = await ExploreProduct_1.default.create({
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
    }
    catch (error) {
        console.error('Error creating explore product:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating explore product',
        });
    }
};
exports.createExploreProduct = createExploreProduct;
// Update explore product
const updateExploreProduct = async (req, res) => {
    try {
        const { title, description, redirectUrl, media } = req.body;
        const exploreProductId = req.params.id;
        // Find existing explore product
        const existingExploreProduct = await ExploreProduct_1.default.findById(exploreProductId);
        if (!existingExploreProduct) {
            return res.status(404).json({
                success: false,
                message: 'Explore product not found',
            });
        }
        // Prepare update data
        const updateData = {
            title: title || existingExploreProduct.title,
            description: description || existingExploreProduct.description,
            redirectUrl: redirectUrl || existingExploreProduct.redirectUrl,
        };
        // If there's new media, upload it and update media-related fields
        if (media) {
            // Delete old media from Cloudinary
            await (0, cloudinary_1.deleteFromCloudinary)(existingExploreProduct.cloudinaryPublicId, 'image');
            // Generate new filename for Cloudinary
            const filename = generateFilename(updateData.title || existingExploreProduct.title);
            // Upload new media to Cloudinary
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, 'exploreproducts', filename);
            // Update media-related fields
            updateData.imageUrl = uploadResult.url;
            updateData.cloudinaryPublicId = uploadResult.publicId;
        }
        // Update explore product in database
        const updatedExploreProduct = await ExploreProduct_1.default.findByIdAndUpdate(exploreProductId, updateData, { new: true, runValidators: true });
        return res.status(200).json({
            success: true,
            data: updatedExploreProduct,
        });
    }
    catch (error) {
        console.error('Error updating explore product:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating explore product',
        });
    }
};
exports.updateExploreProduct = updateExploreProduct;
// Delete explore product
const deleteExploreProduct = async (req, res) => {
    try {
        // Find the explore product to be deleted
        const exploreProduct = await ExploreProduct_1.default.findById(req.params.id);
        if (!exploreProduct) {
            return res.status(404).json({
                success: false,
                message: 'Explore product not found',
            });
        }
        // Delete media from Cloudinary
        await (0, cloudinary_1.deleteFromCloudinary)(exploreProduct.cloudinaryPublicId, 'image');
        // Delete explore product from database
        await ExploreProduct_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Explore product deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting explore product:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting explore product',
        });
    }
};
exports.deleteExploreProduct = deleteExploreProduct;
