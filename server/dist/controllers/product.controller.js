"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const cloudinary_1 = require("../config/cloudinary");
// Generate a filename for Cloudinary based on product title
const generateFilename = (productTitle) => {
    const sanitizedTitle = productTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    return `${sanitizedTitle}-${timestamp}`;
};
// Get all products
const getAllProducts = async (req, res) => {
    try {
        // Optional query parameter for category filtering
        const categoryId = req.query.categoryId;
        // Build query
        const query = categoryId ? { categoryId } : {};
        // Fetch products with category populated
        const products = await Product_1.default.find(query)
            .populate('categoryId', 'name imageUrl')
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    }
    catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching products',
        });
    }
};
exports.getAllProducts = getAllProducts;
// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id)
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
    }
    catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching product',
        });
    }
};
exports.getProductById = getProductById;
// Create new product
const createProduct = async (req, res) => {
    try {
        const { title, description, price, oldPrice, categoryId, parentPage, media } = req.body;
        if (!title || !description || price === undefined || !categoryId || !parentPage || !media) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }
        // Generate slug from title
        const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        // Check if slug is unique
        const existingProduct = await Product_1.default.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'A product with this name already exists. Please choose a different name.',
            });
        }
        // Check if the category exists
        const category = await Category_1.default.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        // Generate folder path and filename for Cloudinary
        const folderPath = `products/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/products`;
        const filename = generateFilename(title);
        // Upload media to Cloudinary
        const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, folderPath, filename);
        // Create new product in database
        const product = await Product_1.default.create({
            title,
            slug,
            description,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : undefined,
            categoryId,
            parentPage,
            imageUrl: uploadResult.url,
            cloudinaryPublicId: uploadResult.publicId,
        });
        // Populate category information
        const populatedProduct = await Product_1.default.findById(product._id)
            .populate('categoryId', 'name imageUrl');
        return res.status(201).json({
            success: true,
            data: populatedProduct,
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating product',
        });
    }
};
exports.createProduct = createProduct;
// Update product
const updateProduct = async (req, res) => {
    try {
        const { title, description, price, oldPrice, categoryId, parentPage, media } = req.body;
        const productId = req.params.id;
        // Find existing product
        const existingProduct = await Product_1.default.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        // Check if the category exists if it's changing
        if (categoryId && categoryId !== existingProduct.categoryId.toString()) {
            const category = await Category_1.default.findById(categoryId);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            }
        }
        // Prepare update data
        const updateData = {
            title: title || existingProduct.title,
            description: description || existingProduct.description,
            parentPage: parentPage || existingProduct.parentPage,
        };
        // Update slug if title is changing
        if (title && title !== existingProduct.title) {
            const newSlug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
            // Check if the new slug is unique
            const slugExists = await Product_1.default.findOne({
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
        // If there's new media, upload it and update media-related fields
        if (media) {
            // Delete old media from Cloudinary
            await (0, cloudinary_1.deleteFromCloudinary)(existingProduct.cloudinaryPublicId, 'image');
            // Get the category for folder structure
            const category = await Category_1.default.findById(categoryId || existingProduct.categoryId);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            }
            // Generate folder path and filename for Cloudinary
            const folderPath = `products/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/products`;
            const filename = generateFilename(updateData.title || existingProduct.title);
            // Upload new media to Cloudinary
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, folderPath, filename);
            // Update media-related fields
            updateData.imageUrl = uploadResult.url;
            updateData.cloudinaryPublicId = uploadResult.publicId;
        }
        // Update product in database
        const updatedProduct = await Product_1.default.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true }).populate('categoryId', 'name imageUrl');
        return res.status(200).json({
            success: true,
            data: updatedProduct,
        });
    }
    catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating product',
        });
    }
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (req, res) => {
    try {
        // Find the product to be deleted
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        // Delete media from Cloudinary
        await (0, cloudinary_1.deleteFromCloudinary)(product.cloudinaryPublicId, 'image');
        // Delete product from database
        await Product_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting product',
        });
    }
};
exports.deleteProduct = deleteProduct;
