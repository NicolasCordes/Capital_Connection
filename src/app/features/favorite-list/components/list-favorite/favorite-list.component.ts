import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ActiveUser } from '../../../../types/account-data';
import { FavoriteListService } from '../../../../services/favorite-list.service';
import { Entrepreneurship } from '../../../../types/entrepreneurship.model';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent implements OnInit {
  @Input({required: true}) userId!: number | undefined;
  userFavorites: Entrepreneurship[] = [];
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';

  authService = inject(AuthService);
  favoriteListService = inject(FavoriteListService);
  route = inject(ActivatedRoute);
  router = inject(Router);


  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

    if(this.userId)
      this.favoriteListService.getUserFavorites(this.userId).subscribe(favorites => {
        this.userFavorites = favorites.filter((fav: Entrepreneurship) => fav.isActivated === true);
      });
  }

  DeleteFavorites(id:number | undefined): void {

    if (id && this.userId) {

      this.favoriteListService.removeFavorite(this.userId, id).subscribe(
        () => {
          this.userFavorites.splice(this.userFavorites.findIndex(f => f.id === id && f.id_account === this.userId),1)
        },
        error => {
          console.error('Error al eliminar de favoritos', error);
        }
      );
    } else {
      console.error('El usuario no está autenticado.');
    }
  }

  navigateToDetails(id: number | undefined): void {
      this.router.navigate([`/entrepreneurships/${id}`]);
  }
}
