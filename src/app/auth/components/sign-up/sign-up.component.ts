import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountData } from '../../types/account-data';
import { AuthService } from '../../services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent  {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  })

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.form.invalid) return;
    const user = this.form.getRawValue() as AccountData;
    this.authService.signup(user).subscribe({
      next: () => {
        alert('Usuario agregado');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        console.log('redirecting to Home');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      }
    })
  }

  onRevealPassword(pwInput: HTMLInputElement) {
    if (pwInput.type == 'password') {
      pwInput.type = 'text';
    } else {
      pwInput.type = 'password';
    }
  }
}
