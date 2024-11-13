import { Component, EventEmitter, HostListener, inject, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../../../../services/auth.service';
import { ActiveUser } from '../../../../types/account-data';
import { EntrepreneurshipService } from '../../../../services/entrepreneurship.service';
import { DonationService } from '../../../../services/donation.service';
import { Entrepreneurship } from '../../../../types/entrepreneurship.model';

@Component({
  selector: 'app-entrepreneurship-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrepreneurship-list.component.html',
  styleUrl: './entrepreneurship-list.component.css',
})
export class EntrepreneurshipListComponent implements OnInit {
  entrepreneurships: Entrepreneurship[] = [];
  page = 0;
  size = 12;
  isLoading = false;
  hasMore = true;
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)



  constructor(
    private entrepreneurshipService: EntrepreneurshipService,
    private donationService: DonationService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });
    this.loadEntrepreneurships();
  }
  loadEntrepreneurships(): void {
    // Verifica si ya se está cargando o si no hay más datos para cargar
    if (this.isLoading || !this.hasMore) return;

    // Marca el inicio de la carga
    this.isLoading = true;

    // Llama al servicio para obtener los emprendimientos activados de forma paginada
    this.entrepreneurshipService.getEntrepreneurshipsActives(this.page, this.size).subscribe(
      (data) => {
        console.log('Datos recibidos de la API:', data);

        // Verifica que la respuesta contenga datos de emprendimientos activados
        if (data && data.content) {
          // Agrega los nuevos emprendimientos activados al array existente
          this.entrepreneurships = [...this.entrepreneurships, ...data.content];

          // Actualiza `hasMore` basado en si se alcanzó el límite de elementos en la respuesta
          this.hasMore = data.content.length === this.size;

          // Si hay más elementos, incrementa el número de página
          if (this.hasMore) this.page++;
        } else {
          // Si no hay contenido, marca que no hay más elementos para cargar
          this.hasMore = false;
        }

        // Marca el fin de la carga
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.isLoading = false;
      }
    );
  }

  getProgressWidth(goal: number, collected: number): number {
    if (!goal) return 0;
    const progress = Math.min((collected / goal) * 100, 100);
    return Math.round(progress);
  }

  navigateToDetails(id: number | null): void {
    this.router.navigate([`/entrepreneurships/${id}`]);
  }

  deleteEntrepreneurship(id: number | null): void {
    this.entrepreneurshipService.deleteEntrepreneurship(id).subscribe(() => {
      this.entrepreneurships = this.entrepreneurships.filter(
        (entrepreneurship) => entrepreneurship.id !== id
      );
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 120 && !this.isLoading && this.hasMore) {
      this.loadEntrepreneurships();
    }
  }
}
