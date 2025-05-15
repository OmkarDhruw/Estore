import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: '1',
    userName: 'Aryan Jodhani',
    rating: 5,
    comment: "It's Just Perfect\nThe quality of paper is just amazing\nPrinting is good it's wholesome a terrific purchase",
    date: '12/22/2024',
    isVerified: true
  },
  {
    id: '2',
    userName: 'Pro+h!',
    rating: 5,
    comment: "Best Skin\nI have used a lot of skins from different providers but worth wrap has been the best so far. The skin is the best, no wear on the cut, carefully it was very neat of the back of my phone has a glove. Would definitely purchase more in the future and would highly recommend to anyone who wants to purchase an affordable and high quality skin for their phone or laptop.",
    date: '12/15/2024',
    isVerified: true
  },
  {
    id: '3',
    userName: 'Adeesh Anilkumar',
    rating: 5,
    comment: "Jujutsu Kaisen - Itadori Yuji Mobile Skin",
    date: '11/27/2024',
    isVerified: true
  },
  {
    id: '4',
    userName: 'Pathan Nair',
    rating: 5,
    comment: "Nice skin!\nVery cool",
    date: '08/18/2024',
    isVerified: true,
    images: ['https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1']
  }
];

export const getReviewsForProduct = (productId: string): Review[] => {
  // In a real app, this would filter by productId
  return reviews;
};

export const getRatingCounts = (): Record<number, number> => {
  return {
    5: 3,
    4: 1,
    3: 0,
    2: 0,
    1: 0
  };
}; 