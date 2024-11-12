import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entrepreneurship, PageResponse } from '../models/entrepreneurship.model';

@Injectable({
  providedIn: 'root',
})
export class EntrepreneurshipService {
  http = inject(HttpClient);
  private urlBase = 'http://localhost:8080/entrepreneurships';

  getEntrepreneurship(page: number, size: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.urlBase}?page=${page}&size=${size}`);
  }

  getEntrepreneurshipsActives(page: number, size: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.urlBase}/active?page=${page}&size=${size}`);
  }

  getEntrepreneurshipById(id: number): Observable<Entrepreneurship> {
    return this.http.get<Entrepreneurship>(`${this.urlBase}/${id}`);
  }

  getEntrepreneurshipsByUserId(userId: string): Observable<Entrepreneurship[]> {
    return this.http.get<Entrepreneurship[]>(`${this.urlBase}/u/${userId}`);
  }

  postEntrepreneurship(
    entrepreneurship: Entrepreneurship
  ): Observable<Entrepreneurship> {
    return this.http.post<Entrepreneurship>(this.urlBase, entrepreneurship);
  }

  deleteEntrepreneurship(id: number | null ): Observable<Entrepreneurship> {
    return this.http.delete<Entrepreneurship>(`${this.urlBase}/${id}`);
  }

  updateEntrepreneurship(id: number | null, entrepreneurship: Entrepreneurship) {
    return this.http.patch<Entrepreneurship>(
      `${this.urlBase}/${id}`,
      entrepreneurship
    );
  }
}
