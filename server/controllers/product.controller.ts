import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import Category from '../models/Category';
import Review from '../models/Review';
import { uploadToCloudinary, deleteFromCloudinary, deleteCloudinaryFolder } from '../config/cloudinary';

// Generate a filename for Cloudinary based on product title
const generateFilename = (productTitle: string): string => {
  const sanitizedTitle = productTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  return `${sanitizedTitle}-${timestamp}`;
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Optional query parameter for category filtering
    const categoryId = req.query.categoryId as string;
    
    // Build query
    const query = categoryId ? { categoryId } : {};
    
    // Fetch products with category populated
    const products = await Product.find(query)
      .populate('categoryId', 'name imageUrl')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name imageUrl');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      price, 
      oldPrice, 
      categoryId, 
      parentPage, 
      mediaFiles, 
      tags, 
      stockStatus, 
      isActive, 
      variantType, 
      variantOptions 
    } = req.body;
    
    if (!title || !description || price === undefined || !categoryId || !parentPage || !mediaFiles || mediaFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Check if slug is unique
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists. Please choose a different name.',
      });
    }

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Generate folder path for Cloudinary
    const folderPath = `products/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/products/${slug}`;
    
    // Upload media files to Cloudinary
    const uploadPromises = mediaFiles.map(async (media: string, index: number) => {
      const filename = `${slug}-${index + 1}-${Date.now()}`;
      
      const uploadResult = await uploadToCloudinary(
        media,
        folderPath,
        filename
      );
      
      return {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    });
    
    const uploadResults = await Promise.all(uploadPromises);
    
    // Create new product in database
    const product = await Product.create({
      title,
      slug,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      categoryId,
      parentPage,
      images: uploadResults.map(result => result.url),
      cloudinaryPublicIds: uploadResults.map(result => result.publicId),
      tags: tags || [],
      stockStatus: stockStatus || 'In Stock',
      isActive: isActive !== undefined ? isActive : true,
      variants: {
        type: variantType || 'mobileModel',
        options: variantOptions || []
      }
    });
    
    // Populate category information
    const populatedProduct = await Product.findById(product._id)
      .populate('categoryId', 'name imageUrl');
    
    return res.status(201).json({
      success: true,
      data: populatedProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating product',
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      price, 
      oldPrice, 
      categoryId, 
      parentPage, 
      mediaFiles, 
      tags, 
      stockStatus, 
      isActive, 
      variantType, 
      variantOptions 
    } = req.body;
    const productId = req.params.id;
    
    // Find existing product
    const existingProduct = await Product.findById(productId);
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    // Check if the category exists if it's changing
    if (categoryId && categoryId !== existingProduct.categoryId.toString()) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
    }
    
    // Prepare update data
    const updateData: Partial<IProduct> = {
      title: title || existingProduct.title,
      description: description || existingProduct.description,
      parentPage: parentPage || existingProduct.parentPage,
    };
    
    // Update slug if title is changing
    if (title && title !== existingProduct.title) {
      const newSlug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Check if the new slug is unique
      const slugExists = await Product.findOne({ 
        slug: newSlug, 
        _id: { $ne: productId } 
      });
      
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'A product with this name already exists. Please choose a different name.',
        });
      }
      
      updateData.slug = newSlug;
    }
    
    // Update price only if it's provided
    if (price !== undefined) {
      updateData.price = Number(price);
    }
    
    // Update old price if it's provided or set to null explicitly
    if (oldPrice !== undefined) {
      updateData.oldPrice = oldPrice === null ? undefined : Number(oldPrice);
    }
    
    // Update category if it's changing
    if (categoryId) {
      updateData.categoryId = categoryId;
    }
    
    // Update tags, stock status, active status
    if (tags !== undefined) {
      updateData.tags = tags;
    }
    
    if (stockStatus !== undefined) {
      updateData.stockStatus = stockStatus;
    }
    
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    
    // Update variant information
    if (variantType !== undefined || variantOptions !== undefined) {
      updateData.variants = {
        type: variantType || existingProduct.variants.type,
        options: variantOptions || existingProduct.variants.options
      };
    }
    
    // If there are new media files, update them
    if (mediaFiles && Array.isArray(mediaFiles) && mediaFiles.length > 0) {
      // Delete old media from Cloudinary
      const deletePromises = existingProduct.cloudinaryPublicIds.map(publicId => 
        deleteFromCloudinary(publicId, 'image')
      );
      
      await Promise.all(deletePromises);
      
      // Get the category for folder structure
      const category = await Category.findById(categoryId || existingProduct.categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
      
      // Generate folder path for Cloudinary
      const slug = updateData.slug || existingProduct.slug;
      const folderPath = `products/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/products/${slug}`;
      
      // Upload new media files to Cloudinary
      const uploadPromises = mediaFiles.map(async (media: string, index: number) => {
        const filename = `${slug}-${index + 1}-${Date.now()}`;
        
        const uploadResult = await uploadToCloudinary(
          media,
          folderPath,
          filename
        );
        
        return {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
        };
      });
      
      const uploadResults = await Promise.all(uploadPromises);
      
      // Update media-related fields
      updateData.images = uploadResults.map(result => result.url);
      updateData.cloudinaryPublicIds = uploadResults.map(result => result.publicId);
    }
    
    // Update product in database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name imageUrl');
    
    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating product',
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    // Get the category for folder structure
    const category = await Category.findById(product.categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    // Get all reviews for this product to delete their images
    const productReviews = await Review.find({ productId: product._id });
    console.log(`Found ${productReviews.length} reviews for product ${product._id}`);
    
    // Track deletion status
    const deletionStatus = {
      productImagesDeleted: false,
      reviewImagesDeleted: false,
      reviewsDeleted: false,
      productDeleted: false
    };
    
    // 1. Delete product folder from Cloudinary
    try {
      // Generate folder path for product's Cloudinary folder
      const productFolderPath = `products/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/products/${product.slug}`;
      await deleteCloudinaryFolder(productFolderPath);
      console.log(`Deleted product Cloudinary folder: ${productFolderPath}`);
      deletionStatus.productImagesDeleted = true;
    } catch (cloudinaryError) {
      console.error('Error deleting product Cloudinary folder:', cloudinaryError);
      // Continue with deletion even if Cloudinary folder deletion fails
    }
    
    // 2. Delete all review images from Cloudinary
    try {
      // Generate folder path for reviews Cloudinary folder
      const reviewsFolderPath = `reviews/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${product.slug}`;
      await deleteCloudinaryFolder(reviewsFolderPath);
      console.log(`Deleted reviews Cloudinary folder: ${reviewsFolderPath}`);
      deletionStatus.reviewImagesDeleted = true;
    } catch (cloudinaryError) {
      console.error('Error deleting reviews Cloudinary folder:', cloudinaryError);
      
      // Try to delete individual review images as fallback
      try {
        const deleteImagePromises: Promise<any>[] = [];
        productReviews.forEach(review => {
          if (review.cloudinaryPublicIds && review.cloudinaryPublicIds.length > 0) {
            review.cloudinaryPublicIds.forEach(publicId => {
              deleteImagePromises.push(deleteFromCloudinary(publicId, 'image'));
            });
          }
        });
        
        if (deleteImagePromises.length > 0) {
          await Promise.all(deleteImagePromises);
          console.log(`Deleted ${deleteImagePromises.length} individual review images`);
          deletionStatus.reviewImagesDeleted = true;
        }
      } catch (individualDeleteError) {
        console.error('Error deleting individual review images:', individualDeleteError);
      }
    }
    
    // 3. Delete all reviews from database
    try {
      const deletedReviews = await Review.deleteMany({ productId: product._id });
      console.log(`Deleted ${deletedReviews.deletedCount} reviews for product ${product._id}`);
      deletionStatus.reviewsDeleted = true;
    } catch (reviewDeletionError) {
      console.error('Error deleting reviews from database:', reviewDeletionError);
      // Continue with deletion even if review deletion fails
    }
    
    // 4. Delete product from database
    try {
      await Product.findByIdAndDelete(req.params.id);
      console.log(`Deleted product ${product._id} from database`);
      deletionStatus.productDeleted = true;
    } catch (productDeletionError: any) {
      console.error('Error deleting product from database:', productDeletionError);
      return res.status(500).json({
        success: false,
        message: 'Server error while deleting product from database',
        error: productDeletionError.message
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Product and all associated data successfully deleted',
      deletionStatus,
      data: {}
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: error.message
    });
  }
};

// Get product by slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const product = await Product.findOne({ slug })
      .populate('categoryId', 'name imageUrl');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};

// Get related products
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    // Find related products from the same category
    const relatedProducts = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: productId },
      isActive: true
    })
    .limit(8)
    .populate('categoryId', 'name imageUrl');
    
    // If not enough related products, find more from other categories
    if (relatedProducts.length < 8) {
      const otherProducts = await Product.find({
        categoryId: { $ne: product.categoryId },
        _id: { $ne: productId },
        isActive: true
      })
      .limit(8 - relatedProducts.length)
      .populate('categoryId', 'name imageUrl');
      
      relatedProducts.push(...otherProducts);
    }
    
    return res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts,
    });
  } catch (error) {
    console.error('Error fetching related products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching related products',
    });
  }
}; 