import { Component, EventEmitter, HostListener, OnInit } from '@angular/core';
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
  page = 0;                // Página actual
  size = 6;               // Tamaño de cada página
  isLoading = false;       // Estado de carga
  hasMore = true;          // Indica si hay más datos para cargar


  constructor(
    private entrepreneurshipService: EntrepreneurshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntrepreneurships();
  }

   // Función para cargar datos
   loadEntrepreneurships(): void {
    if (this.isLoading || !this.hasMore) return;  // No cargar si ya está en proceso o no hay más datos
    this.isLoading = true;

    this.entrepreneurshipService.getEntrepreneurship(this.page, this.size).subscribe(
      (data) => {
        if (data && data.content) {
          this.entrepreneurships = [...this.entrepreneurships, ...data.content];  // Añadir más datos a la lista actual
          this.hasMore = data.content.length === this.size;  // Determina si hay más datos para cargar
          this.page++;  // Incrementa el número de página
        } else {
          this.hasMore = false;
        }
        this.isLoading = false;  // Finaliza el estado de carga
      },
      (error) => {
        console.error('Error al obtener los datos:', error);  // Manejo de errores
        this.isLoading = false;
      }
    );
  }

   // Navegación a los detalles de un emprendimiento
   navigateToDetails(id: number | null): void {
    this.router.navigate([`/entrepreneurships/${id}`]);
  }

  // Eliminación de un emprendimiento
  deleteEntrepreneurship(id: number | null): void {
    this.entrepreneurshipService.deleteEntrepreneurship(id).subscribe(() => {
      this.entrepreneurships = this.entrepreneurships.filter(
        (entrepreneurship) => entrepreneurship.id !== id
      );
    });
  }
   // Detecta cuando el usuario llega al final de la página
   @HostListener('window:scroll', ['$event'])
   onScroll(): void {
     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 60 && !this.isLoading && this.hasMore) {
       this.loadEntrepreneurships();
     }
  }
}
