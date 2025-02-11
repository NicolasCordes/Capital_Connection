import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback-page-component.component.html',
  styleUrls: ['./callback-page-component.component.css']
})
export class CallbackPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    // Recuperar el parámetro "code" de la URL
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      console.log(params);
      console.log(code);
      if (code) {
        this.getOAuth2Token(code);
      } else {
        // Si no hay código en la URL, manejar el error
        console.error('No se encontró el código de autorización');
      }
    });
  }

  getOAuth2Token(code: string): void {
    const url = 'http://localhost:8080/auth/oauth2/token';  // URL de tu backend

    // Enviar el código al backend para obtener los tokens
    this.http.post('http://localhost:8080/auth/oauth2/token', { code }, { withCredentials: true }).subscribe(
        (response: any) => {
            if (response.redirect) {
              console.log('rta',response);
                // Si el backend indica que hay que redirigir, navegar a la página de registro
                this.router.navigate([response.redirect], { queryParams: { email: response.email, provider_id: response.provider_id, given_name: response.given_name, family_name: response.family_name } });
            } else {
                // Si no hay redirección, guardar los tokens y navegar a la página principal
                console.log('Tokens recibidos:', response);
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
                const decodedToken = this.tokenService.decodeToken(response.access_token);
                const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };
        
                localStorage.setItem("activeUser", JSON.stringify(activeUser));
                this.router.navigate(['/']);
                this.router.navigate(['/']);
            }
        },
        (error) => {
            console.error('Error al obtener el token:', error);
            // Manejar el error
        }
    );
}
}
