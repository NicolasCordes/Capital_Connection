import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { filter, map, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { Entrepreneurship } from '../../types/entrepreneurship.model';

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
  showArrows = false;
  slidesVisible = 3;
  private gap = 30; // Espacio entre slides en px
  isTouchDevice: boolean = false;

  @ViewChild('carouselContent') carouselContent?: ElementRef<HTMLElement>;

  constructor(
    private authService: AuthService,
    private entrepreneurshipService: EntrepreneurshipService,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.detectTouchDevice();
    this.entrepreneurshipService.getEntrepreneurshipsActives(0, 9).subscribe({
      next: (response) => {
        this.entrepreneurships = response.content;
        this.updateArrowVisibility();
      },
      error: (err) => {
        console.error('Error al obtener entrepreneurships', err);
      },
    });

    this.sub = this.authService.auth().subscribe({
      next: (activeUser) => {
        this.username = activeUser?.username || 'invitado';
      },
    });

    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize(): void {
    this.detectTouchDevice();
    this.updateArrowVisibility();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    window.removeEventListener('resize', this.onResize.bind(this));
  }
  // Detectar si el dispositivo tiene soporte táctil
  detectTouchDevice(): void {
    this.isTouchDevice = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    console.log('¿Es un dispositivo táctil?', this.isTouchDevice);
    this.updateArrowVisibility(); // Actualizar la visibilidad de las flechas cada vez que se detecta el dispositivo
  }

  updateArrowVisibility(): void {
    const screenWidth = window.innerWidth;
    this.slidesVisible = screenWidth < 480 ? 1 :
                        screenWidth < 768 ? 2 : 3;
    this.showArrows = !this.isTouchDevice && this.entrepreneurships.length > this.slidesVisible;

    // Actualizar CSS variables
    document.documentElement.style.setProperty('--slides-visible', this.slidesVisible.toString());
    document.documentElement.style.setProperty('--gap', `${this.gap}px`);
  }

  getProgressWidth(goal: number, collected: number): number {
    if (!goal) return 0;
    const progress = Math.min((collected / goal) * 100, 100);
    return Math.round(progress);
  }

  // Modificamos el método moveSlider y escuchamos el evento click


  moveSlider(direction: 'left' | 'right', event: MouseEvent | TouchEvent): void {
    if (!this.showArrows || !this.carouselContent || this.isTouchDevice) {
      event.preventDefault();
      return;
    }

    const container = this.carouselContent.nativeElement;
    const slideWidth = container.scrollWidth / this.entrepreneurships.length;
    const scrollAmount = (slideWidth + this.gap) * this.slidesVisible;

    if (direction === 'right') {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
        container.scrollTo({ left: 0, behavior: 'smooth' }); // Vuelve al principio
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' }); // Avanza
      }
    } else {
      if (container.scrollLeft <= 0) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' }); // Va al final
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); // Retrocede
      }
    }
  }
  // Añadir un listener para clics que se asegure que no se disparen en dispositivos táctiles
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent | TouchEvent): void {
    if (this.isTouchDevice) {
      event.preventDefault();  // Prevenimos el clic de mouse cuando el dispositivo es táctil
      console.log('Evitar click en dispositivo táctil');
    }
  }
}
