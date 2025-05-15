import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import heroSliderRoutes from './routes/heroSlider.routes';
import exploreProductRoutes from './routes/exploreProduct.routes';
import videoGalleryRoutes from './routes/videoGallery.routes';
import featuredCollectionRoutes from './routes/featuredCollection.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import reviewRoutes from './routes/review.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  // In development, allow all origins
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5177', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5177']
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '150mb' })); // Increase limit for base64 videos
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

// API test route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is working correctly', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/hero-sliders', heroSliderRoutes);
app.use('/api/explore-products', exploreProductRoutes);
app.use('/api/video-gallery', videoGalleryRoutes);
app.use('/api/featured-collections', featuredCollectionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Connect to MongoDB and start server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ahjaahaj601:OVONNDUWaIiY30Hx@ecommerce2.ci70dgn.mongodb.net/?retryWrites=true&w=majority&appName=ECOMMERCE2';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

export default app; 