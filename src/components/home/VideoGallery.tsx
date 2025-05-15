import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoProduct } from '../../types';
import FullscreenVideoPlayer from './FullscreenVideoPlayer';

interface VideoGalleryProps {
  videos: VideoProduct[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState<number[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visibleVideos, setVisibleVideos] = useState<number[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [timestamp] = useState(() => Date.now()); // Create a timestamp to prevent caching
  
  // Add timestamp to video URL to prevent caching
  const getVideoUrl = useCallback((url: string) => {
    // Check if URL already has query parameters
    return `${url}${url.includes('?') ? '&' : '?'}t=${timestamp}`;
  }, [timestamp]);

  // Setup intersection observer for lazy loading videos
  useEffect(() => {
    // Setup IntersectionObserver to detect when videos are visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Get the index from the data attribute
          const target = entry.target as HTMLElement;
          const index = parseInt(target.dataset.index || '0', 10);
          
          if (entry.isIntersecting) {
            // Add this index to visible videos
            setVisibleVideos(prev => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
            
            // Start loading and potentially playing the video
            const video = videoRefs.current[index];
            if (video && !isFullscreen) {
              // Make sure the video has its source loaded
              const source = video.querySelector('source');
              if (source && !source.src) {
                source.src = getVideoUrl(videos[index].videoUrl);
                video.load();
              }
              
              // Try to play the video
              setTimeout(() => {
                if (video && !isFullscreen) {
                  video.play().catch(err => {
                    console.log("Auto-play prevented:", err);
                  });
                }
              }, 100);
            }
          } else {
            // Remove from visible videos 
            setVisibleVideos(prev => prev.filter(i => i !== index));
            
            // Optionally pause the video that's no longer visible
            const video = videoRefs.current[index];
            if (video && !isFullscreen) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );
    
    // Observe all video containers
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach((container) => {
      if (observerRef.current) {
        observerRef.current.observe(container);
      }
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos, getVideoUrl, isFullscreen]);

  // Handle page visibility changes (tab switch, etc.)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isFullscreen) {
        // Pause all videos when page is hidden
        videoRefs.current.forEach((video, index) => {
          if (video && visibleVideos.includes(index)) {
            video.pause();
          }
        });
      } else if (!document.hidden && !isFullscreen) {
        // Play visible videos when page becomes visible (if not in fullscreen)
        visibleVideos.forEach(index => {
          const video = videoRefs.current[index];
          if (video) {
            video.play().catch(err => console.log("Auto-play prevented:", err));
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isFullscreen, visibleVideos]);

  const handleVideoPlay = (index: number) => {
    // Ensure video is loaded before entering fullscreen
    const video = videoRefs.current[index];
    if (video) {
      // Make sure source is loaded
      const source = video.querySelector('source');
      if (source && !source.src) {
        source.src = getVideoUrl(videos[index].videoUrl);
        video.load();
      }
      
      // Pause all videos in the gallery when entering fullscreen mode
      videoRefs.current.forEach((videoEl) => {
        if (videoEl) {
          videoEl.pause();
        }
      });
      
      // Ready the active video for fullscreen with preloading
      video.poster = videos[index].thumbnail;
      video.currentTime = 0;
      
      // Set state before starting playback
      setActiveVideo(index);
      setIsFullscreen(true);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (activeVideo !== null && videoRefs.current[activeVideo]) {
      videoRefs.current[activeVideo]!.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = (id: string | number) => {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (isLiked.includes(numericId)) {
      setIsLiked(isLiked.filter(item => item !== numericId));
    } else {
      setIsLiked([...isLiked, numericId]);
    }
  };

  const handleShare = (title: string) => {
    alert(`Sharing ${title}`);
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsPlaying(false);
    
    // Pause the active video that was in fullscreen
    if (activeVideo !== null && videoRefs.current[activeVideo]) {
      videoRefs.current[activeVideo]!.pause();
    }
    
    // Resume playing visible videos in the gallery
    setTimeout(() => {
      visibleVideos.forEach(index => {
        const video = videoRefs.current[index];
        if (video) {
          video.play().catch(err => console.log("Auto-play prevented:", err));
        }
      });
    }, 300);
    
    setActiveVideo(null);
  };

  // Preload videos when user hovers over them
  const handleVideoHover = (index: number) => {
    const video = videoRefs.current[index];
    if (video && !isFullscreen) {
      // Make sure source is loaded
      const source = video.querySelector('source');
      if (source && !source.src) {
        source.src = getVideoUrl(videos[index].videoUrl);
        video.load();
      }
      
      // Try to play on hover
      video.play().catch(err => console.log("Auto-play prevented on hover:", err));
    }
  };

  return (
    <section className="py-8 md:py-12 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Explore Here</h2>
        
        <div className="relative">
          <button 
            onClick={scrollLeft}
            className="absolute -left-5 md:-left-10 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 md:p-4 rounded-full shadow-lg hover:bg-white"
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} />
          </button>
          
          <div 
            ref={containerRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4 px-1 md:px-2 -mx-1 md:-mx-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video, index) => (
              <div key={video.id} className="min-w-[80%] md:min-w-[300px] snap-center bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="relative aspect-[9/16] cursor-pointer rounded-t-lg overflow-hidden video-container"
                  onClick={() => handleVideoPlay(index)}
                  onMouseEnter={() => handleVideoHover(index)}
                  data-index={index}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    className="w-full h-full object-cover"
                    poster={video.thumbnail}
                    muted
                    loop
                    playsInline
                    preload="none" // Change to lazy loading
                  >
                    {/* Only set source when video is visible */}
                    {visibleVideos.includes(index) && (
                      <source src={getVideoUrl(video.videoUrl)} type="video/mp4" />
                    )}
                  </video>
                  
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {index % 2 === 0 ? '3K' : '4K'}
                  </div>
                  
                  {(!isPlaying || activeVideo !== index) && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="rounded-full bg-white/30 p-4">
                        <Play size={24} className="text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Product Info Overlay - directly on video with transparent background */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-4 px-3 flex flex-col items-center z-10">
                    <h3 className="font-medium text-sm md:text-base text-white text-center">{video.title}</h3>
                    <div className="flex items-center justify-center mt-1 mb-2">
                      <span className="text-base md:text-lg font-semibold text-white">₹{video.newPrice.toFixed(2)}</span>
                      <span className="text-white/70 line-through ml-2 text-xs md:text-sm">₹{video.oldPrice.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-white text-black py-2 md:py-3 rounded font-bold uppercase text-sm md:text-base shadow">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={scrollRight}
            className="absolute -right-5 md:-right-10 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 md:p-4 rounded-full shadow-lg hover:bg-white"
            aria-label="Scroll right"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* Fullscreen Video View */}
      {isFullscreen && activeVideo !== null && (
        <FullscreenVideoPlayer 
          videos={videos}
          activeVideo={activeVideo}
          isMuted={isMuted}
          isLiked={isLiked}
          videoRefs={videoRefs}
          onClose={closeFullscreen}
          setActiveVideo={setActiveVideo}
          toggleMute={toggleMute}
          toggleLike={toggleLike}
          handleShare={handleShare}
          getVideoUrl={getVideoUrl}
        />
      )}
    </section>
  );
};

export default VideoGallery;