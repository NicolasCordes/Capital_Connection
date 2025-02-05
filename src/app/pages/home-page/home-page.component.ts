import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
  private cleanupListeners: (() => void) | null = null; // Nueva propiedad

  @ViewChild('carouselContent') carouselContent?: ElementRef<HTMLElement>;

  constructor(
    private authService: AuthService,
    private entrepreneurshipService: EntrepreneurshipService,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.detectTouchDevice();
    this.addTouchListenerToCarousel();


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

    window.addEventListener('resize', this.updateArrowVisibility.bind(this));
  }


  detectTouchDevice(): void {
    this.isTouchDevice = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    console.log('¿Es un dispositivo táctil?', this.isTouchDevice);
  }

  addTouchListenerToCarousel(): void {
    const slider = document.querySelector('.slider-class');

    if (!slider) return;

    const handleTouchStart = () => {
      if (!this.isTouchDevice) {
        this.isTouchDevice = true;
        console.log('Modo táctil activado dentro del slider.');
      }
    };

    const handleMouseMove = () => {
      if (this.isTouchDevice) {
        this.isTouchDevice = false;
        console.log('Dispositivo de mouse detectado.');
      }
    };

    slider.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mousemove', handleMouseMove);

    // Guardar referencia para limpiar eventos en `ngOnDestroy`
    this.cleanupListeners = () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }


  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    window.removeEventListener('resize', this.updateArrowVisibility.bind(this));
    if (this.cleanupListeners) {
      this.cleanupListeners();
    }
  }

  updateArrowVisibility(): void {
    const screenWidth = window.innerWidth;
    this.slidesVisible = screenWidth < 480 ? 1 :
                        screenWidth < 768 ? 2 : 3;
    this.showArrows = this.entrepreneurships.length > this.slidesVisible;

    // Actualizar CSS variables
    document.documentElement.style.setProperty('--slides-visible', this.slidesVisible.toString());
    document.documentElement.style.setProperty('--gap', `${this.gap}px`);
  }

  getProgressWidth(goal: number, collected: number): number {
    if (!goal) return 0;
    const progress = Math.min((collected / goal) * 100, 100);
    return Math.round(progress);
  }

  moveSlider(direction: 'left' | 'right'): void {
    if (!this.showArrows || !this.carouselContent) return;

    const container = this.carouselContent.nativeElement;
    const slideWidth = container.scrollWidth / this.entrepreneurships.length;
    const scrollAmount = (slideWidth + this.gap) * this.slidesVisible;

    if (direction === 'right') {
      // Si llegamos al final del carrusel, volvemos al principio
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      // Si estamos al principio del carrusel, nos vamos al final
      if (container.scrollLeft <= 0) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  }
}
