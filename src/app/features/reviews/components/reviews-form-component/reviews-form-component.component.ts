import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reviews-form-component.component.html',
  styleUrl: './reviews-form-component.component.css'
})
export class ReviewsFormComponentComponent {
  @Output() reviewCreated = new EventEmitter<Review>();
  reviewForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      reviewerName: ['', Validators.required],
      stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      date: [new Date(), Validators.required],
    });
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const newReview: Review = this.reviewForm.value;
      this.reviewCreated.emit(newReview);
      this.reviewForm.reset({ stars: 5, date: new Date() });
    }
  }
}
