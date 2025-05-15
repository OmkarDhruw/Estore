import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Review document
export interface IReview extends Document {
  productId: mongoose.Types.ObjectId; // linked to Product
  reviewerName: string;
  rating: number;
  comment: string;
  images: string[]; // Array of image URLs
  cloudinaryPublicIds: string[]; // Array of Cloudinary public IDs
  createdAt: Date;
}

// Create the schema
const reviewSchema = new Schema<IReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    reviewerName: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    cloudinaryPublicIds: {
      type: [String],
      default: [],
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
const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review; 