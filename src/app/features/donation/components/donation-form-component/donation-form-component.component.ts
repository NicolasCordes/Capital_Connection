import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Donation } from '../../models/donation.model';
import { DonationService } from '../../services/donation.service';

@Component({
  selector: 'app-donation-form-component',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './donation-form-component.component.html',
  styleUrl: './donation-form-component.component.css'
})
export class DonationFormComponentComponent {
  donationForm = this.fb.group({
    amount: ['', [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
  });

  @Output() donationAdded: EventEmitter<Donation> = new EventEmitter();

  constructor(private fb: FormBuilder, private donationService: DonationService) {}

  onSubmit() {
    if (this.donationForm.valid) {
      const newDonation: Donation = {
        id: undefined,  // O null si prefieres
        amount: BigInt(this.donationForm.value.amount ?? 0),  // Asigna 0 si amount es null o undefined
        date: new Date(this.donationForm.value.date ?? new Date()),  // Asigna la fecha actual si date es null o undefined
      };
  
      this.donationService.postDonation(newDonation).subscribe((donation) => {
        this.donationAdded.emit(donation);
        this.donationForm.reset();
      });
    }
  }
}
