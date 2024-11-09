import { Review } from '../../reviews/models/review.model';

export interface Entrepreneurship {
  id?: string;
  id_user: string;
  name: string;
  description: string;
  goal: number; // objetivo financiero
  category: string;
  images: string[]; // URLs de imágenes
  videos: string[]; // URLs de videos
}
