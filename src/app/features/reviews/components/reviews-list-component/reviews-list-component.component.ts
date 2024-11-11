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
  imports: [CommonModule, ReviewsFormComponentComponent,ReactiveFormsModule],  // Importando el formulario de reseña
  templateUrl: './reviews-list-component.component.html',
  styleUrls: ['./reviews-list-component.component.css']
})
export class ReviewsListComponentComponent implements OnInit, OnChanges {
  reviews: Review[] = [];
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
        console.log('Reseñas cargadas:', reviews);
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
      }
    });
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
        console.log('Reseña eliminada');
      }
    });
  }

  modifyReview(review: Review): void {
    this.isEditing = true; // Habilitar el modo de edición
    this.editingReview = { ...review }; // Clonamos la reseña para evitar modificaciones directas
    // Establecer los valores del formulario con los valores de la reseña
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
          this.isEditing = false; // Desactivar el modo de edición
          this.editingReview = null; // Resetear la reseña en edición
        },
        (error) => {
          console.error('Error al actualizar la reseña', error);
        }
      );
    }
  }
}