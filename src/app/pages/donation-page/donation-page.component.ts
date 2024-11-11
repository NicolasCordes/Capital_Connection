import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/service.service';
import { ActiveUser } from '../../auth/types/account-data';
import { Donation } from '../../features/donation/models/donation.model';
import { DonationService } from '../../features/donation/services/donation.service';
import { Entrepreneurship } from '../../features/entrepreneurship/models/entrepreneurship.model';
import { EntrepreneurshipService } from '../../features/entrepreneurship/services/entrepreneurship.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-donation-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-page.component.html',
  styleUrl: './donation-page.component.css'
})
export class DonationPageComponent implements OnInit {

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