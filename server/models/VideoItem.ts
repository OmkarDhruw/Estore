import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for VideoItem document
export interface IVideoItem extends Document {
  title: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  videoUrl: string;
  thumbnail: string;
  cloudinaryPublicId: string;
  socialMediaUrl: string;
  createdAt: Date;
}

// Create the schema
const videoItemSchema = new Schema<IVideoItem>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    newPrice: {
      type: Number,
      required: [true, 'New price is required'],
    },
    oldPrice: {
      type: Number,
      required: [true, 'Old price is required'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    socialMediaUrl: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const VideoItem = mongoose.model<IVideoItem>('VideoItem', videoItemSchema);

export default VideoItem; 