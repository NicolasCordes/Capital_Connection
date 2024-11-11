import { Component, inject, OnInit } from '@angular/core';
import { Entrepreneurship } from '../../models/entrepreneurship.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewsFormComponentComponent } from "../../../reviews/components/reviews-form-component/reviews-form-component.component";
import { Review } from '../../../reviews/models/review.model';

import { FavoriteListService } from '../../../favorite-list/services/favorite-list.service';

import { ReviewsListComponentComponent } from "../../../reviews/components/reviews-list-component/reviews-list-component.component";
import { Donation } from '../../../donation/models/donation.model';
import { DonationService } from '../../../donation/services/donation.service';
import { DonationFormComponentComponent } from "../../../donation/components/donation-form-component/donation-form-component.component";
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-entrepreneurship-detail-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ReviewsFormComponentComponent, ReviewsListComponentComponent, DonationFormComponentComponent],
  templateUrl: './entrepreneurship-detail-component.component.html',
  styleUrls: ['./entrepreneurship-detail-component.component.css'],
})
export class EntrepreneurshipDetailComponent implements OnInit {
  entrepreneurshipForm!: FormGroup;
  isEditing = false;
  entrepreneurship: Entrepreneurship | null = null;

  userId: string | null = null; // Asegúrate de obtener el userId correctamente, aquí lo he dejado estático por ahora.
  id: number = 0;
  reviews: Review[] = [];
  update: boolean = false;
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService = inject(AuthService);
  combinedMediaArray: string[] = [];
  currentIndex: number = 0;

  // Función para cargar las imágenes y videos
  loadMedia() {
    // Combinamos las imágenes y videos en un solo arreglo
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
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
      if(this.userType=== 'Registered User'){
        if(this.activeUser?.id){
          this.userId=this.activeUser.id;
        }
      }

    });
    console.log(this.activeUser, this.userType);

    this.route.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id') || '0', 10);
      this.entrepreneurshipService.getEntrepreneurshipById(this.id).subscribe((entrepreneurship) => {
        this.entrepreneurship = entrepreneurship;
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
  
        this.favoriteListService.addFavorite(userId, this.id)
          .subscribe(
            response => {
              console.log('Emprendimiento agregado a favoritos', response);
            },
            error => {
              console.error('Error al agregar a favoritos', error);
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
      // Enviar la donación al backend

      this.donationService.postDonation(donation).subscribe({
        next: (donationResponse: Donation) => {
   
          if (this.entrepreneurship) {
            const donationAmount = Number(donationResponse.amount);
            let collect: number = 0;
            collect = this.entrepreneurship.collected ?? 0;
            console.log('Nueva cantidad recaudada:', collect);
            if (collect !== 1) {
              collect += donationAmount;
            } else {
              collect = donationAmount;
            }
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