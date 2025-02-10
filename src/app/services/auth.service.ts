import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AccountData, ActiveUser } from '../types/account-data';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private activeUserSubject = new BehaviorSubject<ActiveUser | undefined>(this.getStoredUser());
  private baseUrl = `${environment.urlServer}`;
  public estoyLogeado: boolean = !!localStorage.getItem("access_token");
  private refreshInterval: any;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.checkSession();
    this.startTokenRenewal();  // Iniciar la renovación automática de tokens
  }

  private getStoredUser(): ActiveUser | undefined {
    const storedUser = localStorage.getItem("activeUser");
    return storedUser ? JSON.parse(storedUser) : undefined;
  }

  private checkSession() {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken && refreshToken) {
      const isAccessTokenExpired = this.tokenService.isTokenExpired(accessToken);

      if (isAccessTokenExpired) {
        this.refreshToken().subscribe((success) => {
          if (!success) {
            this.logout(); // Si no se puede refrescar, cerrar sesión
          }
        });
      } else {
        const decodedToken = this.tokenService.decodeToken(accessToken);
        const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };
        this.activeUserSubject.next(activeUser);
        this.estoyLogeado = true;
      }
    } else {
      this.logout(); // Si no hay tokens, cerrar sesión
    }
  }

  auth(): Observable<ActiveUser | undefined> {
    return this.activeUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<boolean> {
    const body = { username, password, withRefreshToken: true };

    return this.http.post<{ access_token: string, refresh_token: string }>(
      `${this.baseUrl}/auth/login`, // Corregida la URL
      body
    ).pipe(
      map((tokens) => {
        if (tokens.access_token && tokens.refresh_token) {
          localStorage.setItem("access_token", tokens.access_token);
          localStorage.setItem("refresh_token", tokens.refresh_token);

          const decodedToken = this.tokenService.decodeToken(tokens.access_token);
          const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };
          localStorage.setItem("activeUser", JSON.stringify(activeUser));
          this.activeUserSubject.next(activeUser);
          this.estoyLogeado = true;
          return true;
        }
        this.estoyLogeado = false;
        return false;
      }),
      catchError(() => of(false))
    );
  }

  private startTokenRenewal(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken && this.tokenService.isTokenExpired(accessToken)) {
        console.log('Access token expirado, intentando renovar...');
        this.refreshToken().subscribe((success) => {
          if (!success) {
            console.log('No se pudo renovar el token, cerrando sesión');
            this.logout();
          }
        });
      }
    }, 300000); // Renueva cada 5 minutos
  }

  private stopTokenRenewal(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval); // Detener la renovación periódica
    }
  }

  refreshToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      console.log('No hay refresh token disponible');
      return of(false);
    }
  
    const body = { refreshToken: refreshToken }; // Asegúrate de usar el nombre correcto del parámetro
  
 
    return this.http.post<{ access_token: string, refresh_token?: string }>(
      `${this.baseUrl}/auth/token/refresh`,
      body,
    ).pipe(
      map((tokens) => {
        if (tokens.access_token) {
          console.log('Nuevo access token obtenido', tokens.access_token);
          localStorage.setItem("access_token", tokens.access_token);

          if (tokens.refresh_token) {
            console.log('Nuevo refresh token obtenido', tokens.refresh_token);
            localStorage.setItem("refresh_token", tokens.refresh_token);
          }

          const decodedToken = this.tokenService.decodeToken(tokens.access_token);
          const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };

          this.activeUserSubject.next(activeUser);
          return true;
        }
        console.log('No se pudo renovar el token');
        return false;
      }),
      catchError((error) => {
        console.error('Error en la renovación del token', error);
        if (error.status === 401) {
          console.log('El refresh token ha expirado, cerrando sesión...');
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          this.logout();
        }
        return of(false);
      })
    );
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken = this.tokenService.decodeToken(token);
      const now = Date.now() / 1000;
      return decodedToken && decodedToken.exp ? decodedToken.exp < now : true;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return true; // Si hay error, asumir que está expirado
    }
  }

  logout(): Observable<boolean> {
    this.stopTokenRenewal();
    this.activeUserSubject.next(undefined);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("activeUser");
    clearInterval(this.refreshInterval);

    return of(true);
  }

  signup(account: AccountData): Observable<boolean> {
    return this.http.post<AccountData>(`${this.baseUrl}/accounts`, account).pipe(
      switchMap(({ id, username }) => {
        if (id) {
          return this.login(username, account.password);
        }
        return of(false);
      }),
      catchError((error) => {
        console.error('Error en el registro: ', error);
        return of(false);
      })
    );
  }

  getUsernames(): Observable<{ id: number; username: string }[]> {
    return this.http.get<AccountData[]>(`${this.baseUrl}`).pipe(
      map((users) => {
        return users
          .filter(user => user.id !== undefined)
          .map(user => ({
            id: user.id!,
            username: user.username
          }));
      }),
    );
  }

  checkIfUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/username/${username}`);
  }

  checkIfEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/email/${email}`);
  }

  loginWithOAuth2(provider: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      window.location.href = `${this.baseUrl}/oauth2/auth?provider=${provider}`;
      observer.next(true);
      observer.complete();
    });
  }

  handleOAuth2Callback(code: string): Observable<boolean> {
    return this.http.post<{ access_token: string, refresh_token: string }>(
      `${this.baseUrl}/oauth2/callback`,
      { code }
    ).pipe(
      map(tokens => {
        if (tokens.access_token && tokens.refresh_token) {
          localStorage.setItem("access_token", tokens.access_token);
          localStorage.setItem("refresh_token", tokens.refresh_token);
          const decodedToken = this.tokenService.decodeToken(tokens.access_token);
          const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };
          localStorage.setItem("activeUser", JSON.stringify(activeUser));
          this.activeUserSubject.next(activeUser);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}
