import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/service.service';
import { map, catchError, of } from 'rxjs';
import { ActiveUser } from '../types/account-data';

export const guardGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.auth().pipe(
    map((activeUser: ActiveUser | undefined) => {
      // Log para verificar el estado de autenticación en el guard
      console.log("Valor de activeUser en guard:", activeUser);
      if (activeUser || localStorage.getItem("token")) {
        return true;
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