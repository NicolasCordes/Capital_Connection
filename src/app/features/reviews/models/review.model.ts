import { Entrepreneurship } from "../../entrepreneurship/models/entrepreneurship.model";

export interface Review {
    id: number;
    idUser:string;
    reviewText: string;
    stars: number; // Calificación, por ejemplo, de 1 a 5
    idEntrepreneurship: number;
    username: string;

  }
  