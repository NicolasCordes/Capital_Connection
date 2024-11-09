import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { Entrepreneurship } from '../../../entrepreneurship/models/entrepreneurship.model';

@Component({
  selector: 'app-reviews-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Aseguramos que ReactiveFormsModule esté importado
  templateUrl: './reviews-form-component.component.html',
  styleUrls: ['./reviews-form-component.component.css']
})
export class ReviewsFormComponentComponent {
  @Input() entrepreneurship!:Entrepreneurship | null;

  @Output() reviewCreated = new EventEmitter<Review>(); // Emitir la nueva reseña
  reviewForm: FormGroup;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewForm = this.fb.group({
      stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required],
    });
  }

  // Función para manejar el envío del formulario
  submitReview(): void {
    if (this.reviewForm.valid) {
      const newReview: Review = { 
        ...this.reviewForm.value,
        idUser: '1',  // Asignar el id_user. Asegúrate de que este tipo coincida con el backend.
        entrepreneurship_id: this.entrepreneurship?.id || 0,  // Asignar el id del emprendimiento, si existe.
        reviewText: this.reviewForm.get('reviewText')?.value, // Asegurarte de que reviewText esté en el formato correcto
        stars: this.reviewForm.get('stars')?.value, // Asegurarte de que stars esté en el formato correcto
        entrepreneurships: [] // Iniciar el array para los emprendimientos
      };

      if (this.entrepreneurship?.id) {
        newReview.entrepreneurships.push({
          id: this.entrepreneurship.id,
          id_user: this.entrepreneurship.id_user,
          name: this.entrepreneurship.name,
          description: this.entrepreneurship.description,
          goal: this.entrepreneurship.goal,
          category: this.entrepreneurship.category,
          images: this.entrepreneurship.images,
          videos: this.entrepreneurship.videos,
          reviews: [] // Suponiendo que es un arreglo vacío de reseñas
        });

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
  }

  // Función para manejar la selección de estrellas
  setRating(value: number): void {
    this.reviewForm.get('stars')?.setValue(value);
  }
}
