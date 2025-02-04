import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent implements OnInit {

  ngOnInit(): void {
    console.log('Ruta de pendiente cargada.');

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
