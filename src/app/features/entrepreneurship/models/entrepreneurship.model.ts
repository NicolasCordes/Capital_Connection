import { Review } from '../../reviews/models/review.model';

export interface Entrepreneurship {
  id: number;
  name: string;
  description: string;
  goal: number; // objetivo financiero
  category: string;
  images: string[]; // URLs de imágenes
  videos: string[]; // URLs de videos
  reviews: Review[]; // Lista de reviews
}
