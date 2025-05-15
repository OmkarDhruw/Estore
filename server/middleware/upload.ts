import { Request, Response, NextFunction } from 'express';

// This middleware handles direct base64 file uploads from frontend
export const uploadBase64 = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if there's file data in the request body
    if (!req.body.media) {
      console.log('No media in request body, continuing');
      return next(); // No media, move to next middleware
    }

    console.log('Media found in upload middleware');
    console.log('Media is array:', Array.isArray(req.body.media));
    if (Array.isArray(req.body.media)) {
      console.log('Number of media items:', req.body.media.length);
      console.log('First item is string:', typeof req.body.media[0] === 'string');
      console.log('First item starts with data:', req.body.media[0]?.slice(0, 20) + '...');
    }

    // Prepare media data from base64 string
    const mediaData = req.body.media;
    
    // Verify if it's a valid base64 string
    if (Array.isArray(mediaData)) {
      // If it's an array of media items, just pass it through
      console.log('Media is an array, passing through to controller');
      next();
      return;
    } else if (!mediaData.startsWith('data:')) {
      console.log('Invalid media format - not a base64 string:', mediaData.slice(0, 20));
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
  } catch (error) {
    console.error('Error in upload middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing media upload',
    });
  }
};

// Type declaration for the request file
declare global {
  namespace Express {
    interface Request {
      mediaType?: 'image' | 'video';
      mediaData?: string;
    }
  }
} 