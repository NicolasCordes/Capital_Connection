import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {


    if (this.form.invalid) return;

    const { username, password } = this.form.getRawValue();
    this.authService.login(username!, password!).subscribe({
      next: (loggedIn) => {
        if (loggedIn) {
          this.router.navigate(['/']);
        } else {
          console.log('error en las credenciales');
        }
      },
      error: console.log
    });
  }



  onRevealPassword(pwInput: HTMLInputElement) {
    if (pwInput.type == 'password') {
      pwInput.type = 'text';
    } else {
      pwInput.type = 'password';
    }
  }
}
