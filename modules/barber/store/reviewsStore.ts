import { create } from 'zustand';
import { REVIEWS, Review } from '../data/reviews';

interface ReviewsState {
  reviews: Review[];
  addReview: (review: Review) => void;
  getByBarberId: (barberId: string) => Review[];
  getAvgRating: (barberId: string) => number;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: REVIEWS,

  addReview: review => set(state => ({ reviews: [review, ...state.reviews] })),

  getByBarberId: barberId => get().reviews.filter(r => r.barberId === barberId),

  getAvgRating: barberId => {
    const barberReviews = get().reviews.filter(r => r.barberId === barberId);
    if (barberReviews.length === 0) return 0;
    return parseFloat(
      (barberReviews.reduce((sum, r) => sum + r.rating, 0) / barberReviews.length).toFixed(1),
    );
  },
}));
