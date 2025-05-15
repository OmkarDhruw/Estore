"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exploreProduct_controller_1 = require("../controllers/exploreProduct.controller");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// GET /api/explore-products - Get all explore products
router.get('/', exploreProduct_controller_1.getAllExploreProducts);
// GET /api/explore-products/:id - Get a single explore product by ID
router.get('/:id', exploreProduct_controller_1.getExploreProductById);
// POST /api/explore-products - Create a new explore product
router.post('/', upload_1.uploadBase64, exploreProduct_controller_1.createExploreProduct);
// PUT /api/explore-products/:id - Update an explore product
router.put('/:id', upload_1.uploadBase64, exploreProduct_controller_1.updateExploreProduct);
// DELETE /api/explore-products/:id - Delete an explore product
router.delete('/:id', exploreProduct_controller_1.deleteExploreProduct);
exports.default = router;
