import { Component } from '@angular/core';
import { FavoriteListService } from '../../services/favorite-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-favorite',
  standalone: true,
  imports: [],
  templateUrl: './add-favorite.component.html',
  styleUrl: './add-favorite.component.css'
})
export class AddFavoriteComponent {
  userId: string = '2410'; // El ID del usuario al que le agregamos el favorito
  entrepreneurshipId: number = 0; // El ID del emprendimiento que queremos agregar

  constructor(private favoriteListService: FavoriteListService, private router: Router) {}

  addFavorite(): void {
    this.favoriteListService.addFavorite(this.userId, this.entrepreneurshipId).subscribe(updatedUser => {
      console.log('Favorito agregado:', updatedUser);
      // Redirigir a la lista de favoritos
      this.router.navigate(['/favorites', this.userId]);
    });
  }
}
