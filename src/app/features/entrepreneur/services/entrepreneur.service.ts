import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Entrepreneur } from "../models/entrepreneur.model";

@Injectable({
    providedIn: 'root'
  })
  export class EntrepreneurService {
  
    http = inject(HttpClient)
    urlBase = 'http://localhost:3000/entrepreneurs';
  
    getEntrepreneur(): Observable<Entrepreneur[]> {
      return this.http.get<Entrepreneur[]>(this.urlBase);
    }
  
    getEntrepreneurById(id: Number | null): Observable<Entrepreneur> {
      return this.http.get<Entrepreneur>(`${this.urlBase}/${id}`)
    }
  
    postEntrepreneur(entrepreneur: Entrepreneur): Observable<Entrepreneur> {
      return this.http.post<Entrepreneur>(this.urlBase, entrepreneur)
    }
  
    deleteEntrepreneur(id: Number | undefined): Observable<Entrepreneur> {
      return this.http.delete<Entrepreneur>(`${this.urlBase}/${id}`)
    }
  
    updateEntrepreneur(id: Number | null, entrepreneur: Entrepreneur): Observable<Entrepreneur> {
      return this.http.put<Entrepreneur>(`${this.urlBase}/${id}`, entrepreneur);
    }
  }