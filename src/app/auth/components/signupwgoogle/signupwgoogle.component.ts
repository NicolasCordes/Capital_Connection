import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountData } from '../../../types/account-data';
import { CommonModule } from '@angular/common';
import { Address } from '../../../types/address.model';
import { AddressFormComponent } from "../../../features/user/address-form/address-form.component";
import { AuthService } from '../../../services/auth.service';
import { Observable, of, map, catchError } from 'rxjs';
import { Account } from '../../../types/account.model';

@Component({
  selector: 'app-signupwgoogle',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, AddressFormComponent],
  templateUrl: './signupwgoogle.component.html',
  styleUrl: './signupwgoogle.component.css'
})
export class SignupwgoogleComponent implements OnInit {
  email!: string;
  submitPress = false;

  private formBuilder = inject(FormBuilder);

  // Dentro de la clase SignupwgoogleComponent
  noNumbersValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && /\d/.test(value)) {
      return { hasNumber: true };
    }
    return null;
  };

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4)], [this.checkIfUsernameExists()]],
    email: ['', [Validators.required, Validators.email], [this.checkIfEmailExists()]],
    name: ['', [Validators.required, this.noNumbersValidator]], // Validador agregado
    surname: ['', [Validators.required, this.noNumbersValidator]], // Validador agregado
    dateOfBirth: ['', [Validators.required, this.ageValidator]], // Aquí sigue la validación
    yearsOfExperience: [0, [
      Validators.required,
      Validators.min(0),
      Validators.max(99)
    ]],
    industry: ['', Validators.required],
    wallet: [{ value: 0, disabled: true }],
    address: this.formBuilder.group({
      street: ['', Validators.required],
      number: [0, [Validators.required, Validators.min(0)]],
      locality: ['', Validators.required],
      province: ['', Validators.required],
      type: ['', Validators.required],
      isActivated: [true],
    })
  });


  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) {
  }

  clearZero(): void {
    // Verifica si el valor es 0 antes de borrarlo
    if (this.form.controls['yearsOfExperience'].value === 0) {
      this.form.controls['yearsOfExperience'].setValue(null);
    }
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      console.log('Parámetros recibidos:', params);

      this.email = params['email'];
      // Verificamos si los valores de given_name o family_name son null o undefined y asignamos un valor por defecto
      const givenName = params['given_name'] || ''; // Si es null o undefined, asigna una cadena vacía
      const familyName = params['family_name'] || ''; // Lo mismo para family_name

      if (!this.email) {
        this.router.navigate(['/']); // Redirigir si no hay correo
      }

      // Asignar valores a los campos del formulario
      this.form.patchValue({
        email: this.email,
        name: givenName,
        surname: familyName
      });
    });
  }


  checkIfEmailExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      return this.authService.checkIfEmailExists(email).pipe(
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  checkIfUsernameExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value;
      return this.authService.checkIfUsernameExists(username).pipe(
        map(exists => (exists ? { usernameExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }


  ageValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = new Date(control.value);
    const currentDate = new Date();

    if (birthDate > currentDate) {
      return { futureDate: true };
    }

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 ||
        (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 16) {
      return { underAge: true };
    } else if (age > 120) {
      return { overAge: true };
    }

    return null;
  }



  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const userData = this.form.getRawValue();

    const user = {
      ...userData,
      wallet: 0,
      favorites: [],
      isActivated: true,
      password: null,
    } as unknown as Account;

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






  updateAddress(address: Address) {
    const updatedAddress = {
      ...address,
      isActivated: true
    };

    this.form.get('address')?.setValue(updatedAddress);
  }
}
