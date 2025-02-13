import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AccountData, ActiveUser } from '../types/account-data';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../types/account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private activeUserSubject = new BehaviorSubject<ActiveUser | undefined>(this.getStoredUser());
  private baseUrl = `${environment.urlServer}`;
  public estoyLogeado: boolean = !!localStorage.getItem("access_token");
  private refreshInterval: any;
  constructor(
    private router: Router,
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
        this.refreshToken().subscribe((success) => {
          if (!success) {
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
      return of(false);
    }

    const body = { refreshToken: refreshToken }; // Asegúrate de usar el nombre correcto del parámetro


    return this.http.post<{ access_token: string, refresh_token?: string }>(
      `${this.baseUrl}/auth/token/refresh`,
      body,
    ).pipe(
      map((tokens) => {
        if (tokens.access_token) {
          localStorage.setItem("access_token", tokens.access_token);

          if (tokens.refresh_token) {
            localStorage.setItem("refresh_token", tokens.refresh_token);
          }

          const decodedToken = this.tokenService.decodeToken(tokens.access_token);
          const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };

          this.activeUserSubject.next(activeUser);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Error en la renovación del token', error);
        if (error.status === 401) {
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

  signup(account: Account): Observable<boolean> {
    return this.http.post<Account>(`${this.baseUrl}/accounts`, account, { withCredentials: true }).pipe(
      switchMap(({ id, username, providerId }) => {
        if (id && username) {
          // Si se recibe un ID, y no se envió password, se hace el login con providerId
          if (account.password == null && account.providerId == null && providerId != null) {
            return this.loginBefSignGoogle(username, providerId); // Usamos providerId del backend si fue asignado
          }
          // Si se recibió un password en el account, hacemos el login normal
          if (account.password) {
            return this.login(username, account.password);
          }
        }
        return of(false); // En caso de que no se haya creado correctamente
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
    return this.http.get<boolean>(`${this.baseUrl}/accounts/exists/username/${username}`);
  }

  checkIfEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/accounts/exists/email/${email}`);
  }

  loginWithOAuth2(): void {
    const state = Math.random().toString(36).substring(7);  // Genera un valor único para state
    const authUrl = `${environment.googleOAuth.authUrl}?` +
    `client_id=${environment.googleOAuth.clientId}&` +
    `redirect_uri=${environment.googleOAuth.redirectUri}&` +
    `response_type=code&` +
    `scope=openid%20email%20profile&` +
    `state=${state}&` +
    `prompt=select_account`;

    window.location.href = authUrl;
}

loginBefSignGoogle(username: String, providerID: String): Observable<boolean> {
  const body = { username, providerID};
  return this.http.post<{ access_token: string, refresh_token: string }>(
    `${this.baseUrl}/auth/oauth2/login_google`, // Aquí también se usa la misma URL del login
    body
  ).pipe(
    map((tokens) => {

      if (tokens.access_token && tokens.refresh_token) {
        // Guardamos el access token y refresh token en localStorage
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);

        // Decodificamos el token para obtener el usuario activo
        const decodedToken = this.tokenService.decodeToken(tokens.access_token);
        const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };

        // Guardamos el usuario activo en localStorage
        localStorage.setItem("activeUser", JSON.stringify(activeUser));
        // Actualizamos el estado de usuario activo
        this.activeUserSubject.next(activeUser);
        this.estoyLogeado = true;
        return true;
      }
      this.estoyLogeado = false;
      return false;
    }),
    catchError(() => of(false)) // Manejo de errores en caso de que algo falle
  );
}

activarUser(activeuser:ActiveUser){
  this.activeUserSubject.next(activeuser);
  this.estoyLogeado = true;
}


}
