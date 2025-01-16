import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Review } from "../types/review.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class ReviewService {

    http = inject(HttpClient)

   getReviewUrl(entrepreneurshipId: null | number | undefined): string {
      return `${environment.urlBase}/entrepreneurships/${entrepreneurshipId}/reviews`;
  }

    getReviewByEntrepreneurshipId(idE: number | null): Observable<Review[]> {
      return this.http.get<Review[]>(this.getReviewUrl(idE))
    }

    postReview(review: Review, idE: number | undefined): Observable<Review> {
      return this.http.post<Review>(this.getReviewUrl(idE), review)
    }

    deleteReview(idR: number | undefined,idE: number | null): Observable<boolean> {
      return this.http.delete<boolean>(`${this.getReviewUrl(idE)}/${idR}`).pipe(
        map(()=>true)
      )
    }

    updateReview(idR: number | null,idE: number | null, review: Partial<Review>): Observable<Review> {
      return this.http.patch<Review>(`${this.getReviewUrl(idE)}/${idR}`, review);
    }
}

