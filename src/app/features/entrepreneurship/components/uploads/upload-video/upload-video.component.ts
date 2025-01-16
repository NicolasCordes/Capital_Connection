import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MediaUploadService } from '../../../../../services/media-upload.service';
import { Router, RouterModule } from '@angular/router';
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
  cargado=false;
  videoControl: FormControl;
  videoForm: FormGroup;
  isUploading = false;
  emitido = false;

  constructor(
    private fb: FormBuilder,
    private mediaUploadService: MediaUploadService,
    private cdr: ChangeDetectorRef

  ) {
    this.videoControl = new FormControl([]);
    this.videoForm = this.fb.group({
      videoControl: this.videoControl
    });
  }

  onFilesSelected(event: any): void {
    const newFiles = Array.from(event.target.files) as File[];
    const currentFiles = this.videoControl.value || [];

    const allFiles = [...currentFiles, ...newFiles];

    if (allFiles.length > currentFiles.length) {
      this.videoControl.setValue(allFiles);
    }

    this.resetFileInput(event.target);

    console.log('Archivos en videoControl:', this.videoControl.value);
  }

  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }

  removeFile(index: number): void {
    const currentFiles = this.videoControl.value;
    currentFiles.splice(index, 1);
    this.videoControl.setValue([...currentFiles]);
  }

  uploadVideo(): void {
    const form = this.videoForm.getRawValue();

    if (!form?.videoControl || form.videoControl.length === 0) {
      console.log("No se seleccionaron videos.");
      return;
    }

    const videoFiles = form.videoControl as File[];
    const uploadedVideoUrls: string[] = [];

    this.isUploading = true;
    const uploadPromises = videoFiles.map((file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'capital-connection-preset');
      formData.append('cloud_name', 'dyho1ydzl');

      return new Promise<void>((resolve, reject) => {
        this.emitido = true;
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
        this.videosUploaded.emit(uploadedVideoUrls);
        this.videoControl.reset();
        this.videoControl.markAsPristine();
        this.videoControl.markAsUntouched();
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error al subir los videos', error);
        this.isUploading = false;
      })
      .finally(() => {
        this.cargado = true;
        this.emitido = false;
      });
  }

}
