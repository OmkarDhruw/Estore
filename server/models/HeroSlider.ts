import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for HeroSlider document
export interface IHeroSlider extends Document {
  title: string;
  subtitle: string;
  buttonLabel: string;
  redirectUrl: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  cloudinaryPublicId: string;
  createdAt: Date;
}

// Create the schema
const heroSliderSchema = new Schema<IHeroSlider>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
    },
    buttonLabel: {
      type: String,
      required: [true, 'Button label is required'],
      trim: true,
    },
    redirectUrl: {
      type: String,
      required: [true, 'Redirect URL is required'],
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: [true, 'Media type is required'],
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
const HeroSlider = mongoose.model<IHeroSlider>('HeroSlider', heroSliderSchema);

export default HeroSlider; 