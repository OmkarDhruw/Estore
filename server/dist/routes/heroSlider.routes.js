"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const heroSlider_controller_1 = require("../controllers/heroSlider.controller");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// GET /api/hero-sliders - Get all hero sliders
router.get('/', heroSlider_controller_1.getAllHeroSliders);
// GET /api/hero-sliders/:id - Get a single hero slider by ID
router.get('/:id', heroSlider_controller_1.getHeroSliderById);
// POST /api/hero-sliders - Create a new hero slider
router.post('/', upload_1.uploadBase64, heroSlider_controller_1.createHeroSlider);
// PUT /api/hero-sliders/:id - Update a hero slider
router.put('/:id', upload_1.uploadBase64, heroSlider_controller_1.updateHeroSlider);
// DELETE /api/hero-sliders/:id - Delete a hero slider
router.delete('/:id', heroSlider_controller_1.deleteHeroSlider);
exports.default = router;
