import { Component, OnInit, OnDestroy } from '@angular/core';
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
  currentIndex = 0;
  carouselTransform = 'translateX(0)';

  constructor(
    private authService: AuthService,
    private entrepreneurshipService: EntrepreneurshipService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);

   this.entrepreneurshipService.getEntrepreneurshipsActives(0, 9).subscribe({
  next: (response) => {
    this.entrepreneurships = response.content

    this.entrepreneurships.forEach(entre => {
      console.log(entre);
    });
  },
  error: (err) => {
    console.error('Error al obtener entrepreneurships', err);
  },
});
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

  getProgressWidth(goal: number, collected: number): number {
    if (!goal) return 0;
    const progress = Math.min((collected / goal) * 100, 100);
    return Math.round(progress);
  }

  moveSlider(direction: 'left' | 'right'): void {
    const totalSlides = this.entrepreneurships.length;
    const slidesVisible = 3;
    if (direction === 'left') {
      this.currentIndex = (this.currentIndex - slidesVisible + totalSlides) % totalSlides;
    } else {
      this.currentIndex = (this.currentIndex + slidesVisible) % totalSlides;
    }

    this.carouselTransform = `translateX(-${this.currentIndex * (100 / slidesVisible)}%)`;
  }
}
