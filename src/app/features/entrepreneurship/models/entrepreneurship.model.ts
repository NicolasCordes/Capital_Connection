import { Review } from '../../reviews/models/review.model';

export interface Entrepreneurship {
  id?: number;
  idUser: string;
  name: string;
  description: string;
  goal: number; // objetivo financiero
  category: string;
  images: string[]; // URLs de imágenes
  videos: string[]; // URLs de videos
  collected?: number; // total recaudado
}

export interface PageResponse {
  content: Entrepreneurship[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
