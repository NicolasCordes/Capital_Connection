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

    // Verificar si hay una URL de retorno guardada en localStorage
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      localStorage.removeItem('returnUrl');

      window.location.href = returnUrl;  // Redirigir a la página anterior
    } else {
      window.location.href = 'http://localhost:4200';  // Redirigir al home si no hay URL de retorno
    }
  }
}
