import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
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
  cargado = false;
  imageControl: FormControl;
  imageForm: FormGroup; // FormGroup adicional para manejar el formulario completo
  isUploading = false;
  emitido = false;

  constructor(
    private fb: FormBuilder,
    private mediaUploadService: MediaUploadService,
    private cdr: ChangeDetectorRef 
  ) {
    this.imageControl = new FormControl([]);
    this.imageForm = this.fb.group({
      imageControl: this.imageControl
    });
  }
  onFilesSelected(event: any): void {
    const newFiles = Array.from(event.target.files) as File[];
    const currentFiles = this.imageControl.value || [];

    const allFiles = [...currentFiles, ...newFiles];

    if (allFiles.length > currentFiles.length) {
      this.imageControl.setValue(allFiles);
    }

    this.resetFileInput(event.target);

    console.log('Archivos en imageControl:', this.imageControl.value);
  }

  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = ''; 
  }

  removeFile(index: number): void {
    const currentFiles = this.imageControl.value;
    currentFiles.splice(index, 1); 
    this.imageControl.setValue([...currentFiles]);
  }

  uploadImages(): void {
    const form = this.imageForm.getRawValue();

    if (!form?.imageControl || form.imageControl.length === 0) {
      console.log("No se seleccionaron imágenes.");
      return; 
    }

    const imageFiles = form.imageControl as File[];
    const uploadedImageUrls: string[] = [];

    this.isUploading = true;
    const uploadPromises = imageFiles.map((file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'capital-connection-preset');
      formData.append('cloud_name', 'dyho1ydzl');

      return new Promise<void>((resolve, reject) => {
        this.emitido = true;
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
        this.imagesUploaded.emit(uploadedImageUrls);
        this.imageControl.reset();
        this.imageControl.markAsPristine();
        this.imageControl.markAsUntouched();
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error al subir las imágenes', error);
        this.isUploading = false;
      })
      .finally(() => {
        this.cargado = true;
        this.emitido = false;
      });
  }
}