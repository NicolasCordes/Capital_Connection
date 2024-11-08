import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccountData, ActiveUser } from '../types/account-data';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private activeUserSubject = new BehaviorSubject<ActiveUser | undefined>(undefined);
  private baseUrl = 'http://localhost:3000/accounts';  // URL de la base de datos

  constructor(private http: HttpClient) { }

  // Obtener el estado actual de ActiveUser
  auth(): Observable<ActiveUser | undefined> {
    return this.activeUserSubject.asObservable();
  }

  // Login: validar las credenciales
  login(username: string, password: string): Observable<boolean> {
    return this.http.get<AccountData[]>(`${this.baseUrl}?username=${username}`).pipe(
    map((users) => {
      const user = users.at(0);
      if (user && user.username === username) {
        const hashedPassword = this.hashPassword(password);
        if (user.password === hashedPassword) {
        /* this.activeUser = { username: user.username, id: user.id! }; */
        this.activeUserSubject.next({ username: user.username, id: user.id!, role: user.role });
        return true;
      }
    }
    return false;
    }),
    catchError(() => of(false))
  );
}

  // Método para cifrar la contraseña
  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
  }

  // Logout: cerrar sesión
  logout(): Observable<boolean> {
    this.activeUserSubject.next(undefined);
    return of(true);
  }

  // Método para registrar un nuevo usuario
  signup(user: AccountData): Observable<boolean> {
    const hashedPassword = this.hashPassword(user.password);
    const userWithHashedPassword = { ...user, password: hashedPassword };

    return this.http.post<AccountData>(this.baseUrl, userWithHashedPassword).pipe(
      map(({ id, username, role }) => {
        if (id) {
          /* this.activeUser = { id, username }; */
          this.activeUserSubject.next({id, username, role});
          return true;
        }
        return false;
      })
    );
  }
}
