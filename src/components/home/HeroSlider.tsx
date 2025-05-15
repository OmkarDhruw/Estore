import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SliderItem } from '../../types';

interface HeroSliderProps {
  sliderItems: SliderItem[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ sliderItems }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const autoSlideTimerRef = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderItems.length - 1 : prev - 1));
  };

  // Setup auto slide timer with proper cleanup
  const setupAutoSlideTimer = () => {
    // Clear any existing timer
    if (autoSlideTimerRef.current !== null) {
      window.clearTimeout(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }

    // Set default slide duration for images
    const defaultDuration = 5000; // 5 seconds for images

    // If current slide is a video, use its duration as the timer
    const currentItem = sliderItems[currentSlide];
    if (currentItem?.mediaType === 'video') {
      // Don't set a timer - we'll move to next slide on video ended event
      return;
    }

    // Set timer for non-video content
    autoSlideTimerRef.current = window.setTimeout(() => {
      nextSlide();
    }, defaultDuration);
  };

  // Reset and setup auto-slide timer when slide changes
  useEffect(() => {
    setupAutoSlideTimer();

    // Clean up on unmount
    return () => {
      if (autoSlideTimerRef.current !== null) {
        window.clearTimeout(autoSlideTimerRef.current);
        autoSlideTimerRef.current = null;
      }
    };
  }, [currentSlide, sliderItems]);

  // Handle slide change to play/pause videos
  useEffect(() => {
    // Pause all videos first
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });

    // Play the current video if it exists
    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo && sliderItems[currentSlide]?.mediaType === 'video') {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(error => {
        console.error('Error playing video:', error);
        // If video fails to play, still advance the slider after a delay
        autoSlideTimerRef.current = window.setTimeout(nextSlide, 5000);
      });
    }
  }, [currentSlide, sliderItems]);

  const handleImageError = (index: number) => {
    console.error(`Failed to load image: ${sliderItems[index].image}`);
    setImageErrors(prev => ({...prev, [index]: true}));
  };

  // Handler for video end event
  const handleVideoEnded = () => {
    nextSlide();
  };

  return (
    <div
      className="relative overflow-hidden flex justify-center items-center mx-auto w-full max-w-screen-2xl aspect-[16/7.2] sm:aspect-[16/7.2] md:aspect-[16/7.2]"
      style={{ maxWidth: '2560px' }}
    >
      {/* Slider */}
      <div
        className="transition-transform duration-500 ease-in-out flex h-full w-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)`, width: `${sliderItems.length * 100}%` }}
      >
        {sliderItems.map((item, index) => (
          <div
            key={item.id}
            className="w-full h-full flex-shrink-0 relative flex justify-center items-center"
          >
            {/* Media - Image or Video */}
            {item.mediaType === 'video' ? (
              <video
                ref={el => {
                  videoRefs.current[index] = el;
                }}
                src={item.image}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ aspectRatio: '16/9', width: '100%', height: '100%', maxWidth: '2560px', display: 'block' }}
                muted
                playsInline
                onEnded={index === currentSlide ? handleVideoEnded : undefined}
              />
            ) : (
              <img
                src={imageErrors[index] ? '/image/placeholder.jpg' : item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ aspectRatio: '16/9', width: '100%', height: '100%', maxWidth: '2560px', display: 'block' }}
                onError={() => handleImageError(index)}
              />
            )}

            {/* Text Overlay - Left Side */}
            <div className="absolute inset-0 flex items-center justify-start z-20 px-4 sm:px-6 md:px-16 w-full h-full">
              <div className="max-w-3xl w-full text-left">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-pink-500 mb-2 md:mb-3">
                  {item.title}
                </h2>
                <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-medium text-white mb-3 md:mb-5">
                  {item.subtitle}
                </p>
                <Link
                  to={item.buttonLink}
                  className="inline-block bg-pink-500 text-white hover:bg-pink-600 transition-colors px-4 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 rounded-md text-base sm:text-lg md:text-xl font-medium shadow-md"
                >
                  {item.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on Small Screens */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-pink-500 p-1.5 rounded-full hover:bg-white/90 transition-colors z-10 hidden sm:block"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 md:w-5 md:h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-pink-500 p-1.5 rounded-full hover:bg-white/90 transition-colors z-10 hidden sm:block"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 md:w-5 md:h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 flex justify-center gap-1 sm:gap-1.5 z-10">
        {sliderItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
              currentSlide === index ? 'bg-pink-500' : 'bg-pink-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;