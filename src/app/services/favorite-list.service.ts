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
  private favoritesSubject = new BehaviorSubject<Entrepreneurship[]>([]);

  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadFavorites(userId: number): void {
    this.http.get<number[]>(`${this.baseUrl}/accounts/${userId}/favorites`).pipe(
      switchMap(ids => {
        if (ids.length > 0) {
          const requests = ids.map(id => this.http.get<Entrepreneurship>(`${this.baseUrl2}/entrepreneurships/${id}`));
          return forkJoin(requests);
        }
        return of([]);
      }),
      catchError((error) => {
        console.error('Error al cargar favoritos:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    ).subscribe(favorites => this.favoritesSubject.next(favorites));
  }

  isFavorite(entrepreneurshipId: number): boolean {
    return this.favoritesSubject.getValue().some(fav => fav.id === entrepreneurshipId);
  }

  addFavorite(userId: number | undefined, entrepreneurshipId: number): Observable<any> {
    if (!userId || !entrepreneurshipId) {
      return of('Invalid data');
    }

    return this.http.post(
      `${this.baseUrl}/accounts/${userId}/favorites/${entrepreneurshipId}`,
      {},
      { responseType: 'text' }
    ).pipe(
      map((response: string) => {
        const currentFavorites = this.favoritesSubject.getValue();
        this.favoritesSubject.next([...currentFavorites, { id: entrepreneurshipId } as Entrepreneurship]);
        return response;
      }),
      catchError((error) => {
        console.error('Error al agregar favorito:', error);
        return of('Error adding favorite');
      })
    );
  }

  removeFavorite(userId: number | undefined, entrepreneurshipId: number): Observable<any> {
    if (!userId || !entrepreneurshipId) {
      return of('Invalid data');
    }

    return this.http.delete(`${this.baseUrl}/accounts/${userId}/favorites/${entrepreneurshipId}`, { responseType: 'text' }).pipe(
      map((response: string) => {
        const updatedFavorites = this.favoritesSubject.getValue().filter(fav => fav.id !== entrepreneurshipId);
        this.favoritesSubject.next(updatedFavorites);
      }),
      catchError((error) => {
        console.error('Error al eliminar favorito:', error);
        return of('Error removing favorite');
      })
    );
  }
  getUserFavorites(userId: number | undefined | null): Observable<Entrepreneurship[]> {
    if (userId == null) {
      console.warn("getUserFavorites: userId is null or undefined");
      return of([]); // Return an empty array if userId is invalid
    }

    return this.http.get<number[]>(`${this.baseUrl}/accounts/${userId}/favorites`).pipe(
      switchMap((favoriteIds) => {
        if ((favoriteIds ?? []).length > 0) {

          return forkJoin(
            favoriteIds.map((id) =>
              this.http.get<Entrepreneurship>(`${this.baseUrl}/entrepreneurships/${id}`)
            )
          );
        }
        return of([]); // Return an empty array if there are no favorites
      }),
      catchError((error) => {
        console.error("Error fetching user favorites:", error);
        return of([]); // Handle errors gracefully
      })
    );
  }

}
