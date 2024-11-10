import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/service.service';
import { map, catchError, of } from 'rxjs';
import { ActiveUser } from '../types/account-data';

export const guardGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar el estado de autenticación utilizando el servicio AuthService
  return authService.auth().pipe(
    map((activeUser: ActiveUser | undefined) => { // Verificar si el usuario está autenticado o si hay un token
      if (activeUser || localStorage.getItem("token")) {
        return true;  // Permitir el acceso si hay sesión activa o token en localStorage
      } else {
        router.navigateByUrl('login'); // Redirigir si no está autenticado
        return false;
      }
    }),
    catchError(() => {
      // En caso de error, redirige a la página de acceso denegado
      router.navigateByUrl('login');
      return of(false);  // Bloquear el acceso
    })
  );
};