import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentMP } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MpService {

  constructor(private http: HttpClient) {}

  crearPreferencia(descripcion: string, cantidad: number, precio: number, iddon: number, idacc: number): Observable<any> {
    return this.http.post<any>('http://localhost:3000/create_preference', {
      title: descripcion,
      quantity: cantidad,
      price: precio,
      iddon: iddon,
      idacc: idacc
    });
  }



}
