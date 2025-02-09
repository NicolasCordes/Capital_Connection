import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, catchError, of } from 'rxjs';
import { TokenService } from '../../services/token.service';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    router.navigateByUrl('login');
    return of(false);
  }

  const decodedToken = tokenService.decodeToken(accessToken);
  const isTokenExpired = tokenService.isTokenExpired(decodedToken);

  if (isTokenExpired) {
    // Intentar refrescar el token
    return authService.refreshToken().pipe(
      map((success) => {
        if (success) {
          return true; // Token refrescado, permitir acceso
        } else {
          router.navigateByUrl('login');
          return false;
        }
      }),
      catchError(() => {
        router.navigateByUrl('login');
        return of(false);
      })
    );
  }

  return authService.auth().pipe(
    map((activeUser) => {
      if (activeUser) {
        return true; // Usuario autenticado, permitir acceso
      } else {
        router.navigateByUrl('login');
        return false;
      }
    }),
    catchError(() => {
      router.navigateByUrl('login');
      return of(false);
    })
  );
};
