import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  @Input({required: true}) userId!: string | undefined;
  userFavorites: Entrepreneurship[] = [];
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';

  authService = inject(AuthService);
  favoriteListService = inject(FavoriteListService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

    if(this.userId)
      this.favoriteListService.getUserFavoritesDetails(this.userId).subscribe(favorites => {
        this.userFavorites = favorites.filter((fav: Entrepreneurship) => fav.activated === true);
      });
  }
}
