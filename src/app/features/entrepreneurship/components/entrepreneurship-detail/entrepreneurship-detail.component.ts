import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../services/auth.service";
import { DonationService } from "../../../../services/donation.service";
import { EntrepreneurshipService } from "../../../../services/entrepreneurship.service";
import { FavoriteListService } from "../../../../services/favorite-list.service";
import { ActiveUser } from "../../../../types/account-data";
import { Donation } from "../../../../types/donation.model";
import { Entrepreneurship } from "../../../../types/entrepreneurship.model";
import { Review } from "../../../../types/review.model";
import { DonationFormComponent } from "../../../donation/components/donation-form/donation-form.component";
import { ReviewsFormComponent } from "../../../reviews/reviews-form/reviews-form.component";
import { ReviewsListComponent } from "../../../reviews/reviews-list/reviews-list.component";

@Component({
  selector: 'app-entrepreneurship-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ReviewsFormComponent, ReviewsListComponent, DonationFormComponent],
  templateUrl: './entrepreneurship-detail.component.html',
  styleUrls: ['./entrepreneurship-detail.component.css'],
})

export class EntrepreneurshipDetailComponent implements OnInit {
  entrepreneurshipForm!: FormGroup;
  isEditing = false;
  entrepreneurship: Entrepreneurship | null = null;
  isLoading = true;

  userId: string | null = null;
  id: number = 0;
  reviews: Review[] = [];
  update: boolean = false;
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService = inject(AuthService);
  combinedMediaArray: string[] = [];
  currentIndex: number = 0;
  isFavorite:boolean = false;

  loadMedia() {
    if (this.entrepreneurship) {
      this.combinedMediaArray = [
        ...this.entrepreneurship.images,
        ...this.entrepreneurship.videos
      ];
    }
  }

  constructor(
    private route: ActivatedRoute,
    private entrepreneurshipService: EntrepreneurshipService,
    private favoriteListService: FavoriteListService,
    private donationService: DonationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
      if (this.userType === 'Registered User' && this.activeUser?.id) {
        this.userId = this.activeUser.id;
        this.favoriteListService.initializeFavorites(this.activeUser.id);

        this.favoriteListService.favorites$.subscribe((favorites) => {
          this.isFavorite = favorites.includes(this.id);

          window.scrollTo(0, 0);
        });
        this.isLoading = false;
      } else {
        this.isLoading = false;
        window.scrollTo(0, 0);
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id') || '0', 10);
      this.entrepreneurshipService.getEntrepreneurshipById(this.id).subscribe((entrepreneurship) => {
        this.entrepreneurship = entrepreneurship;
        console.log('entrepreneurship', this.entrepreneurship)

        this.loadMedia();
        console.log(this.combinedMediaArray);
        this.initForm(entrepreneurship);
      });
    });
  }

  previousSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.combinedMediaArray.length - 1;
    }
  }

  nextSlide() {
    if (this.currentIndex < this.combinedMediaArray.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  private initForm(data: Entrepreneurship): void {
    this.entrepreneurshipForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      goal: [data.goal, Validators.required],
      category: [data.category, Validators.required],
      images: this.fb.array(data.images.map(image => this.fb.control(image)) || []),
      videos: this.fb.array(data.videos.map(video => this.fb.control(video)) || []),
    });
  }

  get images(): FormArray {
    return this.entrepreneurshipForm.get('images') as FormArray;
  }

  get videos(): FormArray {
    return this.entrepreneurshipForm.get('videos') as FormArray;
  }

  addImage(): void {
    this.images.push(this.fb.control(''));
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  addVideo(): void {
    this.videos.push(this.fb.control(''));
  }

  removeVideo(index: number): void {
    this.videos.removeAt(index);
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    if (confirm('¿Estás seguro de que deseas cancelar los cambios?')) {
      this.isEditing = false;
      this.entrepreneurshipForm.reset();
      if (this.entrepreneurship) {
        this.initForm(this.entrepreneurship);
      }
    }
  }

  formHasChanged(): boolean {
    return JSON.stringify(this.entrepreneurshipForm.value) !== JSON.stringify(this.entrepreneurship);
  }

  saveEntrepreneurship(): void {
    if (this.entrepreneurshipForm.valid) {
      const updatedEntrepreneurship: Entrepreneurship = {
        ...this.entrepreneurship,
        ...this.entrepreneurshipForm.value,
        images: this.images.value,
        videos: this.videos.value
      };

      console.log('Updated Entrepreneurship:', updatedEntrepreneurship);

      this.entrepreneurshipService.updateEntrepreneurship(this.id, updatedEntrepreneurship).subscribe(() => {
        this.isEditing = false;
        this.router.navigate(['/entrepreneurships']).then(() => {
          this.router.navigate(['/entrepreneurships', this.id]);
        });
      });
    }
  }

  isImage(media: string): boolean {
    return media.includes('.jpg') || media.includes('.jpeg') || media.includes('.png');
  }

  isVideo(media: string): boolean {
    return media.includes('.mp4') || media.includes('.webm') || media.includes('.ogg');
  }

  addReview(newReview: Review): void {
    if (this.entrepreneurship) {
      this.update = !this.update;
      this.entrepreneurshipService.updateEntrepreneurship(this.id, this.entrepreneurship).subscribe(() => {
        console.log('Reseña agregada correctamente');
      });
    }
  }

  addToFavorites(): void {
    if (this.activeUser) {
      const userId = this.activeUser.id;
      this.favoriteListService.addFavorite(userId, this.id).subscribe({
        next:(response) => {
          this.isFavorite = true; // Aquí puedes actualizar isFavorite directamente

        },error:(error:Error) => {
          console.error('Error al agregar a favoritos', error);
        }}
      );
    } else{
      console.log('Usuario no autorizado');
    }
  }

  DeleteFavorites(): void {
    if (this.activeUser) {
      const userId = this.activeUser.id;
      this.favoriteListService.removeFavorite(userId, this.id).subscribe(
        () => {
          this.isFavorite = false; // Actualiza el estado de isFavorite
        },
        error => {
          console.error('Error al eliminar de favoritos', error);
        }
      );
    } else {
      console.error('El usuario no está autenticado.');
    }
  }

  

  onDonationAdded(donation: Donation): void {
    if (this.entrepreneurship?.id) {
      this.id = this.entrepreneurship.id;
      console.log('ID del emprendimiento:', this.id);
      donation.idEntrepreneurship = this.id;

      if(this.userId){donation.idUser=this.userId;}

      this.donationService.postDonation(donation).subscribe({
        next: (donationResponse: Donation) => {

          if (this.entrepreneurship) {
            const donationAmount = Number(donationResponse.amount);
            let collect: number = 0;
            collect = this.entrepreneurship.collected ?? 0;
            console.log('Nueva cantidad recaudada:', collect);

              collect += donationAmount;

            this.entrepreneurship.collected = collect;



            this.entrepreneurshipService.updateEntrepreneurship(this.id, this.entrepreneurship!).subscribe({
              next: (data) => {
              },
              error: (err) => {
                console.error('Error al actualizar el emprendimiento:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error al agregar la donación:', err);
        }
      });
    } else {
      console.error('No se pudo asociar la donación con un emprendimiento válido.');
    }
  }

  getProgressWidth(goal: number, collected: number): number {
    if (goal <= 0) return 0;
    const progress = (collected / goal) * 100;
    return Math.min(Math.round(progress), 100);
  }

  getProgressColor(goal: number, collected: number): string {
    const progress = this.getProgressWidth(goal, collected);
    return progress >= 50 ? 'white' : 'black';
  }



}
