import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      console.log(code) // Aquí obtenemos el código de la URL
      if (code) {
        this.authService.handleOAuth2Callback(code).subscribe(success => {
          if (success) {
            // Si la autenticación fue exitosa, redirigimos al dashboard
            this.router.navigate(['/dashboard']);
          } else {
            // Si no es exitoso, redirigimos al home o mostramos error
            this.router.navigate(['/home']);
          }
        });
      } else {
        // Si no se recibe el código, redirigimos a home o mostramos error
        this.router.navigate(['/home']);
      }
    });
  }
}
