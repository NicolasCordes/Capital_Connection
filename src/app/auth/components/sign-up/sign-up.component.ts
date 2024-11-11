import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountData } from '../../types/account-data';
import { AuthService } from '../../services/service.service';
import { CommonModule } from '@angular/common';
import { Address } from '../../../features/user/models/address.model';
import { AddressFormComponent } from "../../../features/user/address-form/address-form.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, AddressFormComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    surname: ['', Validators.required],
    dateOfBirth: ['', [Validators.required, this.ageValidator]],  // Agregar ageValidator aquí
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
 
  ageValidator(control: any): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const currentDate = new Date();
    
    // Calcular la edad
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    
    // Si la fecha de nacimiento aún no ha llegado este año, restar un año
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    // Validar si la edad es mayor o igual a 16 años
    if (age < 16) {
      return { ageInvalid: true };  // El error se llamará "ageInvalid"
    }

    return null;  // Si la edad es válida, no hay error
  }

  onSubmit() {
    if (this.form.invalid) return;



    const user = {
      ...this.form.getRawValue(),
      wallet: 0, 
      favorites: [] 
    } as AccountData;

    this.authService.signup(user).subscribe({
      next: () => {
        alert('Usuario agregado');
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
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  }

  updateAddress(address: Address) {
    this.form.get('address')?.setValue(address);
  }
}
