"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHeroSlider = exports.updateHeroSlider = exports.createHeroSlider = exports.getHeroSliderById = exports.getAllHeroSliders = void 0;
const HeroSlider_1 = __importDefault(require("../models/HeroSlider"));
const cloudinary_1 = require("../config/cloudinary");
// Generate a filename for Cloudinary based on title and timestamp
const generateFilename = (title) => {
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    return `hero-${sanitizedTitle}-${timestamp}`;
};
// Get all hero sliders
const getAllHeroSliders = async (req, res) => {
    try {
        const heroSliders = await HeroSlider_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: heroSliders.length,
            data: heroSliders,
        });
    }
    catch (error) {
        console.error('Error fetching hero sliders:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching hero sliders',
        });
    }
};
exports.getAllHeroSliders = getAllHeroSliders;
// Get single hero slider by ID
const getHeroSliderById = async (req, res) => {
    try {
        const heroSlider = await HeroSlider_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error('Error fetching hero slider:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching hero slider',
        });
    }
};
exports.getHeroSliderById = getHeroSliderById;
// Create new hero slider
const createHeroSlider = async (req, res) => {
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
        const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, 'heroslider', filename);
        // Create new hero slider in database
        const heroSlider = await HeroSlider_1.default.create({
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
    }
    catch (error) {
        console.error('Error creating hero slider:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating hero slider',
        });
    }
};
exports.createHeroSlider = createHeroSlider;
// Update hero slider
const updateHeroSlider = async (req, res) => {
    try {
        const { title, subtitle, buttonLabel, redirectUrl, media } = req.body;
        const heroSliderId = req.params.id;
        // Find existing hero slider
        const existingHeroSlider = await HeroSlider_1.default.findById(heroSliderId);
        if (!existingHeroSlider) {
            return res.status(404).json({
                success: false,
                message: 'Hero slider not found',
            });
        }
        // Prepare update data
        const updateData = {
            title: title || existingHeroSlider.title,
            subtitle: subtitle || existingHeroSlider.subtitle,
            buttonLabel: buttonLabel || existingHeroSlider.buttonLabel,
            redirectUrl: redirectUrl || existingHeroSlider.redirectUrl,
        };
        // If there's new media, upload it and update media-related fields
        if (media) {
            // Delete old media from Cloudinary
            await (0, cloudinary_1.deleteFromCloudinary)(existingHeroSlider.cloudinaryPublicId, existingHeroSlider.mediaType);
            // Generate new filename for Cloudinary
            const filename = generateFilename(updateData.title || existingHeroSlider.title);
            // Upload new media to Cloudinary
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, 'heroslider', filename);
            // Update media-related fields
            updateData.mediaUrl = uploadResult.url;
            // Map Cloudinary resource type to our mediaType
            const resourceType = uploadResult.resourceType;
            updateData.mediaType = resourceType === 'video' ? 'video' : 'image';
            updateData.cloudinaryPublicId = uploadResult.publicId;
        }
        // Update hero slider in database
        const updatedHeroSlider = await HeroSlider_1.default.findByIdAndUpdate(heroSliderId, updateData, { new: true, runValidators: true });
        return res.status(200).json({
            success: true,
            data: updatedHeroSlider,
        });
    }
    catch (error) {
        console.error('Error updating hero slider:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating hero slider',
        });
    }
};
exports.updateHeroSlider = updateHeroSlider;
// Delete hero slider
const deleteHeroSlider = async (req, res) => {
    try {
        // Find the hero slider to be deleted
        const heroSlider = await HeroSlider_1.default.findById(req.params.id);
        if (!heroSlider) {
            return res.status(404).json({
                success: false,
                message: 'Hero slider not found',
            });
        }
        // Delete media from Cloudinary
        await (0, cloudinary_1.deleteFromCloudinary)(heroSlider.cloudinaryPublicId, heroSlider.mediaType);
        // Delete hero slider from database
        await HeroSlider_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Hero slider deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting hero slider:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting hero slider',
        });
    }
};
exports.deleteHeroSlider = deleteHeroSlider;
