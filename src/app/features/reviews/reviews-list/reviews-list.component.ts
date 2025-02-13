import { CommonModule } from "@angular/common";
import { Component, OnInit, OnChanges, Input, inject, SimpleChanges } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { ReviewService } from "../../../services/review.service";
import { ActiveUser } from "../../../types/account-data";
import { Review } from "../../../types/review.model";
import { ReviewsFormComponent } from "../reviews-form/reviews-form.component";



@Component({
  selector: 'app-reviews-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.css']
})
export class ReviewsListComponent implements OnInit, OnChanges {
  reviews: Review[] = [];
  averageRating: number = 0;
  @Input() idE!: number;
  @Input() update!: boolean;
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService = inject(AuthService);
  username : string = '';
  isEditing = false;
  editingReview: Review | null = null;
  usersData: { id: number; username: string }[] = [];

  reviewUpdateForm: FormGroup;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewUpdateForm = this.fb.group({
      stars: [0, [Validators.required, Validators.min(0), Validators.max(5)]], // Cambiar a 0 y validación 0-5
      reviewText: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

    this.loadReviews();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['update'] && this.idE != null) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    if (this.idE != null) {
      this.reviewService.getReviewByEntrepreneurshipId(this.idE).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.calculateAverageRating();

        },
        error: (err) => {
        }
      });
    } else {
      console.error('ID de emprendimiento no válido', this.idE);
    }
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
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }


  deleteReview(idR: number) {
    this.reviewService.deleteReview(idR,this.idE).subscribe((isDeleted) => {
      if (isDeleted) {
        this.reviews = this.reviews.filter(review => review.id !== idR);
        this.calculateAverageRating();
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

  setRating(event: MouseEvent, index: number): void {
    const starElement = event.currentTarget as HTMLElement;
    const rect = starElement.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;

    const newValue = clickPosition <= 0.5 ? index + 0.5 : index + 1;
    const currentValue = this.reviewUpdateForm.get('stars')?.value;

    // Toggle para 0 si hace clic en la misma calificación
    this.reviewUpdateForm.get('stars')?.setValue(newValue === currentValue ? 0 : newValue);
  }

  updateReview(): void {
    if (this.reviewUpdateForm.invalid) return;

    const resultForm = this.reviewUpdateForm.getRawValue();
    this.editingReview = { ...this.editingReview, ...resultForm };
    if (this.editingReview) {
      this.reviewService.updateReview(this.editingReview.id,this.idE, this.editingReview).subscribe(
        (updatedReview) => {
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
