import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentMP } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MpService {

  constructor(private http: HttpClient) {}

  crearPreferencia(descripcion: string, precio: number): Observable<any> {
    return this.http.post<any>('http://localhost:3000/createPreference', { descripcion, precio });
  }


}
