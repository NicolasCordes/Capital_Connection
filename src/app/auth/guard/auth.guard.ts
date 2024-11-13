import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, catchError, of } from 'rxjs';
import { ActiveUser } from '../../types/account-data';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.auth().pipe(
    map((activeUser: ActiveUser | undefined) => {
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
