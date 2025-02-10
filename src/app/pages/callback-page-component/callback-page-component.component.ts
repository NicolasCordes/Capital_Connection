import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback-page-component.component.html',
  styleUrls: ['./callback-page-component.component.css']
})
export class CallbackPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Aquí puedes extraer los parámetros del callback desde la URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // Guardar el token en el estado global, redirigir al usuario, etc.
        console.log('Token recibido:', token);
        // Redirigir a la página principal o a donde sea necesario
        this.router.navigate(['/home']);
      } else {
        console.error('No se ha recibido el token');
      }
    });
  }
}
