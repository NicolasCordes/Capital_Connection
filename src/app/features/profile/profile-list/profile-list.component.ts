import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/service.service';
import { ActiveUser } from '../../../auth/types/account-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.css'
})
export class ProfileListComponent implements OnInit {
    activeUser: ActiveUser | undefined;
    router = inject(Router);
    authService= inject(AuthService)

    ngOnInit() {
      this.authService.auth().subscribe((user) => {
        this.activeUser = user;
      });
    }

    // Método para redirigir a la ruta de favoritos del usuario activo
  goToFavorites(): void {
    if (this.activeUser) {
      this.router.navigate([`/favorites/${this.activeUser.id}`]);  // Redirige a la ruta de favoritos
    } else {
      console.error('No active user found');
    }
  }


  }
