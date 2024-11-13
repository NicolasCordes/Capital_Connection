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

  /**
   * Inicializa los favoritos del usuario.
   * @param userId El ID del usuario.
   */
  initializeFavorites(userId: string): void {
    this.http.get<any>(`${this.baseUrl}/accounts/${userId}`).subscribe(user => {
      this.favoritesSubject.next(user.favorites || []);
    });
  }

  /**
   * Obtiene un observable con la lista de favoritos del usuario.
   */
  get favorites$(): Observable<number[]> {
    return this.favoritesSubject.asObservable();
  }

  /**
   * Verifica si un emprendimiento está en los favoritos del usuario.
   * @param entrepreneurshipId El ID del emprendimiento.
   */
  isFavorite(entrepreneurshipId: number): boolean {
    return this.favoritesSubject.getValue().includes(entrepreneurshipId);
  }

  /**
   * Agrega un emprendimiento a los favoritos del usuario.
   * @param userId El ID del usuario.
   * @param entrepreneurshipId El ID del emprendimiento.
   */
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
  /**
   * Elimina un emprendimiento de los favoritos del usuario.
   * @param userId El ID del usuario.
   * @param entrepreneurshipId El ID del emprendimiento.
   */
  removeFavorite(userId: string, entrepreneurshipId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${userId}`).pipe(
      switchMap(user => {
        // Verifica si el emprendimiento ya está en los favoritos
        if (user.favorites && user.favorites.includes(entrepreneurshipId)) {
          // Si está, lo eliminamos de la lista de favoritos
          const updatedFavorites = user.favorites.filter((fav: number) => fav !== entrepreneurshipId);  // Especificamos el tipo de fav como number
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

  /**
   * Obtiene los detalles de los emprendimientos favoritos del usuario.
   * @param userId El ID del usuario.
   */
  getUserFavoritesDetails(userId: string): Observable<Entrepreneurship[]> {
    return this.favorites$.pipe(
      switchMap(favoriteIds => {
        if (favoriteIds.length > 0) {
          const requests = favoriteIds.map(id => this.http.get<Entrepreneurship>(`${this.baseUrl2}/entrepreneurships/${id}`).pipe(
            catchError(error => {
              console.error('Error al obtener los detalles del emprendimiento', error);
              return of(null);  // Devolvemos null en caso de error
            })
          ));
          return forkJoin(requests).pipe(
            map((results) => results.filter((entrepreneurship): entrepreneurship is Entrepreneurship => entrepreneurship !== null))
          );
        } else {
          return of([]);  // Si no hay favoritos, devolver un array vacío
        }
      })
    );
  }
}