"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// GET /api/categories - Get all categories
router.get('/', category_controller_1.getAllCategories);
// GET /api/categories/:id - Get a single category by ID
router.get('/:id', category_controller_1.getCategoryById);
// POST /api/categories - Create a new category
router.post('/', upload_1.uploadBase64, category_controller_1.createCategory);
// PUT /api/categories/:id - Update a category
router.put('/:id', upload_1.uploadBase64, category_controller_1.updateCategory);
// DELETE /api/categories/:id - Delete a category
router.delete('/:id', category_controller_1.deleteCategory);
exports.default = router;
