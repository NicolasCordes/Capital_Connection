import { Component, Input } from '@angular/core';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donation-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-list-component.component.html',
  styleUrl: './donation-list-component.component.css'
})
export class DonationListComponentComponent {
  @Input() entrepreneurshipId: string | null = null;
  donations: Donation[] = [];

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    if (this.entrepreneurshipId) {
      this.donationService
        .getDonationsByEntrepreneurshipId(Number(this.entrepreneurshipId))
        .subscribe((donations) => {
          this.donations = donations;
        });
    }
  }


   convertToNumber(amount: BigInt): number {
    return Number(amount);
  }

}
