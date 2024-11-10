import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FavoriteListService } from '../../services/favorite-list.service';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent implements OnInit{
  userId: string = '';
  userFavorites: any[] = [];
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)

  constructor(private favoriteListService: FavoriteListService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });
    // Obtener el userId desde la ruta
    this.userId = this.route.snapshot.paramMap.get('id')!;

    // Obtener los favoritos del usuario
    this.favoriteListService.getUserById(this.userId).subscribe(user => {
      this.userFavorites = user.favorites || [];
    });
  }
}
