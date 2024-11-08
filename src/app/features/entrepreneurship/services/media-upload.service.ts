import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MediaUploadService {
  private cloudinaryImageUrl = `https://api.cloudinary.com/v1_1/${environment.CLOUD_NAME}/image/upload`;
  private cloudinaryVideoUrl = `https://api.cloudinary.com/v1_1/${environment.CLOUD_NAME}/video/upload`;
  private imageUploadPreset = 'YOUR_IMAGE_UPLOAD_PRESET'; // Define tu upload_preset aquí
  private videoUploadPreset = 'YOUR_VIDEO_UPLOAD_PRESET'; // Define tu upload_preset aquí

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.imageUploadPreset); // El preset puede ser el que hayas configurado en Cloudinary

    return this.http.post(this.cloudinaryImageUrl, formData);
  }

  uploadVideo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.videoUploadPreset); // El preset puede ser el que hayas configurado en Cloudinary

    return this.http.post(this.cloudinaryVideoUrl, formData);
  }
}
