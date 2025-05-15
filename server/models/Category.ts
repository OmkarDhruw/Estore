import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Category document
export interface ICategory extends Document {
  name: string;
  slug: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  parentPage: string; // for grouping (e.g., explore-skins, explore-clothing)
  createdAt: Date;
}

// Create the schema
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    parentPage: {
      type: String,
      required: [true, 'Parent page is required'],
      trim: true,
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

// Add a pre-save hook to generate slug from name if not provided
categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
  next();
});

// Create and export the model
const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category; 