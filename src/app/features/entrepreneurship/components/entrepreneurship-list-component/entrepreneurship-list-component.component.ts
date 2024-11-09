import { Component, EventEmitter, OnInit } from '@angular/core';
import { Entrepreneurship } from '../../models/entrepreneurship.model';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-entrepreneurship-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrepreneurship-list-component.component.html',
  styleUrl: './entrepreneurship-list-component.component.css',
})
export class EntrepreneurshipListComponent implements OnInit {
  entrepreneurships: Entrepreneurship[] = [];

  constructor(
    private entrepreneurshipService: EntrepreneurshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const page = 0;  // Página inicial
    const size = 20; // Tamaño de la página

    // Llamada al servicio para obtener los datos
    this.entrepreneurshipService.getEntrepreneurship(page, size).subscribe(
      (data) => {
        console.log(data);  // Ver la respuesta completa
        if (data && data.content) {
          this.entrepreneurships = data.content;  // Asignar los emprendimientos a la propiedad
        } else {
          console.log('No se recibieron datos de la API.');
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);  // Manejar errores
      }
    );
  }


  navigateToDetails(id: string|null): void {
    this.router.navigate([`/entrepreneurships/${id}`]);
  }

  deleteEntrepreneurship(id: string|null): void {
    this.entrepreneurshipService.deleteEntrepreneurship(id).subscribe(() => {
      this.entrepreneurships = this.entrepreneurships.filter(
        (entrepreneurship) => entrepreneurship.id !== id
      );
    });
  }
}
