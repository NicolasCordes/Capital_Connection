import { Component, inject, Input, OnInit } from '@angular/core';
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
      this.favoriteListService.getUserFavorites(this.userId).subscribe(favorites => {
        this.userFavorites = favorites.filter((fav: Entrepreneurship) => fav.activated === true);
      });
  }
}
