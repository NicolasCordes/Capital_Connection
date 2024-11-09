import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MediaUploadService } from '../../../services/media-upload.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports:  [ReactiveFormsModule, RouterModule, CommonModule, MatFormFieldModule, DropzoneCdkModule, DropzoneMaterialModule, MatChipsModule,MatIconModule],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.css'
})
export class UploadVideoComponent {
  @Output() videosUploaded = new EventEmitter<string[]>();


  videoControl: FormControl;
  videoForm: FormGroup; // FormGroup adicional para manejar el formulario completo
  isUploading = false;
  emitido = false;
  constructor(
    private fb: FormBuilder,
    private mediaUploadService: MediaUploadService
  ) {
    this.videoControl = new FormControl([], [Validators.required]);
    this.videoForm = this.fb.group({
      videoControl: this.videoControl
    });
  }
  onFilesSelected(event: any): void {
    const newFiles = Array.from(event.target.files) as File[];
    const currentFiles = this.videoControl.value || [];

    // Agregar los nuevos archivos a los archivos existentes sin eliminarlos
    const allFiles = [...currentFiles, ...newFiles];

    // Solo actualizamos el FormControl si hay un cambio en los archivos
    if (allFiles.length > currentFiles.length) {
      this.videoControl.setValue(allFiles);
    }

    // Restablecer el input de archivos para permitir la selección repetida
    this.resetFileInput(event.target);

    console.log('Archivos en videoControl:', this.videoControl.value);
  }

  // Función para restablecer el input de archivos
  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = ''; // Limpiar el valor del input para permitir la selección repetida de archivos
  }

  removeFile(index: number): void {
    const currentFiles = this.videoControl.value;
    currentFiles.splice(index, 1); // Elimina el archivo del array en la posición especificada
    this.videoControl.setValue([...currentFiles]); // Actualiza el FormControl con los archivos restantes
  }

  uploadVideo(): void {
    this.isUploading = true;
    const videoFiles = this.videoControl.value as File[];
    const uploadedVideoUrls: string[] = [];
    console.log(uploadedVideoUrls);
    console.log('Contenido de videoControl:', this.videoControl.value);

    if (videoFiles && videoFiles.length > 0) {
      const uploadPromises = videoFiles.map((file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'capital-connection-preset');
        formData.append('cloud_name', 'dyho1ydzl');
        console.log("acsdcsdcded");

        return new Promise<void>((resolve, reject) => {
          this.emitido=true;
          this.mediaUploadService.uploadVideo(formData).subscribe({
            next: (response) => {
              uploadedVideoUrls.push(response.secure_url);
              resolve();
            },
            error: (error) => {
              console.error('Error al cargar el video', error);
              reject(error);
            }
          });
        });
      });

      Promise.all(uploadPromises)
        .then(() => {
          this.isUploading = false;

          console.log(uploadedVideoUrls);
          this.videosUploaded.emit(uploadedVideoUrls);
          this.videoControl.reset();
        })
        .catch((error) => {
          console.error('Error al subir los video', error);
          this.isUploading = false;
        });
    }
  }
}
