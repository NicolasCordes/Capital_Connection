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
  @Input() entrepreneurship!:Entrepreneurship | null;

  @Output() reviewCreated = new EventEmitter<Review>(); // Emitir la nueva reseña
  reviewForm: FormGroup;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewForm = this.fb.group({
      stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required],
    });
  }

  
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)
  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });
  }

  // Función para manejar el envío del formulario
  submitReview(): void {
    if (this.reviewForm.valid) {
      const newReview: Review = { 
        ...this.reviewForm.value,
        idUser: '1',  // Asignar el id_user. Asegúrate de que este tipo coincida con el backend.
        idEntrepreneurship: this.entrepreneurship?.id || 0,  // Asignar el id del emprendimiento, si existe.
        reviewText: this.reviewForm.get('reviewText')?.value, // Asegurarte de que reviewText esté en el formato correcto
        stars: this.reviewForm.get('stars')?.value, // Asegurarte de que stars esté en el formato correcto
      };


        console.log(newReview);

        this.reviewService.postReview(newReview).subscribe(
          (review) => {
            // Emitir la reseña recién guardada
            this.reviewCreated.emit(review);
            this.reviewForm.reset({ stars: 5 }); // Restablecer el formulario
          },
          (error) => {
            console.error('Error al guardar la reseña', error);
          }
        );
      }
    }

      // Función para manejar la selección de estrellas
  setRating(value: number): void {
    this.reviewForm.get('stars')?.setValue(value);
  }


  }


