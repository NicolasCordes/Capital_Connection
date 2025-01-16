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
        id_account: this.activeUser?.id,
        idEntrepreneurship: this.entrepreneurship?.id,
        username: this.activeUser?.username
      };

        this.reviewService.postReview(newReview,this.entrepreneurship?.id).subscribe(
          (review) => {
            console.log(newReview,this.entrepreneurship?.id);
            this.reviewCreated.emit(review);
            this.reviewForm.reset({ stars: 5 });
          },
          (error) => {
            console.error('Error al guardar la reseña', error);
          }
        );
      }
    }


  setRating(value: number): void {
    this.reviewForm.get('stars')?.setValue(value);
  }
}
