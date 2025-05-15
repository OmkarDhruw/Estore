"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const featuredCollection_controller_1 = require("../controllers/featuredCollection.controller");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// GET /api/featured-collections - Get all featured collections
router.get('/', featuredCollection_controller_1.getAllFeaturedCollections);
// GET /api/featured-collections/:id - Get a single featured collection by ID
router.get('/:id', featuredCollection_controller_1.getFeaturedCollectionById);
// POST /api/featured-collections - Create a new featured collection
router.post('/', upload_1.uploadBase64, featuredCollection_controller_1.createFeaturedCollection);
// PUT /api/featured-collections/:id - Update a featured collection
router.put('/:id', upload_1.uploadBase64, featuredCollection_controller_1.updateFeaturedCollection);
// DELETE /api/featured-collections/:id - Delete a featured collection
router.delete('/:id', featuredCollection_controller_1.deleteFeaturedCollection);
exports.default = router;
