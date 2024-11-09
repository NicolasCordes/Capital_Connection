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
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.entrepreneurshipService
        .getEntrepreneurshipById(id)
        .subscribe((entrepreneurship) => {
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
      images: this.fb.array(data.images || []),
      videos: this.fb.array(data.videos || []),
    });
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
