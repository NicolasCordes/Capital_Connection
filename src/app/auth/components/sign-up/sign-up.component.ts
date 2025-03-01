import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountData } from '../../../types/account-data';
import { CommonModule } from '@angular/common';
import { Address } from '../../../types/address.model';
import { AddressFormComponent } from "../../../features/user/address-form/address-form.component";
import { AuthService } from '../../../services/auth.service';
import { Observable, of, map, catchError, Subject, takeUntil } from 'rxjs';
import { Account } from '../../../types/account.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, AddressFormComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();

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
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/)
    ]],
    confirmPassword: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email],[this.checkIfEmailExists()]],
    name: ['', [Validators.required, this.noNumbersValidator]], // Validador agregado
    surname: ['', [Validators.required, this.noNumbersValidator]], // Validador agregado
    dateOfBirth: ['', [Validators.required, this.ageValidator]],
    yearsOfExperience: [0, [
      Validators.required,
      Validators.min(0),
      Validators.max(99),
      this.experienceValidator('dateOfBirth')
    ]],
    industry: ['', Validators.required],
    wallet: [{ value: 0, disabled: true }],
    address: this.formBuilder.group({
      street: ['', Validators.required],
      number: [0, [Validators.required, Validators.min(1)]],
      locality: ['', Validators.required],
      province: ['', Validators.required],
      type: ['', Validators.required],
      isActivated: [true]
    })
  }, {
    validator: this.passwordMatchValidator
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.form.get('dateOfBirth')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.get('yearsOfExperience')?.updateValueAndValidity();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  experienceValidator(dateOfBirthControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const yearsOfExperience = control.value;
      const dateOfBirthControl = control.parent?.get(dateOfBirthControlName);

      // Verificar si el control de fecha de nacimiento existe y tiene un valor válido
      if (!dateOfBirthControl || !dateOfBirthControl.value) {
        return null; // No hay fecha de nacimiento, no se puede validar
      }

      const dateOfBirth = new Date(dateOfBirthControl.value);
      const today = new Date();

      // Validar que la fecha de nacimiento no sea futura
      if (dateOfBirth > today) {
        return null; // No validar si la fecha de nacimiento es futura
      }

      // Calcular la edad
      let age = today.getFullYear() - dateOfBirth.getFullYear();

      // Ajustar la edad si aún no ha pasado el cumpleaños este año
      if (today.getMonth() < dateOfBirth.getMonth() ||
          (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate())) {
        age--;
      }

      // Validar que la edad sea mayor o igual a 14 años
      if (age < 14) {
        return null; // No validar si la edad es menor a 14 años
      }

      const maxExperience = age - 14;

      // Validar los años de experiencia
      if (yearsOfExperience > maxExperience) {
        return { maxExperience: { max: maxExperience, actual: yearsOfExperience } };
      }

      return null;
    };
  }


  clearZero(): void {
    // Verifica si el valor es 0 antes de borrarlo
    if (this.form.controls['yearsOfExperience'].value === 0) {
      this.form.controls['yearsOfExperience'].setValue(null);
    }
  }

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

        // Validaciones separadas
        if (age < 16) {
          return { minAge: true };
        }
        if (age > 120) {
          return { maxAge: true };
        }

        return null;
      }


  onSubmit() {
    this.submitPress=true;
    if (this.form.invalid || this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.submitPress = false; // Rehabilitar el botón si el formulario es inválido
      return;
    }

    const { confirmPassword, ...userData } = this.form.getRawValue();

    const user = {
      ...userData,
      wallet: 0,
      favorites: [],
      isActivated: true,
      providerId:null,
    } as Account;


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
    // Verificar si el campo "number" es null o 0


    const updatedAddress = {
      ...address,
      isActivated: true
    };


    // Actualiza el formulario principal con la nueva dirección
    this.form.get('address')?.setValue(updatedAddress);

    // Marca el campo como "touched" para que se muestren los mensajes de error
    this.form.get('address')?.markAsTouched();

    // Actualiza el estado de validación del formulario principal
    this.form.updateValueAndValidity();
  }
}
