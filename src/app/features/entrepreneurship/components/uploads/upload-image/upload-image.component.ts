import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { MatChipsModule } from '@angular/material/chips';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntrepreneurshipService } from '../../../services/entrepreneurship.service';
import { MediaUploadService } from '../../../services/media-upload.service';


@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, MatFormFieldModule, DropzoneCdkModule, DropzoneMaterialModule, MatChipsModule,MatIconModule],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css'
})
export class UploadImageComponent {
  @Output() imagesUploaded = new EventEmitter<string[]>();


  imageControl: FormControl;
  imageForm: FormGroup; // FormGroup adicional para manejar el formulario completo
  isUploading = false;
  emitido = false;
  constructor(
    private fb: FormBuilder,
    private mediaUploadService: MediaUploadService
  ) {
    this.imageControl = new FormControl([], [Validators.required]);
    this.imageForm = this.fb.group({
      imageControl: this.imageControl
    });
  }
  onFilesSelected(event: any): void {
    const newFiles = Array.from(event.target.files) as File[];
    const currentFiles = this.imageControl.value || [];

    // Agregar los nuevos archivos a los archivos existentes sin eliminarlos
    const allFiles = [...currentFiles, ...newFiles];

    // Solo actualizamos el FormControl si hay un cambio en los archivos
    if (allFiles.length > currentFiles.length) {
      this.imageControl.setValue(allFiles);
    }

    // Restablecer el input de archivos para permitir la selección repetida
    this.resetFileInput(event.target);

    console.log('Archivos en imageControl:', this.imageControl.value);
  }

  // Función para restablecer el input de archivos
  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = ''; // Limpiar el valor del input para permitir la selección repetida de archivos
  }

  removeFile(index: number): void {
    const currentFiles = this.imageControl.value;
    currentFiles.splice(index, 1); // Elimina el archivo del array en la posición especificada
    this.imageControl.setValue([...currentFiles]); // Actualiza el FormControl con los archivos restantes
  }

  uploadImages(): void {
    this.isUploading = true;
    const imageFiles = this.imageControl.value as File[];
    const uploadedImageUrls: string[] = [];
    console.log(uploadedImageUrls);
    console.log('Contenido de imageControl:', this.imageControl.value);

    if (imageFiles && imageFiles.length > 0) {
      const uploadPromises = imageFiles.map((file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'capital-connection-preset');
        formData.append('cloud_name', 'dyho1ydzl');
        console.log(uploadedImageUrls);

        return new Promise<void>((resolve, reject) => {
          this.emitido=true;
          this.mediaUploadService.uploadImage(formData).subscribe({
            next: (response) => {
              uploadedImageUrls.push(response.secure_url);
              resolve();
            },
            error: (error) => {
              console.error('Error al cargar la imagen', error);
              reject(error);
            }
          });
        });
      });

      Promise.all(uploadPromises)
        .then(() => {
          this.isUploading = false;

          console.log(uploadedImageUrls);
          this.imagesUploaded.emit(uploadedImageUrls);
          this.imageControl.reset();
        })
        .catch((error) => {
          console.error('Error al subir las imágenes', error);
          this.isUploading = false;
        });
    }
  }
}
