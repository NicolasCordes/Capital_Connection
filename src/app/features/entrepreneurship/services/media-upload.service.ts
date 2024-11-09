import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MediaUploadService {
  private cloudinaryImageUrl = `https://api.cloudinary.com/v1_1/dyho1ydzl/image/upload`; // Asegúrate de que el URL es correcto
  private cloudinaryVideoUrl = `https://api.cloudinary.com/v1_1/dyho1ydzl/video/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(data: any): Observable<any> {
    return this.http.post(this.cloudinaryImageUrl, data);
  }

  uploadVideo(data: any): Observable<any> {
    return this.http.post(this.cloudinaryVideoUrl, data);
  }

  deleteImage(imageUrl: string) {
    const publicId = imageUrl.split('/').pop()?.split('.')[0]; // Obtener el public_id de la URL de Cloudinary
    const url = `https://api.cloudinary.com/v1_1/dyho1ydzl/delete_by_token`; // URL de la API para eliminar

    const formData = new FormData();
    formData.append('token', 'your_api_token');  // Asegúrate de incluir un token válido si lo usas

    return this.http.post(url, formData);
  }


  deleteVideo(videoUrl: string) {
    const publicId = videoUrl.split('/').pop()?.split('.')[0]; // Obtener el public_id de la URL de Cloudinary
    const url = `https://api.cloudinary.com/v1_1/dyho1ydzl/delete_by_token`; // URL de la API para eliminar

    const formData = new FormData();
    formData.append('token', 'your_api_token');  // Asegúrate de incluir un token válido si lo usas

    return this.http.post(url, formData);
  }
}
