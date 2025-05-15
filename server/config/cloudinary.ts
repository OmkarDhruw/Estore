import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkggkuv6h',
  api_key: process.env.CLOUDINARY_API_KEY || '556647679375992',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'PEfMPAcRj3T4vjsHbhkD68hF3yA',
  secure: true,
});

export default cloudinary;

// Helper function to upload media to Cloudinary
export const uploadToCloudinary = async (
  fileStr: string, 
  folder: string, 
  filename: string,
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
) => {
  try {
    console.log(`Cloudinary upload requested for ${filename} to folder ${folder}`);
    console.log(`File string starts with: ${fileStr.substring(0, 30)}...`);
    
    const uploadOptions: any = {
      folder: folder,
      public_id: filename,
      resource_type: resourceType || 'auto', // auto-detect if it's an image or video
    };
    
    console.log('Upload options:', uploadOptions);
    
    // If it's a video, automatically generate a thumbnail
    if (resourceType === 'video') {
      uploadOptions.eager = [
        { format: 'jpg', transformation: [
          { width: 640, crop: 'scale' },
          { start_offset: '0', end_offset: '1' }
        ]}
      ];
    }
    
    console.log('Attempting Cloudinary upload...');
    const uploadResponse = await cloudinary.uploader.upload(fileStr, uploadOptions);
    console.log('Cloudinary upload successful, URL:', uploadResponse.secure_url);
    
    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      resourceType: uploadResponse.resource_type,
      thumbnailUrl: uploadResponse.eager && uploadResponse.eager[0] ? uploadResponse.eager[0].secure_url : null,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload media to Cloudinary');
  }
};

// Helper function to delete media from Cloudinary
export const deleteFromCloudinary = async (publicId: string, resourceType: string = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as any, // 'image' or 'video'
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete media from Cloudinary');
  }
};

// Helper function to delete a folder from Cloudinary, including all assets in that folder
export const deleteCloudinaryFolder = async (folderPath: string) => {
  try {
    // Delete all resources in the folder first
    const result = await cloudinary.api.delete_resources_by_prefix(folderPath);
    
    // Then delete the empty folder
    await cloudinary.api.delete_folder(folderPath);
    
    return result;
  } catch (error) {
    console.error('Error deleting folder from Cloudinary:', error);
    throw new Error('Failed to delete folder from Cloudinary');
  }
};

// Helper function to generate a thumbnail from a video URL
export const generateThumbnail = async (videoUrl: string): Promise<string> => {
  try {
    // Extract the public ID from the URL
    const publicIdMatch = videoUrl.match(/\/v\d+\/(.+?)(?:\.[^.]+)?$/);
    if (!publicIdMatch || !publicIdMatch[1]) {
      throw new Error('Could not extract public ID from video URL');
    }
    
    const publicId = publicIdMatch[1];
    
    // Generate a thumbnail using Cloudinary's URL API
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { width: 640, crop: 'scale' },
        { start_offset: '0' }
      ]
    });
    
    return thumbnailUrl;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    // Return a default thumbnail or the video URL itself
    return videoUrl;
  }
};
