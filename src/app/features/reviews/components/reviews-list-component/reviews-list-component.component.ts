import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { ReviewsFormComponentComponent } from '../reviews-form-component/reviews-form-component.component';

@Component({
  selector: 'app-reviews-list-component',
  standalone: true,
  imports: [CommonModule, ReviewsFormComponentComponent],  // Importando el formulario de reseña
  templateUrl: './reviews-list-component.component.html',
  styleUrls: ['./reviews-list-component.component.css']
})
export class ReviewsListComponentComponent implements OnInit {
  @Input() reviews!: Review[];  // Declaramos la propiedad como @Input()

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  // Cargar las reseñas desde el backend
  loadReviews(): void {
    this.reviewService.getReview().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        console.log('Reseñas cargadas:', reviews);
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
      }
    });
  }

  // Añadir una nueva reseña a la lista y actualizar el backend
  addReview(newReview: Review): void {
    // Cambiar la referencia del array para que Angular detecte el cambio y actualice la vista
    this.reviews = [...this.reviews, newReview];  // Crea una nueva referencia y agrega la nueva reseña
  
    // Opcional: Si deseas recargar las reseñas desde el backend (en caso de que la nueva reseña también se agregue en el servidor)
    this.reviewService.postReview(newReview).subscribe({
      next: (review) => {
        console.log('Reseña añadida:', review);
        this.loadReviews();  // Recargar las reseñas desde el backend
      },
      error: (err) => {
        console.error('Error al añadir reseña:', err);
      }
    });
  }
}