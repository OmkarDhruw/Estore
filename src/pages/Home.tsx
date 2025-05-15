import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../components/home/HeroSlider';
import ExploreProductsSection from '../components/home/ExploreProductsSection';
import TrendingProducts from '../components/home/TrendingProducts';
import VideoGallery from '../components/home/VideoGallery';
import FeaturedCollectionsSection from '../components/home/FeaturedCollectionsSection';
import { VideoProduct, SliderItem } from '../types';
import { getFeaturedProducts } from '../data/products';

// Type for the hero slider API response
interface HeroSliderApiResponse {
  success: boolean;
  count: number;
  data: Array<{
    _id: string;
    title: string;
    subtitle: string;
    buttonLabel: string;
    redirectUrl: string;
    mediaUrl: string;
    mediaType: string;
    cloudinaryPublicId: string;
  }>;
}

// Type for the video gallery API response
interface VideoGalleryApiResponse {
  success: boolean;
  count: number;
  data: Array<{
    _id: string;
    title: string;
    description: string;
    newPrice: number;
    oldPrice: number;
    videoUrl: string;
    thumbnail: string;
    cloudinaryPublicId: string;
    socialMediaUrl: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

const Home: React.FC = () => {
  // State for hero sliders
  const [heroSliders, setHeroSliders] = useState<SliderItem[]>([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  
  // State for video gallery
  const [videos, setVideos] = useState<VideoProduct[]>([]);
  const [isVideosLoading, setIsVideosLoading] = useState(true);

  // API base URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch hero sliders from API
  useEffect(() => {
    const fetchHeroSliders = async () => {
      try {
        const response = await axios.get<HeroSliderApiResponse>(`${apiUrl}/api/hero-sliders`);
        if (response.data.success) {
          // Map the API response to the format expected by the HeroSlider component
          const mappedSliders = response.data.data.map((slider, index) => ({
            id: slider._id || index + 1,
            image: slider.mediaUrl,
            mediaType: slider.mediaType as 'image' | 'video',
            title: slider.title,
            subtitle: slider.subtitle,
            buttonText: slider.buttonLabel,
            buttonLink: slider.redirectUrl
          }));
          setHeroSliders(mappedSliders);
        }
      } catch (error) {
        console.error('Failed to fetch hero sliders:', error);
      } finally {
        setIsHeroLoading(false);
      }
    };

    fetchHeroSliders();
  }, [apiUrl]);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get<VideoGalleryApiResponse>(`${apiUrl}/api/video-gallery`);
        if (response.data.success) {
          // Map the API response to the format expected by the VideoGallery component
          const mappedVideos = response.data.data.map((item) => ({
            id: item._id,
            title: item.title,
            description: item.description,
            newPrice: item.newPrice,
            oldPrice: item.oldPrice,
            videoUrl: item.videoUrl,
            thumbnail: item.thumbnail,
            socialMediaUrl: item.socialMediaUrl
          }));
          setVideos(mappedVideos);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setIsVideosLoading(false);
      }
    };

    fetchVideos();
  }, [apiUrl]);

  // Get trending products
  const trendingProducts = getFeaturedProducts(8);
  
  return (
    <main>
      {/* Hero Slider */}
      {isHeroLoading ? (
        <div className="w-full aspect-[16/7.2] bg-gray-200 animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Loading hero slider...</p>
        </div>
      ) : heroSliders.length > 0 ? (
        <HeroSlider sliderItems={heroSliders} />
      ) : (
        <HeroSlider sliderItems={[
          {
            id: 1,
            image: "/image/hero page front image/hero FIRST Page image 1.jpg",
            title: "Premium Mobile Skins",
            subtitle: "Exclusive designs for your device",
            buttonText: "Shop Now",
            buttonLink: "/products/anime",
          }
        ]} />
      )}
      
      {/* Explore Products Section */}
      <ExploreProductsSection />
      
      {/* Trending Products */}
      <TrendingProducts products={trendingProducts} />
      
      {/* Video Gallery */}
      {isVideosLoading ? (
        <div className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Explore Here</h2>
            <div className="w-full aspect-video bg-gray-200 animate-pulse flex items-center justify-center">
              <p className="text-gray-500">Loading video gallery...</p>
            </div>
          </div>
        </div>
      ) : videos.length > 0 ? (
        <VideoGallery videos={videos} />
      ) : (
        <div className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Explore Here</h2>
            <p className="text-center text-gray-500">No videos available</p>
          </div>
        </div>
      )}
      
      {/* Featured Collections Section */}
      <FeaturedCollectionsSection />
    </main>
  );
};

export default Home;