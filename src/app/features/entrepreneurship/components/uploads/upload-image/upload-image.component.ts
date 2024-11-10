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
  imageForm: FormGroup;
  isUploading = false;
  emitido = false;

  constructor(
    private fb: FormBuilder,
    private mediaUploadService: MediaUploadService
  ) {
    // Inicializamos el FormControl y FormGroup para manejar las imágenes seleccionadas
    this.imageControl = new FormControl([]);
    this.imageForm = this.fb.group({
      imageControl: this.imageControl
    });
  }

  // Método para manejar la selección de archivos de imagen
  onFilesSelected(event: any): void {
    const newFiles = Array.from(event.target.files) as File[];
    const currentFiles = this.imageControl.value || [];

    // Combinamos los nuevos archivos con los ya existentes sin eliminar los anteriores
    const allFiles = [...currentFiles, ...newFiles];

    // Solo actualizamos el FormControl si hay un cambio en los archivos
    if (allFiles.length > currentFiles.length) {
      this.imageControl.setValue(allFiles);
    }

    // Restablecemos el input de archivos para permitir la selección repetida
    this.resetFileInput(event.target);

    console.log('Archivos en imageControl:', this.imageControl.value);
  }

  // Método para restablecer el input de archivo
  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = ''; // Limpiamos el valor del input
  }

  // Método para eliminar un archivo de la lista
  removeFile(index: number): void {
    const currentFiles = this.imageControl.value;
    currentFiles.splice(index, 1); // Eliminamos el archivo seleccionado
    this.imageControl.setValue([...currentFiles]); // Actualizamos el FormControl
  }

  // Método para subir las imágenes seleccionadas
  uploadImages(): void {
    this.isUploading = true; // Indicamos que la carga está en progreso
    const imageFiles = this.imageControl.value as File[];
    const uploadedImageUrls: string[] = [];

    console.log('Contenido de imageControl:', this.imageControl.value);

    if (imageFiles && imageFiles.length > 0) {
      // Creamos un array de promesas para subir las imágenes de manera paralela
      const uploadPromises = imageFiles.map((file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'capital-connection-preset');
        formData.append('cloud_name', 'dyho1ydzl');

        // Retornamos una promesa para cada archivo de imagen
        return new Promise<void>((resolve, reject) => {
          this.emitido = true;
          this.mediaUploadService.uploadImage(formData).subscribe({
            next: (response) => {
              uploadedImageUrls.push(response.secure_url); // Guardamos la URL de la imagen subida
              resolve();
            },
            error: (error) => {
              console.error('Error al cargar la imagen', error);
              reject(error);
            }
          });
        });
      });

      // Esperamos a que todas las promesas se resuelvan
      Promise.all(uploadPromises)
        .then(() => {
          this.isUploading = false; // Finalizamos la carga
          console.log(uploadedImageUrls);
          this.imagesUploaded.emit(uploadedImageUrls); // Emitimos las URLs de las imágenes cargadas
          this.imageControl.reset(); // Restablecemos el FormControl
        })
        .catch((error) => {
          console.error('Error al subir las imágenes', error);
          this.isUploading = false; // Finalizamos la carga en caso de error
        });
    }
  }
}
