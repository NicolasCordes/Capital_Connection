import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private formBuilder = inject(FormBuilder);
  errorMessage: string | null = null;

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
          this.errorMessage = 'Error en las credenciales. Verifique el nombre de usuario o la contraseña'; // Asignamos el mensaje de error aquí
        }
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al intentar iniciar sesión. Intente nuevamente más tarde.'; // En caso de un error de red o similar
        console.error(err); // Opcionalmente logueamos el error en la consola para depuración
      }
    });
  }

  onLoginWithOAuth2() {
    this.authService.loginWithOAuth2();
  }

  onRevealPassword(pwInput: HTMLInputElement) {
    if (pwInput.type == 'password') {
      pwInput.type = 'text';
    } else {
      pwInput.type = 'password';
    }
  }
}
