import { Component, inject, OnInit } from '@angular/core';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Entrepreneurship } from '../../models/entrepreneurship.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/service.service';
import { CommonModule } from '@angular/common';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-entrepreneurships-updates',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './entrepreneurships-updates.component.html',
  styleUrls: ['./entrepreneurships-updates.component.css']
})
export class EntrepreneurshipsUpdatesComponent implements OnInit{
  createdEntrepreneurships: Entrepreneurship[] = [];
  editForm: FormGroup;
  editingEntrepreneurship: Entrepreneurship | null = null;

  entrepreneurshipService = inject(EntrepreneurshipService);
  fb = inject(FormBuilder);

  constructor() {
    // Inicializamos el formulario
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      images: ['', Validators.required],  // Aquí podrías cambiar para aceptar un array de imágenes
      videos: ['', ]   // Lo mismo con los videos
    });
  }

  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)
  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
      this.loadCreatedEntrepreneurships();

    });


  }

    // Cargar los emprendimientos creados por el usuario
    loadCreatedEntrepreneurships() {
      if(this.activeUser){
        this.entrepreneurshipService.getEntrepreneurshipsByUserId(this.activeUser?.id).subscribe(entrepreneurships => {
          this.createdEntrepreneurships = entrepreneurships;
          console.log(this.createdEntrepreneurships); // Verifica que esto sea un arreglo
          console.log(entrepreneurships); // Verifica que esto sea un arreglo

        });
      }
    
    }

      // Mostrar el formulario de edición
  editEntrepreneurship(entrepreneurship: Entrepreneurship) {
    this.editingEntrepreneurship = entrepreneurship;
    this.editForm.patchValue({
      name: entrepreneurship.name,
      description: entrepreneurship.description,
      category: entrepreneurship.category,
      images: entrepreneurship.images.join(','), // Convertir a cadena separada por comas
      videos: entrepreneurship.videos.join(',')
      ,idUser: entrepreneurship.idUser,
      });
  }

    // Guardar los cambios
    saveChanges() {
      if (this.editForm.invalid || !this.editingEntrepreneurship) {
        return;
      }
    
      // Crear un objeto actualizado con los datos del formulario
      const updatedEntrepreneurship: Entrepreneurship = {
        ...this.editingEntrepreneurship,
        ...this.editForm.value,
        images: this.editForm.value.images.split(','),  // Convertir de nuevo a array
        videos: this.editForm.value.videos.split(',')
      };
    
      // Usamos el id del emprendimiento para la actualización
      const entrepreneurshipId = this.editingEntrepreneurship.id ?? null;
      this.entrepreneurshipService.updateEntrepreneurship(entrepreneurshipId, updatedEntrepreneurship).subscribe(() => {
        this.loadCreatedEntrepreneurships();  // Recargar la lista de emprendimientos
        this.editingEntrepreneurship = null;  // Ocultar el formulario de edición
      });
    }

     // Cancelar la edición
  cancelEdit() {
    this.editingEntrepreneurship = null;
  }
}
