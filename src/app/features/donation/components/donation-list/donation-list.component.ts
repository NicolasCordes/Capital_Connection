import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { AuthService } from "../../../../services/auth.service";
import { DonationService } from "../../../../services/donation.service";
import { EntrepreneurshipService } from "../../../../services/entrepreneurship.service";
import { ActiveUser } from "../../../../types/account-data";
import { Donation } from "../../../../types/donation.model";
import { Entrepreneurship } from "../../../../types/entrepreneurship.model";


@Component({
  selector: 'app-donation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-list.component.html',
  styleUrl: './donation-list.component.css'
})
export class DonationListComponent implements OnInit {

  activeUser: ActiveUser | undefined;
  donateds: Donation[] = [];
  donatedEntrepreneurships: Entrepreneurship[] = [];
  createdEntrepreneurships: Entrepreneurship[] = []; // Nueva propiedad para los emprendimientos creados por el usuario

  authService = inject(AuthService);
  donationService = inject(DonationService);
  entrepreneurshipService = inject(EntrepreneurshipService);
  router = inject(Router);
  amounts: number[] = [];

  ngOnInit() {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      if (this.activeUser) {
        this.loadDonatedEntrepreneurships(this.activeUser?.id);
      }
    });
  }

  loadDonatedEntrepreneurships(userId: string) {
    this.donationService.getDonationsByUserId(userId).subscribe(donations => {
      this.donateds = donations;
      console.log(donations);

      const entrepreneurshipIds = [...new Set(donations
        .map(donation => donation.idEntrepreneurship)
        .filter(id => id !== undefined)
      )];

      this.donatedEntrepreneurships = [];

      if (entrepreneurshipIds.length > 0) {
        const entrepreneurshipRequests = entrepreneurshipIds.map(id =>
          this.entrepreneurshipService.getEntrepreneurshipById(id!)
        );

        forkJoin(entrepreneurshipRequests).subscribe({
          next: (entrepreneurships) => {
            this.donatedEntrepreneurships = entrepreneurships;
          },
          error: (error) => {
            console.error('Error al cargar los emprendimientos', error);
          }
        });
      }
    });
  }
}
