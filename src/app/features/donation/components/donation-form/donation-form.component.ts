import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Donation } from '../../../../types/donation.model';
import { AuthService } from '../../../../services/auth.service';
import { ActiveUser } from '../../../../types/account-data';
import { DonationService } from '../../../../services/donation.service';

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './donation-form.component.html',
  styleUrl: './donation-form.component.css'
})
export class DonationFormComponent implements OnInit{
  @Output() donationAdded: EventEmitter<Donation> = new EventEmitter();
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)

  ngOnInit(): void {

    this.authService.auth().subscribe({
      next:(user: ActiveUser | undefined) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    }, error:(e:Error)=>{
      console.log(e.message);
    }});
  }
  donationForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]],

  });

  constructor(private fb: FormBuilder, private donationService: DonationService) {}

  onSubmit() {
    if (this.donationForm.valid) {
      const newDonation: Donation = {

        amount: this.donationForm.value.amount ?? 0,
        date: new Date(),
        idUser: this.activeUser?.id
      };

        this.donationAdded.emit(newDonation);
        this.donationForm.reset();
    }
  }
}
