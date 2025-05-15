import { Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'All Anime',
    slug: 'all-anime',
    image: '/image/photo/Anime.jpg.jpeg'
  },
  {
    id: '2',
    name: 'One Piece',
    slug: 'one-piece',
    image: '/image/photo/dummy skin  (1).jpeg'
  },
  {
    id: '3',
    name: 'Naruto',
    slug: 'naruto',
    image: '/image/photo/dummy skin  (2).jpeg'
  },
  {
    id: '4',
    name: 'Attack on Titan',
    slug: 'attack-on-titan',
    image: '/image/photo/dummy skin  (3).jpeg'
  },
  {
    id: '5',
    name: 'Bleach',
    slug: 'bleach',
    image: '/image/photo/dummy skin  (4).jpeg'
  },
  {
    id: '6',
    name: 'Fire Force',
    slug: 'fire-force',
    image: '/image/photo/dummy skin  (5).jpeg'
  },
  {
    id: '7',
    name: 'Hunter x Hunter',
    slug: 'hunter-x-hunter',
    image: '/image/photo/dummy skin  (6).jpeg'
  },
  {
    id: '8',
    name: 'Vinland Saga',
    slug: 'vinland-saga',
    image: '/image/photo/dummy skin  (7).jpeg'
  },
  {
    id: '9',
    name: 'Explore Skins',
    slug: 'explore-skins',
    image: '/image/Skins Collection/SUPERHERO.jpg.jpeg'
  },
  {
    id: '10',
    name: 'Mobile Skins',
    slug: 'mobile-skins',
    image: '/image/Skins Collection/mobile-skins.webp_6.jpeg'
  },
  {
    id: '11',
    name: 'Laptop Skins',
    slug: 'laptop-skins',
    image: '/image/laptop skins/Collection Laptop Skins  (1).jpeg'
  },
  {
    id: '12',
    name: 'Explore Clothing',
    slug: 'explore-clothing',
    image: '/image/hero page front image/Explore Clothing.jpg'
  },
  {
    id: '13',
    name: "Men's Collection",
    slug: 'mens-collection',
    image: '/image/men/Men\'s Collection (2).jpeg'
  },
  {
    id: '14',
    name: "Women's Collection",
    slug: 'womens-collection',
    image: '/image/women/dummy women cloth (1).jpeg'
  }
];

export const getCategoryCollections = (): Category[] => {
  return categories;
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
}; 