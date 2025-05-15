"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBase64 = void 0;
// This middleware handles direct base64 file uploads from frontend
const uploadBase64 = (req, res, next) => {
    try {
        // Check if there's file data in the request body
        if (!req.body.media) {
            return next(); // No media, move to next middleware
        }
        // Prepare media data from base64 string
        const mediaData = req.body.media;
        // Verify if it's a valid base64 string
        if (!mediaData.startsWith('data:')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid media format. Must be a base64 encoded string.',
            });
        }
        // Extract the media type from base64 string
        const mediaType = mediaData.includes('data:video/') ? 'video' : 'image';
        // Add media info to request body for the controller to use
        req.body.mediaType = mediaType;
        req.body.mediaData = mediaData;
        next();
    }
    catch (error) {
        console.error('Error in upload middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing media upload',
        });
    }
};
exports.uploadBase64 = uploadBase64;
