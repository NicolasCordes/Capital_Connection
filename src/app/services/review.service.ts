import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
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
    return this.http.get<Review[]>(this.getReviewUrl(idE)).pipe(
      map((reviews) => reviews.filter((review) => review.isActivated))
    );
  }

    postReview(review: Review, idE: number | undefined): Observable<Review> {
      return this.http.post<Review>(this.getReviewUrl(idE), review)
    }

    deleteReview(idR: number | undefined,idE: number | null): Observable<boolean> {
      return this.http.delete<boolean>(`${this.getReviewUrl(idE)}/${idR}`).pipe(
        map(()=>true)
      )
    }

    updateReview(idR: number | null, idE: number | null, review: Partial<Review>): Observable<Review> {
      const token = localStorage.getItem('access_token'); // Recupera el token del localStorage
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Lo agrega al header

      return this.http.patch<Review>(`${this.getReviewUrl(idE)}/${idR}`, review, { headers });
    }


    hasReviewed(idE: number | null, idA: number | null): Observable<boolean> {
      if (idE === null || idA === null) {
          return of(false);
      }

      return this.http.get<boolean>(`${this.getReviewUrl(idE)}/a/${idA}`).pipe(
          catchError(() => of(false)) // Devuelve false si hay un error
      );
  }

}

