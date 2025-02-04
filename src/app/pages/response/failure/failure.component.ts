import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-failure',
  standalone: true,
  imports: [],
  templateUrl: './failure.component.html',
  styleUrl: './failure.component.css'
})
export class FailureComponent implements OnInit {

  ngOnInit(): void {
    console.log('Ruta de fallo cargada.');

    // Verificar si hay una URL de retorno guardada en localStorage
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      console.log('Redirigiendo a la página de retorno:', returnUrl);
      localStorage.removeItem('returnUrl');

      window.location.href = returnUrl;  // Redirigir a la página anterior
    } else {
      console.log('No se encontró una URL de retorno, redirigiendo al home...');
      window.location.href = 'http://localhost:4200';  // Redirigir al home si no hay URL de retorno
    }
  }
}
