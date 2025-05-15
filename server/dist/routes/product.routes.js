"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// GET /api/products - Get all products
router.get('/', product_controller_1.getAllProducts);
// GET /api/products/:id - Get a single product by ID
router.get('/:id', product_controller_1.getProductById);
// POST /api/products - Create a new product
router.post('/', upload_1.uploadBase64, product_controller_1.createProduct);
// PUT /api/products/:id - Update a product
router.put('/:id', upload_1.uploadBase64, product_controller_1.updateProduct);
// DELETE /api/products/:id - Delete a product
router.delete('/:id', product_controller_1.deleteProduct);
exports.default = router;
