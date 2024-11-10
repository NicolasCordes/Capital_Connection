import { Component, EventEmitter, HostListener, inject, OnInit } from '@angular/core';
import { Entrepreneurship } from '../../models/entrepreneurship.model';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { DonationService } from '../../../donation/services/donation.service';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

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
  size = 6;                // Tamaño de cada página
  isLoading = false;       // Estado de carga
  hasMore = true;          // Indica si hay más datos para cargar
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)

   

  constructor(
    private entrepreneurshipService: EntrepreneurshipService,
    private donationService: DonationService, // Inyecta DonationService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntrepreneurships();
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

  }

  // Función para cargar datos
   // Función para cargar datos
   loadEntrepreneurships(): void {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;

    this.entrepreneurshipService.getEntrepreneurship(this.page, this.size).subscribe(
      (data) => {
        if (data && data.content) {
          // Añade cada emprendimiento a la lista actual
          this.entrepreneurships = [...this.entrepreneurships, ...data.content];
          
          // Calcula el total recaudado por cada emprendimiento
          this.entrepreneurships.forEach((entrepreneurship) => {
            this.calculateCollected(entrepreneurship);
          });
          
          this.hasMore = data.content.length === this.size;
          this.page++;
        } else {
          this.hasMore = false;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.isLoading = false;
      }
    );
  }

  // Función para calcular el total recaudado de las donaciones
  calculateCollected(entrepreneurship: Entrepreneurship): void {
    // Verifica que el id sea válido y convierte a número
    if (entrepreneurship.id && !isNaN(Number(entrepreneurship.id))) {
      // Convertir el id a number antes de hacer la llamada
      const entrepreneurshipId = Number(entrepreneurship.id);
  
      // Llamada al servicio para obtener las donaciones
      this.donationService.getDonationsByEntrepreneurshipId(entrepreneurshipId).subscribe(
        (donations) => {
          // Asegúrate de usar number en toda la operación
          entrepreneurship.collected = donations.reduce(
            (total, donation) => total + Number(donation.amount), // Convertimos donation.amount a number
            0 // Inicia con 0 para asegurar que todo sea number
          );
  
          // Si necesitas convertir el resultado a otro tipo de dato o hacer cálculos adicionales:
          const collectedAmount = entrepreneurship.collected; // Esto ya es un number
          console.log("Total recaudado como número:", collectedAmount);
  
          // Para mostrar como string:
          const collectedAmountString = entrepreneurship.collected.toString(); // Mostrar como string
          console.log("Total recaudado como string:", collectedAmountString);
        },
        (error) => {
          console.error("Error fetching donations:", error);
        }
      );
    } else {
      // Si el id es inválido o no se puede convertir a número, mostrar un mensaje de error
      console.error(`El id del emprendimiento es inválido: ${entrepreneurship.id}`);
    }
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