export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  categoryId: {
    _id: string;
    name: string;
    imageUrl: string;
  };
  parentPage: string;
  tags: string[];
  stockStatus: 'In Stock' | 'Out of Stock';
  isActive: boolean;
  variants: {
    type: 'mobileModel' | 'clothingSize';
    options: string[];
  };
  reviews: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Review {
  _id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  ratingCounts: Record<number, number>;
  averageRating: number;
}

export interface CartItem {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string;
}

export interface VideoProduct {
  id: number | string;
  title: string;
  description?: string;
  newPrice: number;
  oldPrice: number;
  videoUrl: string;
  thumbnail: string;
  socialMediaUrl?: string;
}

export interface SliderItem {
  id: number | string;
  image: string;
  mediaType?: 'image' | 'video';
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  phone: string;
  verificationCode?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
  };
}

export interface SocialAuthProvider {
  id: string;
  name: string;
  icon: string;
}