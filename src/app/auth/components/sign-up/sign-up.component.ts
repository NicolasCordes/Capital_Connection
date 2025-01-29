import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountData } from '../../../types/account-data';
import { CommonModule } from '@angular/common';
import { Address } from '../../../types/address.model';
import { AddressFormComponent } from "../../../features/user/address-form/address-form.component";
import { AuthService } from '../../../services/auth.service';
import { Observable, of, map, catchError } from 'rxjs';

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
    username: ['', [Validators.required, Validators.minLength(4)], [this.checkIfUsernameExists()]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/)
    ]],
    confirmPassword: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email],[this.checkIfEmailExists()]],
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
      type: ['', Validators.required],
      isActivated: [true]
    })
  }, {
    validator: this.passwordMatchValidator
  });

  constructor(private authService: AuthService, private router: Router) { }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { match: true }; // Nombre del error de validación
    }

    return null;
  }

  checkIfEmailExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      return this.authService.checkIfEmailExists(email).pipe(
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null)) // Si hay un error, no marcar como inválido
      );
    };
  }


      checkIfUsernameExists(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
          const username = control.value;
          return this.authService.checkIfUsernameExists(username).pipe(
            map(exists => (exists ? { usernameExists: true } : null)),
            catchError(() => of(null)) // Si hay un error, no marcar como inválido
          );
        };
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
    if (this.form.invalid || this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      return;
    }

    const { confirmPassword, ...userData } = this.form.getRawValue();

    const user = {
      ...userData,
      wallet: 0,
      favorites: [],
      isActivated: true,
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
    const updatedAddress = {
      ...address,
      isActivated: true
    };

    this.form.get('address')?.setValue(updatedAddress);
  }
}
