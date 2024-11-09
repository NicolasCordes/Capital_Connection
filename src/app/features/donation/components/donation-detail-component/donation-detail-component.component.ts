import { Component } from '@angular/core';
import { Entrepreneurship } from '../../../entrepreneurship/models/entrepreneurship.model';
import { Donation } from '../../models/donation.model';
import { ActivatedRoute } from '@angular/router';
import { EntrepreneurshipService } from '../../../entrepreneurship/services/entrepreneurship.service';
import { DonationService } from '../../services/donation.service';
import { DonationFormComponentComponent } from "../donation-form-component/donation-form-component.component";
import { DonationListComponentComponent } from "../donation-list-component/donation-list-component.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donation-detail-component',
  standalone: true,
  imports: [DonationFormComponentComponent, DonationListComponentComponent, CommonModule],
  templateUrl: './donation-detail-component.component.html',
  styleUrl: './donation-detail-component.component.css'
})
export class DonationDetailComponentComponent {
  entrepreneurship: Entrepreneurship | null = null;
  donations: Donation[] = [];

  constructor(
    private route: ActivatedRoute,
    private entrepreneurshipService: EntrepreneurshipService,
    private donationService: DonationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entrepreneurshipService
        .getEntrepreneurshipById(id)
        .subscribe((entrepreneurship) => {
          this.entrepreneurship = entrepreneurship;
          this.loadDonations(id); // Cargar donaciones del emprendimiento
        });
    }
  }

  private loadDonations(id: string) {
    this.donationService
      .getDonationsByEntrepreneurshipId(Number(id))
      .subscribe((donations) => {
        this.donations = donations;
      });
  }

  onDonationAdded(donation: Donation) {
    this.donations.push(donation); // Añadir la nueva donación a la lista
  }
}
