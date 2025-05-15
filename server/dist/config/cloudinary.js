"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThumbnail = exports.deleteCloudinaryFolder = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkggkuv6h',
    api_key: process.env.CLOUDINARY_API_KEY || '556647679375992',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'PEfMPAcRj3T4vjsHbhkD68hF3yA',
    secure: true,
});
exports.default = cloudinary_1.v2;
// Helper function to upload media to Cloudinary
const uploadToCloudinary = async (fileStr, folder, filename, resourceType) => {
    try {
        const uploadOptions = {
            folder: folder,
            public_id: filename,
            resource_type: resourceType || 'auto', // auto-detect if it's an image or video
        };
        // If it's a video, automatically generate a thumbnail
        if (resourceType === 'video') {
            uploadOptions.eager = [
                { format: 'jpg', transformation: [
                        { width: 640, crop: 'scale' },
                        { start_offset: '0', end_offset: '1' }
                    ] }
            ];
        }
        const uploadResponse = await cloudinary_1.v2.uploader.upload(fileStr, uploadOptions);
        return {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            resourceType: uploadResponse.resource_type,
            thumbnailUrl: uploadResponse.eager && uploadResponse.eager[0] ? uploadResponse.eager[0].secure_url : null,
        };
    }
    catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload media to Cloudinary');
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
// Helper function to delete media from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: resourceType, // 'image' or 'video'
        });
        return result;
    }
    catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete media from Cloudinary');
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
// Helper function to delete a folder from Cloudinary, including all assets in that folder
const deleteCloudinaryFolder = async (folderPath) => {
    try {
        // Delete all resources in the folder first
        const result = await cloudinary_1.v2.api.delete_resources_by_prefix(folderPath);
        // Then delete the empty folder
        await cloudinary_1.v2.api.delete_folder(folderPath);
        return result;
    }
    catch (error) {
        console.error('Error deleting folder from Cloudinary:', error);
        throw new Error('Failed to delete folder from Cloudinary');
    }
};
exports.deleteCloudinaryFolder = deleteCloudinaryFolder;
// Helper function to generate a thumbnail from a video URL
const generateThumbnail = async (videoUrl) => {
    try {
        // Extract the public ID from the URL
        const publicIdMatch = videoUrl.match(/\/v\d+\/(.+?)(?:\.[^.]+)?$/);
        if (!publicIdMatch || !publicIdMatch[1]) {
            throw new Error('Could not extract public ID from video URL');
        }
        const publicId = publicIdMatch[1];
        // Generate a thumbnail using Cloudinary's URL API
        const thumbnailUrl = cloudinary_1.v2.url(publicId, {
            resource_type: 'video',
            format: 'jpg',
            transformation: [
                { width: 640, crop: 'scale' },
                { start_offset: '0' }
            ]
        });
        return thumbnailUrl;
    }
    catch (error) {
        console.error('Error generating thumbnail:', error);
        // Return a default thumbnail or the video URL itself
        return videoUrl;
    }
};
exports.generateThumbnail = generateThumbnail;
