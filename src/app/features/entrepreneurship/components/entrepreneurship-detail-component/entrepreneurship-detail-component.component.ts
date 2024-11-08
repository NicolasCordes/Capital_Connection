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

@Component({
  selector: 'app-entrepreneurship-detail-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './entrepreneurship-detail-component.component.html',
  styleUrls: ['./entrepreneurship-detail-component.component.css'],
})
export class EntrepreneurshipDetailComponent implements OnInit {
  entrepreneurshipForm!: FormGroup;
  isEditing = false;
  entrepreneurship: Entrepreneurship | null = null;

  constructor(
    private route: ActivatedRoute,
    private entrepreneurshipService: EntrepreneurshipService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.entrepreneurshipService
        .getEntrepreneurshipById(id)
        .subscribe((data) => {
          this.entrepreneurship = data;
          this.initForm(data);
        });
    }
  }

  private initForm(data: Entrepreneurship): void {
    this.entrepreneurshipForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      goal: [data.goal, Validators.required],
      category: [data.category, Validators.required],
      images: this.fb.array(data.images || []),
      videos: this.fb.array(data.videos || []),
    });
  }

  get images() {
    return this.entrepreneurshipForm.get('images') as FormArray;
  }

  get videos() {
    return this.entrepreneurshipForm.get('videos') as FormArray;
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

  onFileSelected(event: any, type: 'image' | 'video'): void {
    const files = event.target.files;
    const formArray = type === 'image' ? this.images : this.videos;
    const maxSize = type === 'image' ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB para imágenes, 5MB para videos

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > maxSize) {
        alert(`El archivo ${file.name} excede el tamaño máximo permitido.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        formArray.push(this.fb.control(e.target.result));
      };
      reader.readAsDataURL(file);
    }
  }

  deleteMedia(index: number, type: 'image' | 'video'): void {
    const formArray = type === 'image' ? this.images : this.videos;
    formArray.removeAt(index);
  }

  formHasChanged(): boolean {
    return (
      JSON.stringify(this.entrepreneurshipForm.value) !==
      JSON.stringify(this.entrepreneurship)
    );
  }

  saveEntrepreneurship(): void {
    if (this.entrepreneurshipForm.valid) {
      const updatedEntrepreneurship: Entrepreneurship =
        this.entrepreneurshipForm.value;
      this.entrepreneurshipService
        .updateEntrepreneurship(updatedEntrepreneurship)
        .subscribe(() => {
          this.isEditing = false;
          this.router.navigate(['/entrepreneurships']); // Redirige a la lista de emprendimientos
        });
    }
  }
}
