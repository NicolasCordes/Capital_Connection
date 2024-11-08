import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entrepreneurship } from '../models/entrepreneurship.model';

@Injectable({
  providedIn: 'root',
})
export class EntrepreneurshipService {
  http = inject(HttpClient);
  private urlBase = 'http://localhost:3000/entrepreneurships';

  getEntrepreneurship(): Observable<Entrepreneurship[]> {
    return this.http.get<Entrepreneurship[]>(this.urlBase);
  }

  getEntrepreneurshipById(id: string): Observable<Entrepreneurship> {
    return this.http.get<Entrepreneurship>(`${this.urlBase}/${id}`);
  }

  postEntrepreneurship(
    entrepreneurship: Entrepreneurship
  ): Observable<Entrepreneurship> {
    return this.http.post<Entrepreneurship>(this.urlBase, entrepreneurship);
  }

  deleteEntrepreneurship(id: string): Observable<Entrepreneurship> {
    return this.http.delete<Entrepreneurship>(`${this.urlBase}/${id}`);
  }

  updateEntrepreneurship(entrepreneurship: Entrepreneurship) {
    return this.http.patch<Entrepreneurship>(
      `${this.urlBase}/${entrepreneurship.id}`,
      entrepreneurship
    );
  }
}
