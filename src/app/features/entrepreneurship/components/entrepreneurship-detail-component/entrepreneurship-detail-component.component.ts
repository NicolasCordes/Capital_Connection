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
import { ReviewsListComponentComponent } from "../../../reviews/components/reviews-list-component/reviews-list-component.component";

@Component({
  selector: 'app-entrepreneurship-detail-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ReviewsFormComponentComponent, ReviewsListComponentComponent],
  templateUrl: './entrepreneurship-detail-component.component.html',
  styleUrls: ['./entrepreneurship-detail-component.component.css'],
})
export class EntrepreneurshipDetailComponent implements OnInit {
  entrepreneurshipForm!: FormGroup;
  isEditing = false;
  entrepreneurship: Entrepreneurship | null = null;
  id: number = 0;
  reviews: Review[] = [];
  carga: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private entrepreneurshipService: EntrepreneurshipService,
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
      if(this.entrepreneurship.reviews){
        this.reviews = [...this.entrepreneurship.reviews, newReview]; 
      
      }
      this.carga= !this.carga;
      // Aquí se guarda la reseña en el backend (si es necesario)
      this.entrepreneurshipService.updateEntrepreneurship(this.id, this.entrepreneurship).subscribe(() => {
        console.log('Reseña agregada correctamente');
      });
    }
  }
}