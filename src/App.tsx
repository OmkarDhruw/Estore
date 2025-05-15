import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Auth } from './pages/Auth';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import AdminFallback from './components/admin/AdminFallback';
import TestAdminPage from './components/admin/TestAdminPage';
import Dashboard from './pages/admin/Dashboard';
import HeroSliderPage from './pages/admin/HeroSliderPage';
import ExploreProductsPage from './pages/admin/ExploreProductsPage';
import VideoGalleryPage from './pages/admin/VideoGalleryPage';
import FeaturedCollectionsPage from './pages/admin/FeaturedCollectionsPage';
import CategoryProductsPage from './components/admin/CategoryProductsPage';
import SimpleAdminLayout from './components/admin/SimpleAdminLayout';
import MongoDBTest from './components/admin/MongoDBTest';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen bg-white">
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="hero-slider" element={<HeroSliderPage />} />
                  <Route path="explore-products" element={<ExploreProductsPage />} />
                  <Route path="video-gallery" element={<VideoGalleryPage />} />
                  <Route path="featured-collections" element={<FeaturedCollectionsPage />} />
                  <Route path="category-products" element={<CategoryProductsPage />} />
                </Route>
                
                {/* Admin Routes - Simple Version */}
                <Route path="/simple-admin" element={<SimpleAdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="hero-slider" element={<HeroSliderPage />} />
                  <Route path="explore-products" element={<ExploreProductsPage />} />
                  <Route path="video-gallery" element={<VideoGalleryPage />} />
                  <Route path="featured-collections" element={<FeaturedCollectionsPage />} />
                  <Route path="category-products" element={<CategoryProductsPage />} />
                </Route>
                
                {/* Admin Test Routes */}
                <Route path="/admin-debug" element={<AdminFallback />} />
                <Route path="/admin-test" element={<TestAdminPage />} />
                <Route path="/mongodb-test" element={<MongoDBTest />} />
                
                {/* Customer Routes */}
                <Route path="/" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <Home />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/auth" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <Auth />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/product/:slug" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <ProductDetailPage />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/products/:slug" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <ProductsPage />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/collections/:slug" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <ProductsPage />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/collections" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <CategoriesPage />
                    </main>
                    <Footer />
                  </>
                } />
                
                {/* Catch-all route - redirect to home */}
                <Route path="*" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <div className="container mx-auto p-8 text-center">
                        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </div>
            <Toaster position="top-right" />
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;