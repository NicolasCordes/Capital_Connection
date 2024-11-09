import { Entrepreneurship } from "../../entrepreneurship/models/entrepreneurship.model";

export interface Review {
    id: number;
    id_user:string;
    reviewText: string;
    stars: number; // Calificación, por ejemplo, de 1 a 5
    entrepreneurships: Entrepreneurship[];

  }
  