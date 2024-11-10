import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './auth/services/service.service';
import { ActiveUser } from './auth/types/account-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  activeUser: ActiveUser | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación para mantener actualizado el estado del usuario
    this.authService.auth().subscribe(activeUser => {
      this.activeUser = activeUser;
    });
  }

  onLogOut() {
    this.authService.logout().subscribe(() => {
      // Redirigir al usuario a la página de inicio o login después de cerrar sesión
      window.location.href = '/';
    });
  }
}
