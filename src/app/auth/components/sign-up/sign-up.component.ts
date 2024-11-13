import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountData } from '../../../types/account-data';
import { CommonModule } from '@angular/common';
import { Address } from '../../../types/address.model';
import { AddressFormComponent } from "../../../features/user/address-form/address-form.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, AddressFormComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent {

  submitPress = false;
  private formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/)
    ]],
    confirmPassword: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    surname: ['', Validators.required],
    dateOfBirth: ['', [Validators.required, this.ageValidator]],
    yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
    industry: ['', Validators.required],
    wallet: [{ value: 0, disabled: true }],
    address: this.formBuilder.group({
      street: ['', Validators.required],
      number: [0, Validators.required],
      locality: ['', Validators.required],
      province: ['', Validators.required],
      type: ['', Validators.required]
    })
  });

  constructor(private authService: AuthService, private router: Router) { }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
  
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  ageValidator(control: any): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 16) {
      return { ageInvalid: true };  
    }

    return null; 
  }

  onSubmit() {
    this.submitPress=true;
    if (this.form.invalid) return;

    const { confirmPassword, ...userData } = this.form.getRawValue();

    const user = {
      ...userData,
      wallet: 0, 
      favorites: [] 
    } as AccountData;
  

    this.authService.signup(user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      }
    });
  }


  onRevealPassword(pwInput: HTMLInputElement) {
    if (pwInput.type == 'password') {
      pwInput.type = 'text';
    } else {
      pwInput.type = 'password';
    }
  }

  updateAddress(address: Address) {
    this.form.get('address')?.setValue(address);
  }
}
