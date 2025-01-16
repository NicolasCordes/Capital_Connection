import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaUploadService {
  private cloudinaryImageUrl = `https://api.cloudinary.com/v1_1/${environment.CLOUD_NAME}/image/upload`;
  private cloudinaryVideoUrl = `https://api.cloudinary.com/v1_1/${environment.CLOUD_NAME}/video/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(data: any): Observable<any> {
    return this.http.post(this.cloudinaryImageUrl, data);
  }

  uploadVideo(data: any): Observable<any> {
    return this.http.post(this.cloudinaryVideoUrl, data);
  }

  deleteImage(imageUrl: string) {
    const publicId = imageUrl.split('/').pop()?.split('.')[0];
    const url = `https://api.cloudinary.com/v1_1/${environment.CLOUD_NAME}/delete_by_token`;

    const formData = new FormData();
    formData.append('token', environment.API_KEY); // Suponiendo que `API_KEY` sea el token

    return this.http.post(url, formData);
  }

  deleteVideo(videoUrl: string) {
    const publicId = videoUrl.split('/').pop()?.split('.')[0];
    const url = `https://api.cloudinary.com/v1_1/${environment.CLOUD_NAME}/delete_by_token`;

    const formData = new FormData();
    formData.append('token', environment.API_KEY); // Suponiendo que `API_KEY` sea el token

    return this.http.post(url, formData);
  }
}

