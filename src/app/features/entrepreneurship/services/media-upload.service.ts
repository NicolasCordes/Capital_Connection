import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MediaUploadService {
  private cloudinaryImageUrl = `https://api.cloudinary.com/v1_1/dyho1ydzl/image/upload`; // Asegúrate de que el URL es correcto

  constructor(private http: HttpClient) {}

  uploadImage(data: any): Observable<any> {
    return this.http.post(this.cloudinaryImageUrl, data);
  }
}
