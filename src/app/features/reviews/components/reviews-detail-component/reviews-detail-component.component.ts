import { Component, Input } from '@angular/core';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews-detail-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-detail-component.component.html',
  styleUrl: './reviews-detail-component.component.css'
})
export class ReviewsDetailComponentComponent {
  @Input() review: Review | null = null;

}
