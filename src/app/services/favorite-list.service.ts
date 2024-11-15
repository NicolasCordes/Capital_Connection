import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Entrepreneurship } from '../types/entrepreneurship.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListService {
  private baseUrl2 = environment.urlBase;
  private baseUrl = environment.urlServer;
  private favoritesSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  constructor(private http: HttpClient) {}


  initializeFavorites(userId: string): void {
    this.http.get<any>(`${this.baseUrl}/accounts/${userId}`).subscribe(user => {
      this.favoritesSubject.next(user.favorites || []);
    });
  }


  get favorites$(): Observable<number[]> {
    return this.favoritesSubject.asObservable();
  }

  isFavorite(entrepreneurshipId: number): boolean {
    return this.favoritesSubject.getValue().includes(entrepreneurshipId);
  }


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

  removeFavorite(userId: string, entrepreneurshipId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${userId}`).pipe(
      switchMap(user => {
        // Verifica si el emprendimiento ya está en los favoritos
        if (user.favorites && user.favorites.includes(entrepreneurshipId)) {
          // Si está, lo eliminamos de la lista de favoritos
          const updatedFavorites = user.favorites.filter((fav: number) => fav !== entrepreneurshipId);
          return this.http.put(`${this.baseUrl}/accounts/${userId}`, { ...user, favorites: updatedFavorites });
        }
        // Si no está en favoritos, no hacemos nada
        return of(null);
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

}
