import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Donation } from '../../models/donation.model';
import { DonationService } from '../../services/donation.service';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-donation-form-component',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './donation-form-component.component.html',
  styleUrl: './donation-form-component.component.css'
})
export class DonationFormComponentComponent implements OnInit{

  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });
  }
  donationForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    
  });

  @Output() donationAdded: EventEmitter<Donation> = new EventEmitter();

  constructor(private fb: FormBuilder, private donationService: DonationService) {}

  onSubmit() {
    if (this.donationForm.valid) {
      const newDonation: Donation = {
        amount: this.donationForm.value.amount ?? 0,  // Mantener como BigInt
        date: new Date()  // Convertir la fecha a solo fecha sin hora
      };
  
      // Aquí ya no usamos JSON.stringify, solo pasamos el objeto
      this.donationService.postDonation(newDonation).subscribe((donation) => {
        this.donationAdded.emit(donation);
        this.donationForm.reset();
      });
    }
  }
}
