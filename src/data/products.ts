import { Product, Category, VideoProduct, SliderItem } from '../types';
import { categories } from './categories';

export const products: Product[] = [
  {
    id: '1',
    name: 'Jujutsu Kaisen - Itadori Yuji Mobile Skin',
    slug: 'jujutsu-kaisen-itadori-yuji-mobile-skin',
    images: [
      'https://m.media-amazon.com/images/I/61Rr7M+29rL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61VQpuXFGEL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61SuCdEFf9L._SL1500_.jpg'
    ],
    price: 199,
    originalPrice: 350,
    rating: 4.8,
    reviewCount: 175,
    category: 'anime',
    isOnSale: true,
    compatibility: [
      'iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
      'Samsung S22', 'Samsung S22 Ultra', 'Samsung S23', 'Samsung S23 Ultra'
    ],
    isFeatured: true
  },
  {
    id: '2',
    name: 'One Piece Mobile Skin',
    slug: 'one-piece-mobile-skin',
    images: [
      'https://m.media-amazon.com/images/I/71eOX4prtwL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71JIHXlnYTL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/718xHbJvGZL._SL1500_.jpg'
    ],
    price: 199,
    originalPrice: 350,
    rating: 4.5,
    reviewCount: 16,
    category: 'anime',
    isOnSale: true,
    compatibility: [
      'iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
      'Samsung S22', 'Samsung S22 Ultra', 'Samsung S23', 'Samsung S23 Ultra'
    ],
    isFeatured: true
  },
  {
    id: '3',
    name: 'Toji Fushiguro Sorcerer Killer Mobile Skin',
    slug: 'toji-fushiguro-sorcerer-killer-mobile-skin',
    images: [
      'https://m.media-amazon.com/images/I/61RrFyZwk-L._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61y6Kcl-tDL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61EIPu4VLOL._SL1500_.jpg'
    ],
    price: 199,
    originalPrice: 350,
    rating: 4.8,
    reviewCount: 26,
    category: 'anime',
    isOnSale: true,
    compatibility: [
      'iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
      'Samsung S22', 'Samsung S22 Ultra', 'Samsung S23', 'Samsung S23 Ultra'
    ],
    isFeatured: true
  },
  {
    id: '4',
    name: 'Demonslayer Nezuko Anime Mobile Skin',
    slug: 'demonslayer-nezuko-anime-mobile-skin',
    images: [
      'https://m.media-amazon.com/images/I/61WlQrCqHaL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71WKvmqjCDL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61qpKQrw97L._SL1500_.jpg'
    ],
    price: 199,
    originalPrice: 350,
    rating: 4.6,
    reviewCount: 38,
    category: 'anime',
    isOnSale: true,
    compatibility: [
      'iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
      'Samsung S22', 'Samsung S22 Ultra', 'Samsung S23', 'Samsung S23 Ultra'
    ],
    isFeatured: true
  },
  {
    id: '5',
    name: 'Attack on Titan Laptop Skin',
    slug: 'attack-on-titan-laptop-skin',
    images: [
      'https://m.media-amazon.com/images/I/71CkWWP8hKL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71PvHfU+pwL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71hkGxnb23L._SL1500_.jpg'
    ],
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviewCount: 42,
    category: 'anime',
    isOnSale: true,
    compatibility: [
      'MacBook Air 13"', 'MacBook Pro 13"', 'MacBook Pro 14"', 'MacBook Pro 16"',
      'Dell XPS 13"', 'Dell XPS 15"', 'HP Spectre x360', 'Lenovo ThinkPad X1'
    ],
    isFeatured: true
  },
  {
    id: '6',
    name: 'Naruto Uzumaki Mobile Skin',
    slug: 'naruto-uzumaki-mobile-skin',
    images: [
      'https://m.media-amazon.com/images/I/61GJxzJRDDL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61KyZ3QOy8L._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61GrbDX6dVL._SL1500_.jpg'
    ],
    price: 199,
    originalPrice: 350,
    rating: 4.7,
    reviewCount: 56,
    category: 'anime',
    isOnSale: true,
    compatibility: [
      'iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
      'Samsung S22', 'Samsung S22 Ultra', 'Samsung S23', 'Samsung S23 Ultra'
    ],
    isFeatured: true
  },
  {
    id: '7',
    name: 'Hunter x Hunter Mobile Skin',
    slug: 'hunter-x-hunter-mobile-skin',
    images: [
      'https://m.media-amazon.com/images/I/71sJKLqwU-L._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71ZKXHyPr-L._SL1500_.jpg', 
      'https://m.media-amazon.com/images/I/71sJKLqwU-L._SL1500_.jpg'
    ],
    price: 199,
    originalPrice: 350,
    rating: 4.5,
    reviewCount: 28,
    category: 'anime',
    isOnSale: true,
    compatibility: [
      'iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
      'Samsung S22', 'Samsung S22 Ultra', 'Samsung S23', 'Samsung S23 Ultra'
    ],
    isFeatured: true
  },
  {
    id: '8',
    name: 'My Hero Academia Mobile Skin',
    slug: 'my-hero-academia-mobile-skin',
    images: [
      'https://m.media-amazon.com/images/I/719v3YQzDyL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61-nLiD2NHL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61-Zr2eANOL._SL1500_.jpg'
    ],
    price: 199,
    originalPrice: 350,
    rating: 4.6,
    reviewCount: 32,
    category: 'anime',
    isOnSale: true,
    compatibility: [
      'iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
      'Samsung S22', 'Samsung S22 Ultra', 'Samsung S23', 'Samsung S23 Ultra'
    ],
    isFeatured: true
  }
];

export const videoProducts: VideoProduct[] = [
  {
    id: 1,
    title: "How to Apply Mobile Skin",
    price: 199,
    videoUrl: "/image/demo video/DEMO VIDEO(1).mp4",
    thumbnail: "https://m.media-amazon.com/images/I/61Rr7M+29rL._SL1500_.jpg"
  },
  {
    id: 2,
    title: "One Piece Collection",
    price: 199,
    videoUrl: "/image/demo video/DEMO VIDEO(2).mp4",
    thumbnail: "https://m.media-amazon.com/images/I/71eOX4prtwL._SL1500_.jpg"
  },
  {
    id: 3,
    title: "Naruto Skin Collection",
    price: 199,
    videoUrl: "/image/demo video/DEMO VIDEO(3).mp4",
    thumbnail: "https://m.media-amazon.com/images/I/61GJxzJRDDL._SL1500_.jpg"
  },
  {
    id: 4,
    title: "Attack on Titan Designs",
    price: 399,
    videoUrl: "/image/demo video/DEMO VIDEO(4).mp4",
    thumbnail: "https://m.media-amazon.com/images/I/71CkWWP8hKL._SL1500_.jpg"
  },
  {
    id: 5,
    title: "Hunter x Hunter Collection",
    price: 199,
    videoUrl: "/image/demo video/DEMO VIDEO(5).mp4",
    thumbnail: "https://m.media-amazon.com/images/I/71sJKLqwU-L._SL1500_.jpg"
  }
];

export const sliderItems: SliderItem[] = [
  {
    id: 1,
    image: "/image/hero page front image/hero FIRST Page image 1.jpg",
    title: "Premium Mobile Skins",
    subtitle: "Exclusive designs for your device",
    buttonText: "Shop Now",
    buttonLink: "/products/anime",
  },
  {
    id: 2,
    image: "/image/hero page front image/hero FIRST Page image 2.jpeg",
    title: "Trendy Fashion",
    subtitle: "Discover our latest clothing collection",
    buttonText: "Explore Now",
    buttonLink: "/products/accessories",
  },
  {
    id: 3,
    image: "/image/hero page front image/hero FIRST Page image 3.jpeg",
    title: "Limited Edition",
    subtitle: "Get our exclusive items before they're gone",
    buttonText: "Shop Limited Items",
    buttonLink: "/products/limited",
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return products.filter(product => product.isFeatured).slice(0, limit);
};