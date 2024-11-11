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
  entrepreneurshipId: number = 0;  
  entrepreneurship: Entrepreneurship | undefined;  
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  isProcessing: boolean = false;  
  
  authService = inject(AuthService);
  favoriteListService = inject(FavoriteListService);
  router = inject(Router);

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

    const entrepreneurshipId = this.router.url.split('/').pop(); 
    if (entrepreneurshipId) {
      this.favoriteListService.getEntrepreneurshipById(Number(entrepreneurshipId)).subscribe((entrepreneurship) => {
        this.entrepreneurship = entrepreneurship;
        this.entrepreneurshipId = entrepreneurship.id!;  
      });
    }
  }

  addFavorite(): void {
    if (this.activeUser) {
      const userId = this.activeUser.id;

      this.isProcessing = true;

      this.favoriteListService.getUserFavorites(userId).subscribe((favorites) => {
        console.log('Favoritos actuales:', favorites); 

        const isAlreadyFavorite = favorites.some(fav => fav.id === this.entrepreneurshipId);

        if (isAlreadyFavorite) {
          console.log('Este emprendimiento ya está en tu lista de favoritos.');
          alert('Este emprendimiento ya está en tu lista de favoritos.');
        } else {
          this.favoriteListService.addFavorite(userId, this.entrepreneurshipId).subscribe(updatedUser => {
            console.log('Favorito agregado:', updatedUser);

            this.router.navigate([`/favorites/${userId}`]);
          });
        }

        this.isProcessing = false;
      });
    } else {
      console.log('Usuario no autenticado');
    }
  }

}
