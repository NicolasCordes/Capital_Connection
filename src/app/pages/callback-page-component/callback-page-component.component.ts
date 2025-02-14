import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';

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
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Recuperar el parámetro "code" de la URL
    this.route.queryParams.subscribe(params => {
      const code = params['code'];

      if (code) {
        this.getOAuth2Token(code);
      } else {
        // Si no hay código en la URL, manejar el error
        console.error('No se encontró el código de autorización');
      }
    });
  }

  getOAuth2Token(code: string): void {
    const url = environment.urlBase  // URL de tu backend

    // Enviar el código al backend para obtener los tokens
    this.http.post(`${url}/auth/oauth2/token`, { code }, { withCredentials: true }).subscribe(
        (response: any) => {
          if (response.redirect) {

            // Construir los queryParams dinámicamente
            const queryParams: any = { email: response.email };

            if (response.given_name) {
                queryParams.given_name = response.given_name;
            }
            if (response.family_name) {
                queryParams.family_name = response.family_name;
            }
            if(response.provider_id) {
              queryParams.provider_id = response.provider_id;
            }

            // Redirigir a la página de registro con los queryParams
            this.router.navigate([response.redirect], { queryParams });
        } else {
                // Si no hay redirección, guardar los tokens y navegar a la página principal
                if (response.access_token && response.refresh_token) {

                  // Guardar tokens en el localStorage
                  localStorage.setItem('access_token', response.access_token);
                  localStorage.setItem('refresh_token', response.refresh_token);

                  // Decodificar el token de acceso
                  const decodedToken = this.tokenService.decodeToken(response.access_token);
                  if (decodedToken) {
                      const activeUser = { username: decodedToken.sub, id: decodedToken.account_id };
                      localStorage.setItem("activeUser", JSON.stringify(activeUser));
                      this.authService.activarUser(activeUser);
                  }

                  // Navegar a la página principal
                  this.router.navigate(['/']);
              } else {
                  console.error('Tokens no recibidos en la respuesta');
                  // Manejar el caso en que no se reciban tokens
              }
            }
        },
        (error) => {
            console.error('Error al obtener el token:', error);
            // Manejar el error
        }
    );
}
}
