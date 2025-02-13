import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit{

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
