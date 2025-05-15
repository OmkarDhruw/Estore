"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoItem = exports.updateVideoItem = exports.createVideoItem = exports.getVideoItemById = exports.getAllVideoItems = void 0;
const VideoItem_1 = __importDefault(require("../models/VideoItem"));
const cloudinary_1 = require("../config/cloudinary");
// Generate a filename for Cloudinary based on title and timestamp
const generateFilename = (title) => {
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    return `video-${sanitizedTitle}-${timestamp}`;
};
// Get all video items
const getAllVideoItems = async (req, res) => {
    try {
        const videoItems = await VideoItem_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: videoItems.length,
            data: videoItems,
        });
    }
    catch (error) {
        console.error('Error fetching video items:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching video items',
        });
    }
};
exports.getAllVideoItems = getAllVideoItems;
// Get single video item by ID
const getVideoItemById = async (req, res) => {
    try {
        const videoItem = await VideoItem_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error('Error fetching video item:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching video item',
        });
    }
};
exports.getVideoItemById = getVideoItemById;
// Create new video item
const createVideoItem = async (req, res) => {
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
        const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, 'videogallery', filename, 'video');
        // Generate thumbnail if not provided
        const thumbnail = uploadResult.thumbnailUrl || await (0, cloudinary_1.generateThumbnail)(uploadResult.url);
        // Create new video item in database
        const videoItem = await VideoItem_1.default.create({
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
    }
    catch (error) {
        console.error('Error creating video item:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating video item',
        });
    }
};
exports.createVideoItem = createVideoItem;
// Update video item
const updateVideoItem = async (req, res) => {
    try {
        const { title, description, newPrice, oldPrice, socialMediaUrl, media } = req.body;
        const videoItemId = req.params.id;
        // Find existing video item
        const existingVideoItem = await VideoItem_1.default.findById(videoItemId);
        if (!existingVideoItem) {
            return res.status(404).json({
                success: false,
                message: 'Video item not found',
            });
        }
        // Prepare update data
        const updateData = {
            title: title || existingVideoItem.title,
            description: description !== undefined ? description : existingVideoItem.description,
            newPrice: newPrice || existingVideoItem.newPrice,
            oldPrice: oldPrice || existingVideoItem.oldPrice,
            socialMediaUrl: socialMediaUrl !== undefined ? socialMediaUrl : existingVideoItem.socialMediaUrl,
        };
        // If there's new media, upload it and update media-related fields
        if (media) {
            // Delete old video from Cloudinary
            await (0, cloudinary_1.deleteFromCloudinary)(existingVideoItem.cloudinaryPublicId, 'video');
            // Generate new filename for Cloudinary
            const filename = generateFilename(updateData.title || existingVideoItem.title);
            // Upload new video to Cloudinary
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, 'videogallery', filename, 'video');
            // Generate thumbnail if not provided
            const thumbnail = uploadResult.thumbnailUrl || await (0, cloudinary_1.generateThumbnail)(uploadResult.url);
            // Update media-related fields
            updateData.videoUrl = uploadResult.url;
            updateData.thumbnail = thumbnail;
            updateData.cloudinaryPublicId = uploadResult.publicId;
        }
        // Update video item in database
        const updatedVideoItem = await VideoItem_1.default.findByIdAndUpdate(videoItemId, updateData, { new: true, runValidators: true });
        return res.status(200).json({
            success: true,
            data: updatedVideoItem,
        });
    }
    catch (error) {
        console.error('Error updating video item:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating video item',
        });
    }
};
exports.updateVideoItem = updateVideoItem;
// Delete video item
const deleteVideoItem = async (req, res) => {
    try {
        // Find the video item to be deleted
        const videoItem = await VideoItem_1.default.findById(req.params.id);
        if (!videoItem) {
            return res.status(404).json({
                success: false,
                message: 'Video item not found',
            });
        }
        // Delete video from Cloudinary
        await (0, cloudinary_1.deleteFromCloudinary)(videoItem.cloudinaryPublicId, 'video');
        // Delete video item from database
        await VideoItem_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Video item deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting video item:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting video item',
        });
    }
};
exports.deleteVideoItem = deleteVideoItem;
