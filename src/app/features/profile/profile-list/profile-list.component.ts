import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { DonationService } from "../../../services/donation.service";
import { EntrepreneurshipService } from "../../../services/entrepreneurship.service";
import { ActiveUser } from "../../../types/account-data";
import { Donation } from "../../../types/donation.model";
import { Entrepreneurship } from "../../../types/entrepreneurship.model";
import { DonationListComponent } from "../../donation/components/donation-list/donation-list.component";
import { FavoriteListComponent } from "../../favorite-list/components/list-favorite/favorite-list.component";
import { EntrepreneurshipsUpdatesComponent } from "../../entrepreneurship/components/entrepreneurships-updates/entrepreneurships-updates.component";


@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [CommonModule, FavoriteListComponent,DonationListComponent,EntrepreneurshipsUpdatesComponent],
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
