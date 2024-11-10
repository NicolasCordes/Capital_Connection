import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/service.service';
import { ActiveUser } from '../../../auth/types/account-data';
import { Entrepreneurship } from '../../entrepreneurship/models/entrepreneurship.model';
import { DonationService } from '../../donation/services/donation.service';
import { EntrepreneurshipService } from '../../entrepreneurship/services/entrepreneurship.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Donation } from '../../donation/models/donation.model';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports:[CommonModule,],
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  activeUser: ActiveUser | undefined;
  donateds: Donation[] = [];
  donatedEntrepreneurships: Entrepreneurship[] = [];

  authService = inject(AuthService);
  donationService = inject(DonationService);
  entrepreneurshipService = inject(EntrepreneurshipService);
  router = inject(Router);
  amounts: number[] = [];
  ngOnInit() {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      if ( this.activeUser) {
        this.loadDonatedEntrepreneurships( this.activeUser.id);
      }
    });
  }

  // Cargar los emprendimientos a los que el usuario ha donado
  loadDonatedEntrepreneurships(userId: string) {
    this.donationService.getDonationsByUserId(userId).subscribe(donations => {

      this.donateds = donations;
      console.log(donations);
      const entrepreneurshipIds = donations.map(donation => donation.idEntrepreneurship).filter(id => id !== undefined);

      // Cargar cada emprendimiento por su id
      entrepreneurshipIds.forEach(id => {
        this.entrepreneurshipService.getEntrepreneurshipById(id!).subscribe(entrepreneurship => {
          this.donatedEntrepreneurships.push(entrepreneurship);
        });
      });
    });
  }

  // Navegar a los detalles de un emprendimiento
  navigateToDetails(id: number | undefined): void {
    if (id) {
      this.router.navigate([`/entrepreneurships/${id}`]);
    }
  }
}
