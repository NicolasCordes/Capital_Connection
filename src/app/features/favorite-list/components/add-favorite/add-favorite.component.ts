import { Component, inject, OnInit } from '@angular/core';
import { FavoriteListService } from '../../services/favorite-list.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';
import { Entrepreneurship } from '../../../entrepreneurship/models/entrepreneurship.model';

@Component({
  selector: 'app-add-favorite',
  standalone: true,
  imports: [],
  templateUrl: './add-favorite.component.html',
  styleUrls: ['./add-favorite.component.css']
})
export class AddFavoriteComponent implements OnInit {
  entrepreneurshipId: number = 0;  // El ID del emprendimiento que queremos agregar
  entrepreneurship: Entrepreneurship | undefined;  // Emprendimiento completo
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  isProcessing: boolean = false;  // Para evitar múltiples clics
  
  // Inyección de dependencias
  authService = inject(AuthService);
  favoriteListService = inject(FavoriteListService);
  router = inject(Router);

  ngOnInit(): void {
    // Obtener el usuario activo
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

    // Suponiendo que el ID del emprendimiento se pasa en la ruta
    const entrepreneurshipId = this.router.url.split('/').pop(); // Obtén el ID desde la URL
    if (entrepreneurshipId) {
      this.favoriteListService.getEntrepreneurshipById(Number(entrepreneurshipId)).subscribe((entrepreneurship) => {
        this.entrepreneurship = entrepreneurship;
        this.entrepreneurshipId = entrepreneurship.id!;  // Asignar el ID del emprendimiento
      });
    }
  }

  addFavorite(): void {
    // Verifica si el usuario está autenticado antes de agregar el favorito
    if (this.activeUser) {
      const userId = this.activeUser.id;

      // Deshabilitar el botón para evitar múltiples clics
      this.isProcessing = true;

      // Primero obtener los favoritos actuales del usuario
      this.favoriteListService.getUserFavorites(userId).subscribe((favorites) => {
        console.log('Favoritos actuales:', favorites); // Depuración: ver los favoritos actuales

        // Verifica si el emprendimiento ya está en la lista de favoritos
        const isAlreadyFavorite = favorites.some(fav => fav.id === this.entrepreneurshipId);

        if (isAlreadyFavorite) {
          // Si ya está agregado, mostrar un mensaje de advertencia
          console.log('Este emprendimiento ya está en tu lista de favoritos.');
          alert('Este emprendimiento ya está en tu lista de favoritos.');
        } else {
          // Si no está en la lista, agregarlo
          this.favoriteListService.addFavorite(userId, this.entrepreneurshipId).subscribe(updatedUser => {
            console.log('Favorito agregado:', updatedUser);

            // Redirigir a la lista de favoritos
            this.router.navigate([`/favorites/${userId}`]);
          });
        }

        // Habilitar nuevamente el botón después de procesar
        this.isProcessing = false;
      });
    } else {
      console.log('Usuario no autenticado');
    }
  }

}
