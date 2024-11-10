import { Component, inject, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { ReviewsFormComponentComponent } from '../reviews-form-component/reviews-form-component.component';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-reviews-list-component',
  standalone: true,
  imports: [CommonModule, ReviewsFormComponentComponent],  // Importando el formulario de reseña
  templateUrl: './reviews-list-component.component.html',
  styleUrls: ['./reviews-list-component.component.css']
})
export class ReviewsListComponentComponent implements OnInit {
  reviews: Review[]=[]; 
  @Input() id!: number; 
  
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });
  }

  // Cargar las reseñas desde el backend
  loadReviews(): void {
    this.reviewService.getReviewById(this.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        console.log('Reseñas cargadas:', reviews);
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
      }
    });
  }

}