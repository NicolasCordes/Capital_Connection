  import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable, of } from 'rxjs';
  import { catchError, map, switchMap } from 'rxjs/operators';
  import { HttpClient, HttpParams } from '@angular/common/http';
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
        const decodedToken = this.tokenService.decodeToken(accessToken);
        const isTokenExpired = this.tokenService.isTokenExpired(decodedToken);

        if (isTokenExpired) {
          // Si el token ha expirado, intentar refrescarlo
          this.refreshToken().subscribe((success) => {
            if (!success) {
              this.logout(); // Si no se puede refrescar, cerrar sesión
            }
          });
        } else {
          // Si el token es válido, actualizar el estado del usuario
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
      const params = new HttpParams()
        .set('username', username)
        .set('password', password)
        .set('withRefreshToken', 'true'); // Si es necesario

      return this.http.post<{ access_token: string, refresh_token: string }>(
        `${this.baseUrl}/login`,
        {}, // 👈 No se envía un body, solo params
        { params }
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
      // Limpiar cualquier intervalo anterior
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }

      // Revisar cada segundo si el token está a punto de expirar para renovarlo antes de que se caduque
      this.refreshInterval = setInterval(() => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken && this.isTokenExpired(accessToken)) {
          console.log('Access token expirado, intentando renovar...');
          this.refreshToken().subscribe((success) => {
            if (!success) {
              console.log('No se pudo renovar el token, cerrando sesión');
              this.logout(); // Si no se puede renovar, cerrar sesión
            }
          });
        }
      }, 1000); // Revisar cada segundo para pruebas
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
        return of(false); // No hay refresh token disponible
      }

      const params = new HttpParams().set('refreshToken', refreshToken);

      return this.http.post<{ access_token: string }>(`${this.baseUrl}/token/refresh`, {}, { params }).pipe(
        map((tokens) => {
          if (tokens.access_token) {
            console.log('Nuevo access token obtenido', tokens.access_token);
            // Almacenar el nuevo access token
            localStorage.setItem("access_token", tokens.access_token);

            // Decodificar el nuevo token
            const decodedToken = this.tokenService.decodeToken(tokens.access_token);
            const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };

            // Actualizar el estado del usuario
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
            this.logout(); // Cerrar sesión si el refresh token ha expirado
          }
          return of(false);
        })
      );
    }


    isTokenExpired(token: string): boolean {
      const decodedToken = this.tokenService.decodeToken(token);
      const now = Date.now() / 1000; // Convertir a segundos
      return decodedToken.exp < now; // Si la expiración del token es menor que el tiempo actual, ha expirado
    }

    logout(): Observable<boolean> {
      this.stopTokenRenewal();  // Detener la renovación automática
      this.activeUserSubject.next(undefined);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("activeUser");
      return of(true);
      }


    signup(account: AccountData): Observable<boolean> {
      return this.http.post<AccountData>(this.baseUrl, account).pipe(
        switchMap(({ id, username }) => {
          if (id) {
            // Autenticar al usuario después del registro
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

    checkIfUsernameExists(username: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.baseUrl}/exists/username/${username}`);
    }

    checkIfEmailExists(email: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.baseUrl}/exists/email/${email}`);
    }
  }
