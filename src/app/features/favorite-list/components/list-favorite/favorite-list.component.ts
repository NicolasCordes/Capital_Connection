import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FavoriteListService } from '../../services/favorite-list.service';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent {
  userId: string = '';
  userFavorites: any[] = [];

  constructor(private favoriteListService: FavoriteListService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el userId desde la ruta
    this.userId = this.route.snapshot.paramMap.get('id')!;

    // Obtener los favoritos del usuario
    this.favoriteListService.getUserById(this.userId).subscribe(user => {
      this.userFavorites = user.favorites || [];
    });
  }
}
