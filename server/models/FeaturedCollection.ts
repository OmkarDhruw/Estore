import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for FeaturedCollection document
export interface IFeaturedCollection extends Document {
  title: string;
  subtitle?: string;
  buttonText: string;
  redirectUrl: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  createdAt: Date;
}

// Create the schema
const featuredCollectionSchema = new Schema<IFeaturedCollection>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      required: [true, 'Button text is required'],
      trim: true,
    },
    redirectUrl: {
      type: String,
      required: [true, 'Redirect URL is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
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
const FeaturedCollection = mongoose.model<IFeaturedCollection>('FeaturedCollection', featuredCollectionSchema);

export default FeaturedCollection; 