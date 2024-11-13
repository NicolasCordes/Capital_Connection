import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccountData, ActiveUser } from '../types/account-data';
import * as CryptoJS from 'crypto-js';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private activeUserSubject = new BehaviorSubject<ActiveUser | undefined>(this.getStoredUser());
  private baseUrl = 'http://localhost:3000/accounts';
  public estoyLogeado: boolean = !!localStorage.getItem("token");


  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.checkSession();
  }

  private getStoredUser(): ActiveUser | undefined {
    const storedUser = localStorage.getItem("activeUser");
    return storedUser ? JSON.parse(storedUser) : undefined;
  }

  private checkSession() {
    const token = localStorage.getItem("token");
    if (token) {
      const activeUser = this.getStoredUser();
      if (activeUser) {
        this.activeUserSubject.next(activeUser);
        this.estoyLogeado = true;
      }
    }
  }

  auth(): Observable<ActiveUser | undefined> {
    return this.activeUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<AccountData[]>(`${this.baseUrl}?username=${username}`).pipe(
      map((users) => {
        const user = users.at(0);
        if (user && user.username === username) {
          const hashedPassword = this.hashPassword(password);
          if (user.password === hashedPassword) {
            const token = this.tokenService.generateToken(32);
            localStorage.setItem("token", token);
            const activeUser = { username: user.username, id: user.id! };
            localStorage.setItem("activeUser", JSON.stringify(activeUser));
            this.activeUserSubject.next(activeUser);
            this.estoyLogeado = true;
            return true;
          }
        }
        this.estoyLogeado = false;
        return false;
      }),
      catchError(() => of(false))
    );
  }

  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
  }

  logout(): Observable<boolean> {
    this.activeUserSubject.next(undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("activeUser");
    this.estoyLogeado = false;
    return of(false);
  }

  signup(user: AccountData): Observable<boolean> {
    const hashedPassword = this.hashPassword(user.password);
    const userWithHashedPassword = { ...user, password: hashedPassword };

    return this.http.post<AccountData>(this.baseUrl, userWithHashedPassword).pipe(
      map(({ id, username }) => {
        if (id) {
          const activeUser = { id, username };
          this.activeUserSubject.next(activeUser);

          const token = this.tokenService.generateToken(32);
          localStorage.setItem('token', token);
          localStorage.setItem("activeUser", JSON.stringify(activeUser));
          return true;
        }
        return false;
      })
    );
  }

  getUsernames(): Observable<{ id: string; username: string }[]> {
    return this.http.get<AccountData[]>(`${this.baseUrl}`).pipe(
      map((users) => {
        // Filtrar usuarios que tienen un id definido
        return users
          .filter(user => user.id !== undefined)  // Filtrar usuarios con id definido
          .map(user => ({
            id: user.id!,  // El operador '!' garantiza que el id no es undefined
            username: user.username
          }));
      }),
    );
  }

}
