import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Star, Truck, RotateCw, Shield, Heart, Share2, Clock, ChevronDown, ChevronUp, Check, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Components
import ProductImageGallery from '../components/ui/ProductImageGallery';
import QuantitySelector from '../components/ui/QuantitySelector';
import ProductDescription from '../components/ui/ProductDescription';
import VariantSelector from '../components/ui/VariantSelector';
import CustomerReviews from '../components/ui/CustomerReviews';
import ProductRelated from '../components/ui/ProductRelated';
import AddToCartButton from '../components/ui/AddToCartButton';
import ProductInfo from '../components/ui/ProductInfo';
import FeatureIcons from '../components/ui/FeatureIcons';
import RecentlyViewed from '../components/ui/RecentlyViewed';

// Context
import { useCart } from '../context/CartContext';

// Types
import { Product } from '../services/product.service';

// Define interfaces for reviews if they don't exist in types file
interface Review {
  _id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingCounts: Record<string, number>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Fetch product details
  const {
    data: product,
    isLoading: productLoading,
    error: productError
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/products/slug/${slug}`);
      return (response.data as any).data as Product;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch product reviews
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError
  } = useQuery({
    queryKey: ['reviews', product?._id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/reviews/product/${product?._id}`);
      return (response.data as any).data as Review[];
    },
    enabled: !!product?._id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch review stats
  const {
    data: reviewStats,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['reviewStats', product?._id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/reviews/stats/${product?._id}`);
      return (response.data as any).data as ReviewStats;
    },
    enabled: !!product?._id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch related products
  const {
    data: relatedProducts,
    isLoading: relatedLoading,
    error: relatedError
  } = useQuery({
    queryKey: ['relatedProducts', product?._id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/products/related/${product?._id}`);
      return (response.data as any).data as Product[];
    },
    enabled: !!product?._id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Set default selected variant
  useEffect(() => {
    if (product?.variants?.options?.length) {
      setSelectedVariant(product.variants.options[0]);
    }
  }, [product]);
  
  // Save product to recently viewed
  useEffect(() => {
    if (product?._id) {
      // Get existing recently viewed products
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      // Remove current product if it exists already (to move it to the front)
      const filteredProducts = recentlyViewed.filter((id: string) => id !== product._id);
      
      // Add current product to the beginning
      filteredProducts.unshift(product._id);
      
      // Limit to 8 products
      const limitedProducts = filteredProducts.slice(0, 8);
      
      // Save back to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(limitedProducts));
    }
  }, [product]);
  
  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addItem({
        productId: product._id,
        name: product.title,
        price: product.price,
        quantity,
        image: product.images[0],
        variant: selectedVariant
      });
      
      // Show success notification with toast
      toast.success(`Added ${quantity} ${product.title} (${selectedVariant}) to cart!`);
    } else if (!selectedVariant) {
      toast.error('Please select a variant');
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Check out this amazing product: ${product?.title}`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };
  
  // Add a ref for reviews section
  const reviewsRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to reviews
  const scrollToReviews = () => {
    setActiveTab('reviews');
    setTimeout(() => {
      if (reviewsRef.current) {
        reviewsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };
  
  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <h1 className="text-2xl font-bold text-gray-800">Loading product information...</h1>
        </div>
      </div>
    );
  }
  
  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
          <p className="mt-4 text-gray-600">Sorry, the product you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      {/* Main Product Section */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            {/* Left Column - Product Images - Adjust sticky behavior */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-24 self-start"
            >
              {/* Tags/Labels are now handled by the ProductImageGallery component */}
              
          <ProductImageGallery 
            images={product.images} 
            alt={product.title} 
            tags={product.tags}
          />
              
              {/* Premium Skin Features moved to left column */}
              <div className="mt-6 p-5 bg-indigo-50 rounded-lg min-h-[280px] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Skin Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Residue Free</h4>
                      <p className="text-sm text-gray-600">Removes cleanly without leaving residue</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="12" y1="8" x2="12" y2="16"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Precision Cutting</h4>
                      <p className="text-sm text-gray-600">Perfectly aligned with your device</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9"/>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                        <rect x="6" y="14" width="12" height="8"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">HD Printing</h4>
                      <p className="text-sm text-gray-600">Vibrant colors that won't fade</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Bubble-Free Application</h4>
                      <p className="text-sm text-gray-600">Easy to apply without air bubbles</p>
                    </div>
                  </div>
                </div>
        </div>
              
              {/* Package Contents moved to left column */}
              <div className="mt-6 border p-4 rounded-lg min-h-[280px] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Contents</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2" />
                    1 × Premium Mobile Skin for {selectedVariant ? selectedVariant : 'your selected model'}
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2" />
                    1 × Microfiber Cleaning Cloth
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2" />
                    1 × Alcohol Cleaning Wipe
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2" />
                    1 × Application Squeegee Card
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2" />
                    1 × Detailed Application Instructions
                  </li>
                </ul>
              </div>
            </motion.div>
        
        {/* Right Column - Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{product.title}</h1>
              
              {/* Rating display */}
              <div className="flex items-center mt-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star 
                      key={index}
                      size={18}
                      className={index < Math.floor(reviewStats?.averageRating || 0) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-indigo-600">
                  {reviewStats?.averageRating?.toFixed(1) || '0.0'}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <button 
                  onClick={scrollToReviews} 
                  className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {reviewStats?.totalReviews || 0} {reviewStats?.totalReviews === 1 ? 'review' : 'reviews'}
                </button>
              </div>
              
              {/* Price display */}
              <div className="mt-6 flex items-end">
                <p className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </p>
                {product.oldPrice && product.oldPrice > product.price && (
                  <>
                    <p className="ml-3 text-xl text-gray-500 line-through">
                      ₹{product.oldPrice.toFixed(2)}
                    </p>
                    <div className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                    </div>
                  </>
                )}
              </div>
              
              {/* Stock status */}
              <div className="mt-4 flex items-center">
                {product.stockStatus === 'In Stock' 
                  ? <div className="flex items-center text-green-600">
                      <Check size={16} className="mr-1" />
                      <span className="text-sm font-medium">In Stock</span>
                    </div>
                  : <div className="flex items-center text-red-600">
                      <span className="text-sm font-medium">Out of Stock - Currently unavailable</span>
                    </div>
                }
                {product.stockStatus === 'In Stock' && (
                  <div className="ml-4 flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>Order now for fast delivery</span>
                  </div>
                )}
              </div>
              
              {/* Short Description */}
              <p className="mt-6 text-gray-600 leading-relaxed">
                {product.description.split('.')[0]}. {/* Just show the first sentence */}
              </p>
              
              {/* Divider */}
              <div className="mt-8 border-t border-gray-200"></div>
              
              {/* Product options */}
              <div className="mt-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Select Your Mobile Model
                  </h3>
            <VariantSelector
              type={product.variants.type}
              options={product.variants.options}
              selected={selectedVariant}
              onChange={setSelectedVariant}
            />
          </div>
          
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
            <QuantitySelector 
              quantity={quantity} 
              onChange={setQuantity} 
              min={1} 
              max={10} 
            />
                      {product.stockStatus === 'In Stock' && 
                        <span className="ml-4 text-sm text-gray-500">Available: 10+ units</span>
                      }
                    </div>
                    <div className="ml-auto flex space-x-2">
                      <button 
                        onClick={toggleWishlist}
                        className={`flex items-center justify-center p-2 rounded-full ${
                          isWishlisted ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } transition-colors`}
                        aria-label="Add to wishlist"
                      >
                        <Heart className={isWishlisted ? 'fill-current' : ''} size={18} />
                      </button>
                      <button 
                        onClick={handleShareProduct}
                        className="flex items-center justify-center p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        aria-label="Share product"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
          </div>
          
              {/* Only Add to Cart button */}
              <button 
            onClick={handleAddToCart} 
                disabled={!selectedVariant || product.stockStatus !== 'In Stock'}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg font-medium flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              
              {/* Delivery & Support Information - Moved */}
              <div className="mt-8 border p-4 rounded-lg bg-slate-50 min-h-[280px] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery & Support Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Truck size={20} className="text-indigo-600 mr-2 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Fast Shipping</h4>
                      <p className="text-xs text-gray-500">Free on orders above ₹398</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RotateCw size={20} className="text-indigo-600 mr-2 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Easy Returns</h4>
                      <p className="text-xs text-gray-500">10 day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield size={20} className="text-indigo-600 mr-2 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Secure Checkout</h4>
                      <p className="text-xs text-gray-500">100% protected payments</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock size={20} className="text-indigo-600 mr-2 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">24/7 Support</h4>
                      <p className="text-xs text-gray-500">Dedicated customer care</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Order Processing</h4>
                  <p className="text-sm text-gray-600 mb-1">• All orders are processed and dispatched within 1-3 days</p>
                  <p className="text-sm text-gray-600">• After dispatch, delivery in Maharashtra: 2-4 days, other states: 3-7 days</p>
                </div>
          </div>
          
              {/* How to Apply Section - Moved */}
              <div className="mt-8 border p-4 rounded-lg min-h-[280px] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Apply Your Skin</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm text-gray-600">Clean your device thoroughly with alcohol wipe (included) and let it dry completely</p>
                  </div>
                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm text-gray-600">Peel off the backing layer carefully from the skin</p>
                  </div>
                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm text-gray-600">Align the skin precisely with your device and apply from one end</p>
                  </div>
                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                      4
                    </div>
                    <p className="text-sm text-gray-600">Smooth out any air bubbles with the included squeegee card</p>
                  </div>
                  <a href="/how-to-apply" className="inline-block mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    View detailed application video →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Product Tabs - Fix the review scrolling */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="flex flex-wrap md:flex-nowrap border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-3 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 flex-1 text-center md:text-left ${
                  activeTab === 'description' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                Description
              </button>
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  setTimeout(() => {
                    if (reviewsRef.current) {
                      reviewsRef.current.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }
                  }, 100);
                }}
                className={`px-3 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 flex-1 text-center md:text-left ${
                  activeTab === 'reviews' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                Reviews ({reviewStats?.totalReviews || 0})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-3 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 flex-1 text-center md:text-left ${
                  activeTab === 'shipping' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                Shipping & Returns
              </button>
      </div>
      
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-indigo max-w-none">
        <ProductDescription 
          description={product.description}
          categoryType={product.variants.type === 'mobileModel' ? 'skin' : 'clothing'}
        />
                  
                  {/* Additional skin information */}
                  {product.variants.type === 'mobileModel' && (
                    <div className="mt-8">
                      <h3>About Our Premium Mobile Skins</h3>
                      <p>
                        Our mobile skins are crafted from high-quality vinyl with advanced adhesive technology that leaves no residue upon removal. 
                        Each skin is precision-cut to perfectly fit your specific device model, ensuring all ports, buttons and cameras remain accessible.
                      </p>
                      
                      <h4 className="mt-4">Materials & Durability</h4>
                      <ul>
                        <li>Premium 3M vinyl with air-release technology</li>
                        <li>Scratch-resistant, waterproof, and durable design</li>
                        <li>UV-resistant printing prevents fading over time</li>
                        <li>Ultra-thin profile (0.2mm) maintains your device's sleek feel</li>
                        <li>Expected lifespan: 6-12 months under normal use</li>
                      </ul>
                      
                      <h4 className="mt-4">Benefits</h4>
                      <ul>
                        <li>Protects your device from minor scratches and scuffs</li>
                        <li>Express your unique style with stunning designs</li>
                        <li>Anti-slip grip reduces chance of dropping</li>
                        <li>Does not interfere with wireless charging</li>
                        <li>Easily removable without leaving any sticky residue</li>
                      </ul>
                    </div>
                  )}
      </div>
              )}
      
              {activeTab === 'reviews' && (
                <div id="reviews" ref={reviewsRef} className="scroll-mt-32">
        <CustomerReviews 
          productId={product._id}
          reviews={reviews || []}
          stats={reviewStats}
          isLoading={reviewsLoading || statsLoading}
          error={reviewsError || statsError}
        />
      </div>
              )}
              
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Information</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Shipping available all over India
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Free shipping on orders above ₹398
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Standard delivery: 5-7 working days
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Express delivery: 2-3 working days (additional charges apply)
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Cash on Delivery available
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Return Policy</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Easy 10-day return policy
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Products must be unused and in original packaging
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Refunds processed within 5-7 business days
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        Return shipping costs may apply
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductRelated 
            products={relatedProducts ? relatedProducts.map(p => p as any) : []}
            isLoading={relatedLoading}
            error={relatedError}
          />
        </div>
      </section>
      
      {/* Recently Viewed Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <RecentlyViewed currentProductId={product?._id} maxItems={4} />
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage; 