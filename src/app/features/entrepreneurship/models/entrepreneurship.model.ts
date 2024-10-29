import { Category } from "../../../core/models/category.model"
import { Review } from "../../reviews/models/review.model";

export interface Entrepreneurship {
  id: number;
  name: string;
  description: string;
  goal: number; // objetivo financiero
  category: Category;
  images: string[]; // URLs de imágenes
  videos: string[]; // URLs de videos
  reviews: Review[]; // Lista de reviews
}
