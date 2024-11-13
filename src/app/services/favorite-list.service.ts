import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, switchMap } from 'rxjs';
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
    const currentFavorites = this.favoritesSubject.getValue();
    if (!currentFavorites.includes(entrepreneurshipId)) {
      const updatedFavorites = [...currentFavorites, entrepreneurshipId];
      this.favoritesSubject.next(updatedFavorites);
      return this.http.put(`${this.baseUrl}/accounts/${userId}`, { favorites: updatedFavorites });
    }
    return of(null); // Si ya está en favoritos, no hacer nada
  }

  removeFavorite(userId: string, entrepreneurshipId: number): Observable<any> {
    const currentFavorites = this.favoritesSubject.getValue();
    if (currentFavorites.includes(entrepreneurshipId)) {
      const updatedFavorites = currentFavorites.filter(favId => favId !== entrepreneurshipId);
      this.favoritesSubject.next(updatedFavorites);
      return this.http.put(`${this.baseUrl}/accounts/${userId}`, { favorites: updatedFavorites });
    }
    return of(null); // Si no está en favoritos, no hacer nada
  }

  getUserFavoritesDetails(userId: string): Observable<Entrepreneurship[]> {
    return this.favorites$.pipe(
      switchMap(favoriteIds => {
        if (favoriteIds.length > 0) {
          const requests = favoriteIds.map(id => this.http.get<Entrepreneurship>(`${this.baseUrl2}/entrepreneurships/${id}`));
          return forkJoin(requests);
        } else {
          return of([]); // Si no hay favoritos, devolver un array vacío
        }
      })
    );
  }
}
