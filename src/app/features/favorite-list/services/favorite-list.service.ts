import { Injectable } from '@angular/core';
import { Entrepreneurship } from '../../entrepreneurship/models/entrepreneurship.model';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListService {
  private baseUrl2 = 'http://localhost:8080';
  private baseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  addFavorite(userId: string, entrepreneurshipId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${userId}`).pipe(
      switchMap(user => {
        if (user.favorites && user.favorites.includes(entrepreneurshipId)) {
          return of(null);
        }

        const updatedFavorites = [...user.favorites, entrepreneurshipId];
        return this.http.put(`${this.baseUrl}/accounts/${userId}`, { ...user, favorites: updatedFavorites });
      })
    );
  }

  getUserFavorites(userId: string): Observable<Entrepreneurship[]> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${userId}`).pipe(
      switchMap(user => {
        if (user.favorites && user.favorites.length > 0) {
            const requests: Observable<Entrepreneurship>[] = user.favorites.map((favId: number) =>
            this.http.get<Entrepreneurship>(`${this.baseUrl2}/entrepreneurships/${favId}`)
            );

          return forkJoin(requests);
        } else {
          return new Observable<Entrepreneurship[]>(observer => observer.next([]));
        }
      })
    );
  }

  getEntrepreneurshipById(id: number): Observable<Entrepreneurship> {
    return this.http.get<Entrepreneurship>(`${this.baseUrl}/entrepreneurships/${id}`);
  }
}
