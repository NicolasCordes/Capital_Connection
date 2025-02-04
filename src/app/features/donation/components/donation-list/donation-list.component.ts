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
import { StatusPipe } from './status.pipe';  // Asegúrate de que la ruta sea correcta


@Component({

  selector: 'app-donation-list',
  standalone: true,
  imports: [CommonModule,StatusPipe],
  templateUrl: './donation-list.component.html',
  styleUrl: './donation-list.component.css'
})
export class DonationListComponent implements OnInit {

  activeUser: ActiveUser | undefined;
  donateds: Donation[] = [];
  donatedEntrepreneurships: Entrepreneurship[] = [];
  modalMessage: string = '';
  isModalVisible: boolean = false;

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

  loadDonatedEntrepreneurships(userId: number | undefined) {
    this.donationService.getDonationsByAccountId(this.activeUser?.id).subscribe(donations => {
      this.donateds = donations;
      console.log(donations);

      const entrepreneurshipIds = [...new Set(donations
        .map(donation => donation.id_entrepreneurship)
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

  navigateToDetails(id: number | undefined, isActive:boolean | undefined): void {
    if(isActive){
      this.router.navigate([`/entrepreneurships/${id}`]);
    }else{
      this.modalMessage = 'El emprendimiento ha sido eliminado';
      this.isModalVisible = true;
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
