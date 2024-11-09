import { Injectable } from '@angular/core';
import { Entrepreneurship } from '../../entrepreneurship/models/entrepreneurship.model';
import { Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
  export class FavoriteListService {
    private apiUrl = 'http://localhost:3000'; // URL de tu json-server o API

  constructor(private http: HttpClient) {}

  // Obtener un usuario por ID
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  // Actualizar la lista de favoritos de un usuario
  updateFavorites(userId: string, favorites: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, { favorites });
  }

  // Agregar un emprendimiento a los favoritos de un usuario
  addFavorite(userId: string, entrepreneurshipId: string): Observable<any> {
    return this.getUserById(userId).pipe(
      // Aquí podemos manipular los favoritos
      switchMap(user => {
        if (!user.favorites) {
          user.favorites = [];
        }
        user.favorites.push({ type: 'entrepreneurship', id: entrepreneurshipId });

        // Actualizamos la lista de favoritos
        return this.updateFavorites(userId, user.favorites);
      })
    );
  }
}
