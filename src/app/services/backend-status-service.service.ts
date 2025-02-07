import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendStatusServiceService {

  private backendUrl = environment.urlTBE;  // URL de tu backend

  constructor(private http: HttpClient) {}

  // Método para verificar si el backend está disponible
  checkBackendStatus(): Observable<any> {
    return this.http.get(`${this.backendUrl}/status`);  // Asegúrate de tener un endpoint "/status" en tu servidor
  }
}
