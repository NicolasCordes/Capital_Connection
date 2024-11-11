import { Component, inject, OnInit } from '@angular/core'; 
import { AuthService } from '../../../auth/services/service.service';
import { ActiveUser } from '../../../auth/types/account-data';
import { Entrepreneurship } from '../../entrepreneurship/models/entrepreneurship.model';
import { DonationService } from '../../donation/services/donation.service';
import { EntrepreneurshipService } from '../../entrepreneurship/services/entrepreneurship.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Donation } from '../../donation/models/donation.model';
import { FavoriteListComponent } from "../../favorite-list/components/list-favorite/favorite-list.component";
import { DonationPageComponent } from '../../../pages/donation-page/donation-page.component';
import { EntrepreneurshipsUpdatesComponent } from '../../entrepreneurship/components/entrepreneurships-updates/entrepreneurships-updates.component';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [CommonModule, FavoriteListComponent,DonationPageComponent,EntrepreneurshipsUpdatesComponent],
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {

  activeUser: ActiveUser | undefined;
  donateds: Donation[] = [];
  donatedEntrepreneurships: Entrepreneurship[] = [];
  createdEntrepreneurships: Entrepreneurship[] = []; 
  currentSection: string = ''; 
  favorites: boolean = false;
  donations: boolean = false;
  myentre: boolean = false;

  authService = inject(AuthService);
  donationService = inject(DonationService);
  entrepreneurshipService = inject(EntrepreneurshipService);
  router = inject(Router);
  amounts: number[] = [];

  ngOnInit() {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
    });
  }

 


  navigateToDetails(id: number | undefined): void {
    if (id) {
      this.router.navigate([`/entrepreneurships/${id}`]);
    }
  }

 
goToDonations(): void {
  if(this.donations === false){
   
    this.donations = true;
    console.log(this.donations);
  }else{
    this.donations = false;
  }
  this.favorites = false;
  this.myentre = false;

}
  
  goToFavorites(): void {
    if(this.favorites === false){
      console.log(this.favorites);
      this.favorites = true;
    }else{
      this.favorites = false;
    }
    this.donations = false;
    this.myentre = false;
  }


  goToMyEntrepreneurships(): void {
    if(this.myentre === false){
      console.log(this.myentre);
      this.myentre = true;
    }else{
      this.myentre = false;
    }
    this.favorites = false;
    this.donations = false;
  }
}
