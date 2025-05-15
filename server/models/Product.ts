import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Product document
export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number; // Optional old price for displaying discounts
  images: string[]; // Array of image URLs
  cloudinaryPublicIds: string[]; // Array of Cloudinary public IDs
  categoryId: mongoose.Types.ObjectId; // linked to Category
  parentPage: string;
  tags: string[]; // Tags/Labels for the product
  stockStatus: 'In Stock' | 'Out of Stock';
  isActive: boolean;
  variants: {
    type: 'mobileModel' | 'clothingSize';
    options: string[];
  };
  reviews: mongoose.Types.ObjectId[]; // linked to Review model
  createdAt: Date;
}

// Create the schema
const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [false, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    oldPrice: {
      type: Number,
      min: [0, 'Old price cannot be negative'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image URL is required'],
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: 'At least one image is required'
      }
    },
    cloudinaryPublicIds: {
      type: [String],
      required: [true, 'At least one Cloudinary public ID is required'],
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: 'At least one Cloudinary public ID is required'
      }
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
    },
    parentPage: {
      type: String,
      required: [true, 'Parent page is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: []
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Out of Stock'],
      default: 'In Stock'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    variants: {
      type: {
        type: String,
        enum: ['mobileModel', 'clothingSize'],
        required: [true, 'Variant type is required'],
      },
      options: {
        type: [String],
        required: [true, 'Variant options are required'],
        validate: {
          validator: function(v: string[]) {
            return v.length > 0;
          },
          message: 'At least one variant option is required'
        }
      }
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: 'Review',
      default: []
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

// Add a pre-save hook to generate slug from title if not provided
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
  next();
});

// Create and export the model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product; 