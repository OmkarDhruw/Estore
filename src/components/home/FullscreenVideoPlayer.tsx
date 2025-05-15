import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Heart, Share2, ChevronLeft, ChevronRight, X, Smartphone } from 'lucide-react';
import { VideoProduct } from '../../types';

interface FullscreenVideoPlayerProps {
  videos: VideoProduct[];
  activeVideo: number;
  isMuted: boolean;
  isLiked: number[];
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  onClose: () => void;
  setActiveVideo: (index: number) => void;
  toggleMute: () => void;
  toggleLike: (id: string | number) => void;
  handleShare: (title: string) => void;
  getVideoUrl: (url: string) => string;
}

const FullscreenVideoPlayer: React.FC<FullscreenVideoPlayerProps> = ({
  videos,
  activeVideo,
  isMuted,
  isLiked,
  videoRefs,
  onClose,
  setActiveVideo,
  toggleMute,
  toggleLike,
  handleShare,
  getVideoUrl,
}) => {
  // References to the preview videos
  const prevVideoRef = useRef<HTMLVideoElement | null>(null);
  const nextVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  
  // Check if on mobile device on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle video navigation with transitions
  const navigateToPrev = useCallback(() => {
    if (activeVideo > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTransitionDirection(isMobile ? 'down' : 'left');
      
      // Pause current video
      if (videoRefs.current[activeVideo]) {
        videoRefs.current[activeVideo]!.pause();
      }
      
      setIsLoading(true);
      
      // Apply transition then change the video
      setTimeout(() => {
        setActiveVideo(activeVideo - 1);
        // Reset transition after a short delay
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionDirection(null);
        }, 300);
      }, 300);
    }
  }, [activeVideo, setActiveVideo, videoRefs, isTransitioning, isMobile]);

  const navigateToNext = useCallback(() => {
    if (activeVideo < videos.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTransitionDirection(isMobile ? 'up' : 'right');
      
      // Pause current video
      if (videoRefs.current[activeVideo]) {
        videoRefs.current[activeVideo]!.pause();
      }
      
      setIsLoading(true);
      
      // Apply transition then change the video
      setTimeout(() => {
        setActiveVideo(activeVideo + 1);
        // Reset transition after a short delay
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionDirection(null);
        }, 300);
      }, 300);
    }
  }, [activeVideo, setActiveVideo, videoRefs, videos.length, isTransitioning, isMobile]);

  // Load and control videos when activeVideo changes
  useEffect(() => {
    // Pause all videos first
    videoRefs.current.forEach((video) => {
      if (video) video.pause();
    });
    
    // Function to load and prepare a preview video
    const preparePreviewVideo = (ref: React.RefObject<HTMLVideoElement>, videoUrl: string, thumbnail: string) => {
      if (ref.current) {
        // Reset video state
        ref.current.pause();
        ref.current.currentTime = 0;
        
        // Make sure the poster image is set
        ref.current.poster = thumbnail;
        
        // Force a reload to ensure proper loading
        const source = ref.current.querySelector('source');
        if (source) {
          source.src = getVideoUrl(videoUrl);
          ref.current.load();
          
          // Ensure preview videos are visible but remain paused
          // Do not attempt to play them
        }
      }
    };
    
    // Only handle preview videos in desktop mode
    if (!isMobile) {
      // Handle previous video preview
      if (activeVideo > 0) {
        preparePreviewVideo(
          prevVideoRef,
          videos[activeVideo - 1].videoUrl,
          videos[activeVideo - 1].thumbnail
        );
      }
      
      // Handle next video preview
      if (activeVideo < videos.length - 1) {
        preparePreviewVideo(
          nextVideoRef,
          videos[activeVideo + 1].videoUrl,
          videos[activeVideo + 1].thumbnail
        );
      }
    }
    
    // Play only the active video after a short delay
    setTimeout(() => {
      if (videoRefs.current[activeVideo]) {
        // Set poster and reload the source to ensure fresh start
        videoRefs.current[activeVideo]!.poster = videos[activeVideo].thumbnail;
        videoRefs.current[activeVideo]!.play()
          .then(() => {
            setIsLoading(false);
          })
          .catch(err => {
            console.log("Could not autoplay main video:", err);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    }, 300);
  }, [activeVideo, videoRefs, videos, getVideoUrl, isMobile]);

  // Setup swipe handlers for mobile
  useEffect(() => {
    if (!isMobile) return;
    
    let touchStartY = 0;
    let touchEndY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      touchEndY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = () => {
      const swipeDistance = touchEndY - touchStartY;
      if (swipeDistance > 70) {
        // Swipe down - go to previous video
        navigateToPrev();
      } else if (swipeDistance < -70) {
        // Swipe up - go to next video
        navigateToNext();
      }
      
      // Reset
      touchStartY = 0;
      touchEndY = 0;
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, navigateToNext, navigateToPrev]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center overflow-hidden">
      {/* Main content container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white bg-black/50 p-2 rounded-full"
        >
          <X size={24} />
        </button>
        
        {/* Mobile View */}
        {isMobile ? (
          <div className={`w-full h-full relative transition-transform duration-300 ease-in-out ${
            isTransitioning && transitionDirection === 'up' ? '-translate-y-8 opacity-80' : 
            isTransitioning && transitionDirection === 'down' ? 'translate-y-8 opacity-80' : 
            'translate-y-0 opacity-100'
          }`}>
            {/* Main Video */}
            <video
              key={`mobile-${videos[activeVideo].id}`}
              ref={(el) => {
                videoRefs.current[activeVideo] = el;
              }}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted={isMuted}
              poster={videos[activeVideo].thumbnail}
              preload="auto"
              onLoadedData={() => setIsLoading(false)}
              onEnded={() => {
                if (activeVideo < videos.length - 1) {
                  navigateToNext();
                } else {
                  if (videoRefs.current[activeVideo]) {
                    videoRefs.current[activeVideo]!.currentTime = 0;
                    videoRefs.current[activeVideo]!.play().catch(err => {
                      console.log("Could not replay video:", err);
                    });
                  }
                }
              }}
            >
              <source src={getVideoUrl(videos[activeVideo].videoUrl)} type="video/mp4" />
            </video>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Controls moved to above the text */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-20 pb-8 px-4 flex flex-col items-center z-30">
              {/* Control buttons repositioned vertically on the right */}
              <div className="absolute right-4 bottom-[calc(100%-40px)] flex flex-col items-center gap-3 z-40">
                <button onClick={toggleMute} className="text-white bg-black/60 hover:bg-black/70 rounded-full p-2.5 transition-colors">
                  {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                <button onClick={() => toggleLike(videos[activeVideo].id)} className={`${isLiked.includes(Number(videos[activeVideo].id)) ? 'text-red-500' : 'text-white'} bg-black/60 hover:bg-black/70 rounded-full p-2.5 transition-colors`}>
                  <Heart size={22} fill={isLiked.includes(Number(videos[activeVideo].id)) ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => handleShare(videos[activeVideo].title)} className="text-white bg-black/60 hover:bg-black/70 rounded-full p-2.5 transition-colors">
                  <Share2 size={22} />
                </button>
                <button onClick={() => alert('Social Media')} className="text-white bg-black/60 hover:bg-black/70 rounded-full p-2.5 transition-colors">
                  <Smartphone size={22} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-center text-white mb-1">{videos[activeVideo].title}</h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-xl font-semibold text-white">₹{videos[activeVideo].newPrice.toFixed(2)}</span>
                <span className="text-white/70 line-through ml-2 text-sm">₹{videos[activeVideo].oldPrice.toFixed(2)}</span>
              </div>
              <button className="w-full bg-white text-black py-3 rounded-lg font-bold uppercase shadow-md">
                ADD TO CART
              </button>
            </div>
          </div>
        ) : (
          /* Desktop View with three videos */
          <div className="flex items-center justify-center gap-4 w-full">
            {/* Previous Video (left side) - Always show placeholder if not available */}
            <div className="hidden md:block w-64 flex-shrink-0">
              {activeVideo > 0 ? (
                <div className="relative aspect-[9/16] w-full cursor-pointer opacity-80 scale-95 transition-transform duration-300 hover:scale-100 hover:opacity-100 border-2 border-transparent hover:border-white/50 rounded-lg" onClick={navigateToPrev}>
                  {/* Thumbnail as background for reliability */}
                  <div 
                    className="absolute inset-0 z-0 rounded-lg" 
                    style={{
                      backgroundImage: `url(${videos[activeVideo - 1].thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  
                  {/* Video overlay on top of thumbnail */}
                  <video
                    key={`prev-${videos[activeVideo - 1].id}`}
                    ref={prevVideoRef}
                    className="w-full h-full object-cover rounded-lg relative z-10 opacity-100"
                    muted
                    loop
                    playsInline
                    poster={videos[activeVideo - 1].thumbnail}
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      e.currentTarget.currentTime = 0;
                    }}
                  >
                    <source src={getVideoUrl(videos[activeVideo - 1].videoUrl)} type="video/mp4" />
                  </video>
                  {/* Overlay with reduced opacity to show content but indicate it's not active */}
                  <div className="absolute inset-0 z-20 bg-black/20 hover:bg-black/10 transition-all">
                  </div>
                </div>
              ) : (
                // Empty placeholder to maintain layout
                <div className="aspect-[9/16] w-full rounded-lg bg-gray-800 opacity-30"></div>
              )}
            </div>

            {/* Main Video (center) - desktop */}
            <div className={`flex-shrink-0 flex flex-col items-center justify-center relative max-h-[90vh] aspect-[9/16] w-64 md:w-80 lg:w-96 bg-black rounded-lg shadow-2xl z-10 transition-transform duration-300 ease-in-out ${
              isTransitioning && transitionDirection === 'left' ? 'translate-x-8 opacity-90' : 
              isTransitioning && transitionDirection === 'right' ? '-translate-x-8 opacity-90' : 
              'translate-x-0 opacity-100'
            }`}>
              {/* Thumbnail as fallback */}
              <div 
                className="absolute inset-0 z-0 rounded-lg" 
                style={{
                  backgroundImage: `url(${videos[activeVideo].thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <video
                key={`main-${videos[activeVideo].id}`}
                ref={(el) => {
                  videoRefs.current[activeVideo] = el;
                }}
                className="w-full h-full object-cover rounded-lg relative z-10"
                autoPlay
                playsInline
                muted={isMuted}
                poster={videos[activeVideo].thumbnail}
                preload="auto"
                onLoadedData={() => setIsLoading(false)}
                onEnded={() => {
                  if (activeVideo < videos.length - 1) {
                    navigateToNext();
                  } else {
                    if (videoRefs.current[activeVideo]) {
                      videoRefs.current[activeVideo]!.currentTime = 0;
                      videoRefs.current[activeVideo]!.play().catch(err => {
                        console.log("Could not replay video:", err);
                      });
                    }
                  }
                }}
              >
                <source src={getVideoUrl(videos[activeVideo].videoUrl)} type="video/mp4" />
              </video>
              
              {/* Controls moved to above the text */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-6 px-4 flex flex-col items-center z-30">
                {/* Control buttons repositioned vertically on the right */}
                <div className="absolute right-4 bottom-[calc(100%-40px)] flex flex-col items-center gap-3 z-40">
                  <button onClick={toggleMute} className="text-white bg-black/60 hover:bg-black/70 rounded-full p-2.5 transition-colors">
                    {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  </button>
                  <button onClick={() => toggleLike(videos[activeVideo].id)} className={`${isLiked.includes(Number(videos[activeVideo].id)) ? 'text-red-500' : 'text-white'} bg-black/60 hover:bg-black/70 rounded-full p-2.5 transition-colors`}>
                    <Heart size={22} fill={isLiked.includes(Number(videos[activeVideo].id)) ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => handleShare(videos[activeVideo].title)} className="text-white bg-black/60 hover:bg-black/70 rounded-full p-2.5 transition-colors">
                    <Share2 size={22} />
                  </button>
                  <button onClick={() => alert('Social Media')} className="text-white bg-black/60 hover:bg-black/70 rounded-full p-2.5 transition-colors">
                    <Smartphone size={22} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-center text-white mb-1">{videos[activeVideo].title}</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-xl font-semibold text-white">₹{videos[activeVideo].newPrice.toFixed(2)}</span>
                  <span className="text-white/70 line-through ml-2 text-sm">₹{videos[activeVideo].oldPrice.toFixed(2)}</span>
                </div>
                <button className="w-full bg-white text-black py-3 rounded-lg font-bold uppercase shadow-md">
                  ADD TO CART
                </button>
              </div>
            </div>

            {/* Next Video (right side) - Always show placeholder if not available */}
            <div className="hidden md:block w-64 flex-shrink-0">
              {activeVideo < videos.length - 1 ? (
                <div className="relative aspect-[9/16] w-full cursor-pointer opacity-80 scale-95 transition-transform duration-300 hover:scale-100 hover:opacity-100 border-2 border-transparent hover:border-white/50 rounded-lg" onClick={navigateToNext}>
                  {/* Thumbnail as background for reliability */}
                  <div 
                    className="absolute inset-0 z-0 rounded-lg" 
                    style={{
                      backgroundImage: `url(${videos[activeVideo + 1].thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  
                  {/* Video overlay on top of thumbnail */}
                  <video
                    key={`next-${videos[activeVideo + 1].id}`}
                    ref={nextVideoRef}
                    className="w-full h-full object-cover rounded-lg relative z-10 opacity-100"
                    muted
                    loop
                    playsInline
                    poster={videos[activeVideo + 1].thumbnail}
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      e.currentTarget.currentTime = 0;
                    }}
                  >
                    <source src={getVideoUrl(videos[activeVideo + 1].videoUrl)} type="video/mp4" />
                  </video>
                  {/* Overlay with reduced opacity to show content but indicate it's not active */}
                  <div className="absolute inset-0 z-20 bg-black/20 hover:bg-black/10 transition-all">
                  </div>
                </div>
              ) : (
                // Empty placeholder to maintain layout
                <div className="aspect-[9/16] w-full rounded-lg bg-gray-800 opacity-30"></div>
              )}
            </div>

            {/* Navigation Arrows - outside the three-video container for better positioning */}
            {activeVideo > 0 && (
              <button onClick={navigateToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-40">
                <ChevronLeft size={24} />
              </button>
            )}
            {activeVideo < videos.length - 1 && (
              <button onClick={navigateToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-40">
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullscreenVideoPlayer; 