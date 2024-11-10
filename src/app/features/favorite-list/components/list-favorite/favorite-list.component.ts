import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FavoriteListService } from '../../services/favorite-list.service';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';
import { Entrepreneurship } from '../../../entrepreneurship/models/entrepreneurship.model';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent implements OnInit {
  userId: string = '';
  userFavorites: Entrepreneurship[] = [];  // Cambiar a tipo Entrepreneurship
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';

  // Inyección de dependencias
  authService = inject(AuthService);
  favoriteListService = inject(FavoriteListService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Obtener el usuario activo
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

    // Obtener el userId desde la ruta
    this.userId = this.route.snapshot.paramMap.get('id')!;

    // Obtener los favoritos del usuario
    this.favoriteListService.getUserFavorites(this.userId).subscribe(favorites => {
      // Mapeo para obtener los emprendimientos completos
      this.userFavorites = favorites.map((favorite: any) => favorite);
    });
  }
}
