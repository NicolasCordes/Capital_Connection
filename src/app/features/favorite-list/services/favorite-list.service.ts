import { Injectable } from '@angular/core';
import { Entrepreneurship } from '../../entrepreneurship/models/entrepreneurship.model';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListService {
  private baseUrl2 = 'http://localhost:8080';
  private baseUrl = 'http://localhost:3000'; // URL base para JSON Server

  constructor(private http: HttpClient) {}

  // Método para agregar un favorito
  addFavorite(userId: string, entrepreneurshipId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${userId}`).pipe(
      switchMap(user => {
        // Verifica si el emprendimiento ya está en los favoritos
        if (user.favorites && user.favorites.includes(entrepreneurshipId)) {
          // Si ya está en los favoritos, devolvemos un observable vacío para no realizar la actualización
          return of(null);
        }

        // Si no está en los favoritos, agregarlo
        const updatedFavorites = [...user.favorites, entrepreneurshipId];
        return this.http.put(`${this.baseUrl}/accounts/${userId}`, { ...user, favorites: updatedFavorites });
      })
    );
  }

  // Método para obtener los emprendimientos favoritos de un usuario
  getUserFavorites(userId: string): Observable<Entrepreneurship[]> {
    // 1. Obtener la información del usuario
    return this.http.get<any>(`${this.baseUrl}/accounts/${userId}`).pipe(
      switchMap(user => {
        if (user.favorites && user.favorites.length > 0) {
          // 2. Crear las solicitudes HTTP para obtener los emprendimientos
            const requests: Observable<Entrepreneurship>[] = user.favorites.map((favId: number) =>
            this.http.get<Entrepreneurship>(`${this.baseUrl2}/entrepreneurships/${favId}`)
            );

          // 3. Usar forkJoin para ejecutar todas las solicitudes y combinar las respuestas
          return forkJoin(requests);
        } else {
          // Si no hay favoritos, devolver un array vacío
          return new Observable<Entrepreneurship[]>(observer => observer.next([]));
        }
      })
    );
  }

  // Obtener un emprendimiento por ID
  getEntrepreneurshipById(id: number): Observable<Entrepreneurship> {
    return this.http.get<Entrepreneurship>(`${this.baseUrl}/entrepreneurships/${id}`);
  }
}
