"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const Product_1 = __importDefault(require("../models/Product"));
const cloudinary_1 = require("../config/cloudinary");
// Generate a filename for Cloudinary based on category name
const generateFilename = (categoryName) => {
    const sanitizedName = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `category-image`;
};
// Generate a slug from a name
const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
};
// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching categories',
        });
    }
};
exports.getAllCategories = getAllCategories;
// Get single category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category_1.default.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        console.error('Error fetching category:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching category',
        });
    }
};
exports.getCategoryById = getCategoryById;
// Create new category
const createCategory = async (req, res) => {
    try {
        const { name, parentPage, media } = req.body;
        if (!name || !parentPage || !media) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }
        // Generate slug from name
        const slug = generateSlug(name);
        // Check if category already exists by name or slug
        const existingCategory = await Category_1.default.findOne({
            $or: [{ name }, { slug }]
        });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists',
            });
        }
        // Generate folder path and filename for Cloudinary
        const folderPath = `products/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const filename = generateFilename(name);
        // Upload media to Cloudinary
        const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, folderPath, filename);
        // Create new category in database
        const category = await Category_1.default.create({
            name,
            slug,
            parentPage,
            imageUrl: uploadResult.url,
            cloudinaryPublicId: uploadResult.publicId,
        });
        return res.status(201).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating category',
        });
    }
};
exports.createCategory = createCategory;
// Update category
const updateCategory = async (req, res) => {
    try {
        const { name, parentPage, media } = req.body;
        const categoryId = req.params.id;
        // Find existing category
        const existingCategory = await Category_1.default.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        // Generate new slug if name is changed
        let slug = existingCategory.slug;
        let oldFolderPath = '';
        let newFolderPath = '';
        let isFolderPathChanged = false;
        if (name && name !== existingCategory.name) {
            slug = generateSlug(name);
            // Check if new slug already exists (if slug is being changed)
            const duplicateSlug = await Category_1.default.findOne({
                slug,
                _id: { $ne: categoryId }
            });
            if (duplicateSlug) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists',
                });
            }
            // If name is changing, we need to update the folder path in Cloudinary
            oldFolderPath = `products/${existingCategory.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            newFolderPath = `products/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            isFolderPathChanged = true;
        }
        // Check if new name already exists (if name is being changed)
        if (name && name !== existingCategory.name) {
            const duplicateName = await Category_1.default.findOne({
                name,
                _id: { $ne: categoryId }
            });
            if (duplicateName) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists',
                });
            }
        }
        // Prepare update data
        const updateData = {
            name: name || existingCategory.name,
            slug,
            parentPage: parentPage || existingCategory.parentPage,
        };
        // If there's new media, upload it and update media-related fields
        if (media) {
            // Delete old media from Cloudinary
            await (0, cloudinary_1.deleteFromCloudinary)(existingCategory.cloudinaryPublicId, 'image');
            // Generate folder path and filename for Cloudinary
            const folderPath = isFolderPathChanged ? newFolderPath : `products/${existingCategory.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            const filename = generateFilename(name || existingCategory.name);
            // Upload new media to Cloudinary
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(media, folderPath, filename);
            // Update media-related fields
            updateData.imageUrl = uploadResult.url;
            updateData.cloudinaryPublicId = uploadResult.publicId;
        }
        // Update category in database
        const updatedCategory = await Category_1.default.findByIdAndUpdate(categoryId, updateData, { new: true, runValidators: true });
        // If the folder path has changed and there was no new media,
        // we need to manually update the existing folder contents
        if (isFolderPathChanged && !media) {
            // Note: Since Cloudinary doesn't support folder renaming directly,
            // we would need to re-upload all assets or update URLs in the database.
            // For simplicity, we'll log this and recommend a manual operation
            // or implement a background job for this in a production environment.
            console.log(`Category name changed from ${existingCategory.name} to ${name}. Cloudinary folder path should be updated from ${oldFolderPath} to ${newFolderPath}.`);
        }
        return res.status(200).json({
            success: true,
            data: updatedCategory,
        });
    }
    catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating category',
        });
    }
};
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = async (req, res) => {
    try {
        // Find the category to be deleted
        const category = await Category_1.default.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        // Generate folder path for Cloudinary
        const folderPath = `products/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        // Find all products with this category
        const products = await Product_1.default.find({ categoryId: req.params.id });
        // Delete all associated products and their images
        for (const product of products) {
            // Delete product image from Cloudinary
            await (0, cloudinary_1.deleteFromCloudinary)(product.cloudinaryPublicId, 'image');
            // Delete product from database
            await Product_1.default.findByIdAndDelete(product._id);
        }
        // Delete category image from Cloudinary
        await (0, cloudinary_1.deleteFromCloudinary)(category.cloudinaryPublicId, 'image');
        // Delete the entire category folder from Cloudinary
        await (0, cloudinary_1.deleteCloudinaryFolder)(folderPath);
        // Delete category from database
        await Category_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Category and all associated products deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting category',
        });
    }
};
exports.deleteCategory = deleteCategory;
