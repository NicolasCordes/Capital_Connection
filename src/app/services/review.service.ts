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
    urlBase = `${environment.urlBase}/reviews`;

    getReview(): Observable<Review[]> {
      return this.http.get<Review[]>(this.urlBase);
    }

    getReviewByEntrepreneurshipId(id: Number | null): Observable<Review[]> {
      return this.http.get<Review[]>(`${this.urlBase}/${id}`)
    }

    postReview(review: Review): Observable<Review> {
      return this.http.post<Review>(this.urlBase, review)
    }

    deleteReview(id: Number | undefined): Observable<boolean> {
      return this.http.delete<boolean>(`${this.urlBase}/${id}`).pipe(
        map(()=>true)
      )
    }

    updateReview(id: Number | null, review: Partial<Review>): Observable<Review> {
      return this.http.patch<Review>(`${this.urlBase}/${id}`, review);
    }


}

