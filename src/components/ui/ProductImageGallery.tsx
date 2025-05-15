import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  tags?: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, alt, tags }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  
  const autoSlideInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  useEffect(() => {
    // Start automatic slider when component mounts
    if (images.length > 1 && !isPaused && !isFullscreen) {
      // Clear any existing intervals
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      // Reset progress
      setAutoplayProgress(0);
      
      // Create new progress interval (updates 50 times during the 5 seconds)
      progressInterval.current = setInterval(() => {
        setAutoplayProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 2;
        });
      }, 100);
      
      // Create new autoplay interval
      autoSlideInterval.current = setInterval(() => {
        if (!isHovered) {
          setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
          setAutoplayProgress(0);
        }
      }, 5000);
    }
    
    // Clean up intervals on component unmount
    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [images.length, isPaused, isFullscreen, isHovered]);
  
  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsPaused(true);
    setAutoplayProgress(0);
    
    // Resume auto-sliding after 10 seconds of inactivity
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsPaused(true);
    setAutoplayProgress(0);
    
    // Resume auto-sliding after 10 seconds of inactivity
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (galleryRef.current?.requestFullscreen) {
        galleryRef.current.requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
            setIsZoomed(false);
            setIsPaused(true);
            setAutoplayProgress(0);
            
            if (autoSlideInterval.current) {
              clearInterval(autoSlideInterval.current);
            }
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
            }
          })
          .catch(err => console.error('Error attempting to enable fullscreen:', err));
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
            setTimeout(() => {
              setIsPaused(false);
            }, 1000);
          })
          .catch(err => console.error('Error attempting to exit fullscreen:', err));
      }
    }
  };
  
  return (
    <div 
      className="product-gallery"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={galleryRef}
    >
      {/* Main image with zoom */}
      <div 
        className={`relative overflow-hidden rounded-lg bg-gray-50 mb-4 ${
          isFullscreen ? 'fixed inset-0 z-50 flex items-center justify-center bg-black p-0 m-0' : ''
        }`}
        style={{ height: isFullscreen ? '100vh' : '500px' }}
      >
        {/* Tags/Labels display - Moved from left top to right top */}
        {tags && tags.length > 0 && (
          <div className="absolute top-4 right-4 z-30 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-amber-500 text-white text-sm font-semibold rounded-md shadow-md border border-amber-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Progress indicators */}
        {!isPaused && !isFullscreen && images.length > 1 && (
          <>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 z-10 h-1.5 bg-gray-200">
              <div 
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${autoplayProgress}%` }}
              />
            </div>
            
            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setIsPaused(true);
                    setAutoplayProgress(0);
                    
                    // Resume auto-sliding after 10 seconds of inactivity
                    setTimeout(() => {
                      setIsPaused(false);
                    }, 10000);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === selectedImage 
                      ? 'bg-indigo-600 w-4' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Full screen close button */}
        {isFullscreen && (
          <button 
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Navigation buttons */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white bg-opacity-75 shadow-md hover:bg-opacity-100 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </button>
        
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white bg-opacity-75 shadow-md hover:bg-opacity-100 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-gray-800" />
        </button>
        
        {/* Control buttons group - repositioned */}
        <div className="absolute bottom-12 right-4 z-10 flex flex-col space-y-2">
          {/* Pause/Play button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-full bg-white bg-opacity-75 shadow-md hover:bg-opacity-100 transition-colors"
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          {/* Zoom button */}
          <button 
            onClick={() => {
              setIsZoomed(!isZoomed);
              setIsPaused(true);
              
              if (isZoomed) {
                // Resume auto-sliding when exiting zoom after a delay
                setTimeout(() => {
                  setIsPaused(false);
                }, 1000);
              }
            }}
            className="p-2 rounded-full bg-white bg-opacity-75 shadow-md hover:bg-opacity-100 transition-colors"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? (
              <ZoomOut className="h-5 w-5 text-gray-800" />
            ) : (
              <ZoomIn className="h-5 w-5 text-gray-800" />
            )}
          </button>
        </div>
        
        {/* Fullscreen button (only show when not in fullscreen) */}
        {!isFullscreen && (
          <button 
            onClick={toggleFullscreen}
            className="absolute bottom-12 left-4 z-10 p-2 rounded-full bg-white bg-opacity-75 shadow-md hover:bg-opacity-100 transition-colors"
            aria-label="View fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        )}

        {/* Image container - adjusted to remove white space */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full h-full ${isFullscreen ? 'flex items-center justify-center' : ''}`}
            onMouseEnter={!isFullscreen ? () => {} : undefined}
            onMouseLeave={!isFullscreen ? () => setIsZoomed(false) : undefined}
        onMouseMove={handleMouseMove}
      >
        <div 
              className={`w-full h-full transition-transform duration-200 ease-out ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
          style={{
            backgroundImage: `url(${images[selectedImage]})`,
            backgroundPosition: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                backgroundSize: 'cover', // Changed from 'contain' to 'cover' to fill the container
            backgroundRepeat: 'no-repeat',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          }}
        />
          </motion.div>
        </AnimatePresence>

        {/* Image counter - moved from right top to left top due to tags position change */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
          {selectedImage + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      <div className="grid grid-cols-5 gap-2 px-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedImage(index);
              setIsPaused(true);
              setAutoplayProgress(0);
              
              // Resume auto-sliding after 10 seconds of inactivity
              setTimeout(() => {
                setIsPaused(false);
              }, 10000);
            }}
            className={`relative rounded-md overflow-hidden h-16 w-full border-2 transition-all
              ${index === selectedImage 
                ? 'border-indigo-500 shadow-md scale-105' 
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img 
              src={image} 
              alt={`${alt} thumbnail ${index + 1}`} 
              className="h-full w-full object-cover"
            />
            {index === selectedImage && (
              <div className="absolute inset-0 bg-indigo-500 bg-opacity-10"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery; 