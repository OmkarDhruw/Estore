import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for ExploreProduct document
export interface IExploreProduct extends Document {
  title: string;
  description: string;
  redirectUrl: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  createdAt: Date;
}

// Create the schema
const exploreProductSchema = new Schema<IExploreProduct>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
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
const ExploreProduct = mongoose.model<IExploreProduct>('ExploreProduct', exploreProductSchema);

export default ExploreProduct; 