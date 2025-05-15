"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const heroSlider_routes_1 = __importDefault(require("./routes/heroSlider.routes"));
const exploreProduct_routes_1 = __importDefault(require("./routes/exploreProduct.routes"));
const videoGallery_routes_1 = __importDefault(require("./routes/videoGallery.routes"));
const featuredCollection_routes_1 = __importDefault(require("./routes/featuredCollection.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5177', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5177'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '150mb' })); // Increase limit for base64 videos
app.use(express_1.default.urlencoded({ extended: true, limit: '150mb' }));
// API test route
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is working correctly', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/hero-sliders', heroSlider_routes_1.default);
app.use('/api/explore-products', exploreProduct_routes_1.default);
app.use('/api/video-gallery', videoGallery_routes_1.default);
app.use('/api/featured-collections', featuredCollection_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/products', product_routes_1.default);
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '../dist', 'index.html'));
    });
}
// Connect to MongoDB and start server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ahjaahaj601:OVONNDUWaIiY30Hx@ecommerce2.ci70dgn.mongodb.net/?retryWrites=true&w=majority&appName=ECOMMERCE2';
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
});
exports.default = app;
