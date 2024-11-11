import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { Entrepreneurship } from '../../../entrepreneurship/models/entrepreneurship.model';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-reviews-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Aseguramos que ReactiveFormsModule esté importado
  templateUrl: './reviews-form-component.component.html',
  styleUrls: ['./reviews-form-component.component.css']
})
export class ReviewsFormComponentComponent implements OnInit{
  @Input() entrepreneurship!: Entrepreneurship | null;
  @Input() editingReview: Review | null = null; // Recibimos la reseña a editar
  @Output() reviewCreated = new EventEmitter<Review>(); 
  @Output() reviewUpdated = new EventEmitter<Review>(); // Evento para reseña actualizada
  reviewForm: FormGroup;

  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService = inject(AuthService);

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewForm = this.fb.group({
      stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

    if (this.editingReview) {
      this.reviewForm.patchValue({
        stars: this.editingReview.stars,
        reviewText: this.editingReview.reviewText
      });
    }
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const newReview: Review = { 
        ...this.reviewForm.value,
        idUser: this.activeUser?.id,
        idEntrepreneurship: this.entrepreneurship?.id || 0,
        username: this.activeUser?.username
      };

      if (this.editingReview) {
        newReview.idEntrepreneurship = this.editingReview.idEntrepreneurship
        newReview.id = this.editingReview.id;  // Usamos el ID de la reseña si estamos editando
        console.log(newReview);

        this.reviewService.updateReview(this.editingReview.id,newReview).subscribe(
          (updatedReview) => {
            console.log(updatedReview);

            this.reviewUpdated.emit(updatedReview);
            this.reviewForm.reset({ stars: 5 });
          },
          (error) => {
            console.error('Error al actualizar la reseña', error);
          }
        );
      } else {
        this.reviewService.postReview(newReview).subscribe(
          (review) => {
            this.reviewCreated.emit(review);
            this.reviewForm.reset({ stars: 5 });
          },
          (error) => {
            console.error('Error al guardar la reseña', error);
          }
        );
      }
    }
  }

  setRating(value: number): void {
    this.reviewForm.get('stars')?.setValue(value);
  }
}