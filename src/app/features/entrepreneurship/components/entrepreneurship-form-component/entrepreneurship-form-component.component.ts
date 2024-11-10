import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { UploadImageComponent } from '../uploads/upload-image/upload-image.component';
import { CommonModule } from '@angular/common';
import { UploadVideoComponent } from "../uploads/upload-video/upload-video.component";
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-entrepreneurship-form',
  standalone:true,
  imports: [UploadImageComponent, ReactiveFormsModule, CommonModule, UploadVideoComponent],
  templateUrl: './entrepreneurship-form-component.component.html',
  styleUrls: ['./entrepreneurship-form-component.component.css']
})
export class EntrepreneurshipFormComponent implements OnInit {
  entrepreneurshipForm: FormGroup;
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)

   
  constructor(
    private fb: FormBuilder,
    private entrepreneurshipService: EntrepreneurshipService,
    private router: Router
  ) {
    this.entrepreneurshipForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      goal: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      images: this.fb.array([], this.imagesRequiredValidator()), // FormArray para almacenar URLs de imágenes
      videos: this.fb.array([]), // FormArray para almacenar URLs de videos
    });
  }

  ngOnInit(): void { 
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
      console.log("Estado de autenticación:", this.activeUser, this.userType);
    });
  }

  imagesRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Verifica si el control es un FormArray y si no tiene elementos
      if (control instanceof FormArray && control.length === 0) {
        return { 'imagesRequired': true };
      }
      return null; // No hay error si tiene imágenes
    };
  }

  // Getter para el FormArray de imágenes
  get imagesFormArray(): FormArray {
    return this.entrepreneurshipForm.get('images') as FormArray;
  }

  get videosFormArray(): FormArray {
    return this.entrepreneurshipForm.get('videos') as FormArray;
  }
  // Método para recibir las URLs de imágenes desde el componente de carga de imágenes
  onImagesUploaded(imageUrls: string[]): void {
    this.imagesFormArray.clear(); // Limpia el array antes de agregar nuevas URLs
    imageUrls.forEach(url => {
      this.imagesFormArray.push(new FormControl(url)); // Agrega cada URL al FormArray
      console.log("Si se guardo")
    });
  }

  onVideosUploaded(videosUrls: string[]): void {
    this.videosFormArray.clear(); // Limpia el array antes de agregar nuevas URLs
    videosUrls.forEach(url => {
      this.videosFormArray.push(new FormControl(url)); // Agrega cada URL al FormArray
      console.log("Si se guardo")
    });
  }

  // Método para agregar el emprendimiento
  addEntrepreneurship(): void {
    if (this.entrepreneurshipForm.valid) {
      const ent = this.entrepreneurshipForm.getRawValue();
      ent.id_user = '123';
     // ent.collected = 1; PRUEBA PARA VERIFICAR DONATION 
      console.log('Emprendimiento a enviar:', ent); // Verifica las URLs de las imágenes
      console.log(ent);
      this.entrepreneurshipService
        .postEntrepreneurship(ent)
        .subscribe({
          next:()=>{
            this.router.navigate(['/entrepreneurships']);
          }, error:(e:Error)=>{
            console.log(e);
          }
        });
    }
  }
}

