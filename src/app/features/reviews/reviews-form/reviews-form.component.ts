import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter, inject } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { ReviewService } from "../../../services/review.service";
import { ActiveUser } from "../../../types/account-data";
import { Entrepreneurship } from "../../../types/entrepreneurship.model";
import { Review } from "../../../types/review.model";


@Component({
  selector: 'app-reviews-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reviews-form.component.html',
  styleUrls: ['./reviews-form.component.css']
})
export class ReviewsFormComponent implements OnInit{
  @Input() entrepreneurship!: Entrepreneurship | null;
  @Input() editingReview: Review | null = null;
  @Output() reviewCreated = new EventEmitter<Review>();
  @Output() reviewUpdated = new EventEmitter<Review>();
  reviewForm: FormGroup;

  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService = inject(AuthService);

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewForm = this.fb.group({
      stars: [0, [Validators.required, Validators.min(0), Validators.max(5)]], // Cambiado a 0
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
        id_user: this.activeUser?.id,
        id_entrepreneurship: this.entrepreneurship?.id,
        isActivated: true,
        username: this.activeUser?.username
      };

        this.reviewService.postReview(newReview,this.entrepreneurship?.id).subscribe(
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


    setRating(event: MouseEvent, index: number): void {
      const starElement = event.currentTarget as HTMLElement;
      const rect = starElement.getBoundingClientRect();
      const clickPosition = (event.clientX - rect.left) / rect.width;

      const newValue = clickPosition <= 0.5 ? index + 0.5 : index + 1;
      const currentValue = this.reviewForm.get('stars')?.value;

      // Toggle para 0 si hace clic en la misma estrella
      this.reviewForm.get('stars')?.setValue(newValue === currentValue ? 0 : newValue);
    }
}
