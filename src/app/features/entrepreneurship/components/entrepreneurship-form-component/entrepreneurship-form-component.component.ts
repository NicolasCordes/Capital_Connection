import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { MediaUploadService } from '../../services/media-upload.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DropzoneCdkModule,
  FileInputValidators,
  FileInputValue,
} from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { MatChipRow, MatChipsModule } from '@angular/material/chips';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-entrepreneurship-form-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatFormFieldModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './entrepreneurship-form-component.component.html',
  styleUrls: ['./entrepreneurship-form-component.component.css'],
})
export class EntrepreneurshipFormComponent {
  entrepreneurshipForm: FormGroup;
  imageControl: FormControl; // Control para la imagen
  isUploading = false; // Para mostrar indicador de carga

  constructor(
    private fb: FormBuilder,
    private entrepreneurshipService: EntrepreneurshipService,
    private mediaUploadService: MediaUploadService,
    private router: Router
  ) {
    this.entrepreneurshipForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      goal: [0, [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
      images: this.fb.array([]),
      videos: this.fb.array([]),
    });

    // Inicia el FormControl para aceptar un arreglo de archivos
    this.imageControl = new FormControl([], [Validators.required]);
  }

  // Método para agregar el emprendimiento
  addEntrepreneurship(): void {
    if (this.entrepreneurshipForm.valid) {
      this.isUploading = true;

      const formData = new FormData();
      const imageFiles = this.imageControl.value; // Ahora es un arreglo de archivos

      // Verifica si hay archivos seleccionados
      if (imageFiles && imageFiles.length > 0) {
        const uploadedImageUrls: string[] = []; // Array para almacenar las URLs de las imágenes subidas

        // Recorre cada archivo de imagen y lo sube
        imageFiles.forEach((imageFile: File) => {
          formData.append('file', imageFile);
          formData.append('upload_preset', 'capital-connection-preset'); // Tu upload_preset
          formData.append('cloud_name', 'dyho1ydzl'); // Tu cloud_name si es necesario

          this.mediaUploadService.uploadImage(formData).subscribe({
            next: (response) => {
              console.log('Imagen juancetooo con éxito', response.get('secure_url'));

              // Agrega la URL de la imagen cargada al arreglo de URLs
              uploadedImageUrls.push(response.secure_url);
              console.log('URLs de imágenes 1 ', uploadedImageUrls);
              // Si todas las imágenes fueron cargadas, actualizamos el formulario
              if (uploadedImageUrls.length === imageFiles.length) {
                console.log('URLs de imágenes 2 ', uploadedImageUrls);
                this.entrepreneurshipForm.patchValue({
                  images: uploadedImageUrls,
                });

                console.log('URLs de imágenes', uploadedImageUrls);

                this.isUploading = false;

                // Luego puedes proceder a enviar el emprendimiento
                this.entrepreneurshipService
                  .postEntrepreneurship(this.entrepreneurshipForm.value)
                  .subscribe(() => {
                    this.router.navigate(['/entrepreneurships']);
                  });
              }
            },
            error: (error) => {
              console.error('Error al cargar la imagen', error);
              this.isUploading = false;
            },
          });
        });
      }
    }
  }
}
