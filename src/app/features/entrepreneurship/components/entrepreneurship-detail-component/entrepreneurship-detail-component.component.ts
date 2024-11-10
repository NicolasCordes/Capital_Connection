import { Component, OnInit } from '@angular/core';
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

  userId: string = '123'; // Asegúrate de obtener el userId correctamente, aquí lo he dejado estático por ahora.
  id: number = 0;
  reviews: Review[] = [];
  carga: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private entrepreneurshipService: EntrepreneurshipService,
    private favoriteListService: FavoriteListService,
    private donationService: DonationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id') || '0', 10);
      this.entrepreneurshipService.getEntrepreneurshipById(this.id).subscribe((entrepreneurship) => {
        this.entrepreneurship = entrepreneurship;
        this.initForm(entrepreneurship);
      });
    });
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
        images: this.images.value,  // Array de imágenes actualizado
        videos: this.videos.value   // Array de videos actualizado
      };

      console.log('Updated Entrepreneurship:', updatedEntrepreneurship);

      this.entrepreneurshipService.updateEntrepreneurship(this.id, updatedEntrepreneurship).subscribe(() => {
        this.isEditing = false;
        // Forzar la recarga del componente para evitar ver datos obsoletos
        this.router.navigate(['/entrepreneurships']).then(() => {
          this.router.navigate(['/entrepreneurships', this.id]); // Redirige de nuevo para mostrar la vista actualizada
        });
      });
    }
  }

  addReview(newReview: Review): void {
    if (this.entrepreneurship) {
      
      this.carga= !this.carga;
      // Aquí se guarda la reseña en el backend (si es necesario)
      this.entrepreneurshipService.updateEntrepreneurship(this.id, this.entrepreneurship).subscribe(() => {
        console.log('Reseña agregada correctamente');
      });
    }
  }


  // Método corregido para agregar el emprendimiento a favoritos
  addToFavorites(): void {
    const userId = '2410'; // ID hardcodeado del usuario por el momento

    this.favoriteListService.addFavorite(userId, this.id)
      .subscribe(
        response => {
          console.log('Emprendimiento agregado a favoritos', response);
        },
        error => {
          error = 'Hubo un problema al agregar el emprendimiento a favoritos.';
          console.error('Error al agregar a favoritos', error);
        }
      );
  }

  onDonationAdded(donation: Donation): void {
    // Verifica si el emprendimiento existe y tiene un ID válido
    if (this.entrepreneurship?.id) {
      this.id = this.entrepreneurship.id;
      console.log('ID del emprendimiento:', this.id);
      donation.idEntrepreneurship = this.id;
      
      // Enviar la donación al backend
      this.donationService.postDonation(donation).subscribe({
        next: (donationResponse) => {
          // Actualizamos la cantidad recaudada del emprendimiento
          if (this.entrepreneurship) {
            this.entrepreneurship.collected = donationResponse.amount;
            console.log('Emprendimiento actualizado con la donación:', this.entrepreneurship);
  
            // Verificamos que entrepreneurship no sea null antes de actualizar
            this.entrepreneurshipService.updateEntrepreneurship(this.id, this.entrepreneurship!).subscribe({
              next: (data) => {
                console.log('Emprendimiento actualizado:', data);
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
  
}



