import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/service.service';
import { EntrepreneurshipService } from '../../features/entrepreneurship/services/entrepreneurship.service';
import { Entrepreneurship } from '../../features/entrepreneurship/models/entrepreneurship.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  username = 'invitado';
  private sub?: Subscription;
  entrepreneurships: Entrepreneurship[] = [];
  currentIndex = 0; // Indice actual del slider
  carouselTransform = 'translateX(0)'; // Control del desplazamiento del slider

  constructor(
    private authService: AuthService,
    private entrepreneurshipService: EntrepreneurshipService
  ) {}

  ngOnInit(): void {
    // Obtener entrepreneurships de la API
    this.entrepreneurshipService.getEntrepreneurship(0, 9).subscribe({
      next: (response) => {
        this.entrepreneurships = response.content;
      },
      error: (err) => {
        console.error('Error al obtener entrepreneurships', err);
      },
    });

    // Suscripción al servicio de autenticación
    this.sub = this.authService.auth().subscribe({
      next: (activeUser) => {
        if (activeUser) {
          this.username = activeUser.username;
        } else {
          this.username = 'invitado';
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  moveSlider(direction: 'left' | 'right'): void {
    const totalSlides = this.entrepreneurships.length;
    const slidesVisible = 3; // Cambiado de 5 a 3
    if (direction === 'left') {
      this.currentIndex = (this.currentIndex - slidesVisible + totalSlides) % totalSlides;
    } else {
      this.currentIndex = (this.currentIndex + slidesVisible) % totalSlides;
    }

    // Actualiza el transform del contenedor del slider para mover las tarjetas
    this.carouselTransform = `translateX(-${this.currentIndex * (100 / slidesVisible)}%)`;
  }
}
