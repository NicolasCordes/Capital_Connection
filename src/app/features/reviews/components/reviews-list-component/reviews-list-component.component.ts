import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { ReviewsFormComponentComponent } from '../reviews-form-component/reviews-form-component.component';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews-list-component',
  standalone: true,
  imports: [CommonModule, ReviewsFormComponentComponent,ReactiveFormsModule],  
  templateUrl: './reviews-list-component.component.html',
  styleUrls: ['./reviews-list-component.component.css']
})
export class ReviewsListComponentComponent implements OnInit, OnChanges {
  reviews: Review[] = [];
  averageRating: number = 0;  
  @Input() id!: number;
  @Input() update!: boolean;

  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService = inject(AuthService);
  username : string = '';
  isEditing = false;
  editingReview: Review | null = null;
  usersData: { id: string; username: string }[] = [];

  reviewUpdateForm: FormGroup;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewUpdateForm = this.fb.group({
      stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] || changes['update']) {
      this.loadReviews();
      this.loadUsers();
    }
  }

  loadReviews(): void {
    this.reviewService.getReviewById(this.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateAverageRating(); 
        console.log('Reseñas cargadas:', reviews);
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
      }
    });
  }

  calculateAverageRating(): void {
    if (this.reviews.length > 0) {
      const totalStars = this.reviews.reduce((acc, review) => acc + review.stars, 0);
      this.averageRating = totalStars / this.reviews.length;
    } else {
      this.averageRating = 0;
  }
}

  loadUsers(): void {
    this.authService.getUsernames().subscribe({
      next: (data) => {
        this.usersData = data;
        console.log('Usuarios cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  
  deleteReview(idR: number) {
    this.reviewService.deleteReview(idR).subscribe((isDeleted) => {
      if (isDeleted) {
        this.reviews = this.reviews.filter(review => review.id !== idR);
        this.calculateAverageRating(); 
        console.log('Reseña eliminada');
      }
    });
  }

  modifyReview(review: Review): void {
    this.isEditing = true;
    this.editingReview = { ...review };
    this.reviewUpdateForm.patchValue({
      stars: this.editingReview.stars,
      reviewText: this.editingReview.reviewText,
    });
  }

  setRating(value: number): void {
    this.reviewUpdateForm.get('stars')?.setValue(value);
  }

  updateReview(): void {
    if (this.reviewUpdateForm.invalid) return;

    const resultForm = this.reviewUpdateForm.getRawValue();
    this.editingReview = { ...this.editingReview, ...resultForm };

    if (this.editingReview) {
      this.reviewService.updateReview(this.editingReview.id, this.editingReview).subscribe(
        (updatedReview) => {
          console.log('Reseña actualizada:', updatedReview);
          this.loadReviews();
          this.isEditing = false;
          this.editingReview = null;
        },
        (error) => {
          console.error('Error al actualizar la reseña', error);
        }
      );
    }
  }
}