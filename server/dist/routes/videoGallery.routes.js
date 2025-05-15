"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videoGallery_controller_1 = require("../controllers/videoGallery.controller");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// GET /api/video-gallery - Get all video items
router.get('/', videoGallery_controller_1.getAllVideoItems);
// GET /api/video-gallery/:id - Get a single video item by ID
router.get('/:id', videoGallery_controller_1.getVideoItemById);
// POST /api/video-gallery - Create a new video item
router.post('/', upload_1.uploadBase64, videoGallery_controller_1.createVideoItem);
// PUT /api/video-gallery/:id - Update a video item
router.put('/:id', upload_1.uploadBase64, videoGallery_controller_1.updateVideoItem);
// DELETE /api/video-gallery/:id - Delete a video item
router.delete('/:id', videoGallery_controller_1.deleteVideoItem);
exports.default = router;
