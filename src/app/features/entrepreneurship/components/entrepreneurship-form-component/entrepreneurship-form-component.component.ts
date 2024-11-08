import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { MediaUploadService } from '../../services/media-upload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entrepreneurship-form-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './entrepreneurship-form-component.component.html',
  styleUrls: ['./entrepreneurship-form-component.component.css']
})
export class EntrepreneurshipFormComponent implements OnInit {
  entrepreneurshipForm: FormGroup;
  isEditing: boolean = false;
  entrepreneurship: any;
  imageUrls: string[] = [];
  videoUrls: string[] = [];
  isUploading: boolean = false;  // Para indicar que se están cargando los archivos
  previewImageUrl: string | null = null; // Vista previa de la imagen

  constructor(
    private fb: FormBuilder,
    private entrepreneurshipService: EntrepreneurshipService,
    private mediaUploadService: MediaUploadService,
    private route: ActivatedRoute,
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

    this.entrepreneurship = {
      id: 0,
      name: '',
      description: '',
      goal: 0,
      category: '',
      images: [],
      videos: [],
      reviews: []
    };
  }

  ngOnInit(): void {
    const entrepreneurshipId = this.route.snapshot.params['id'];
    if (entrepreneurshipId) {
      this.isEditing = true;
      this.entrepreneurshipService.getEntrepreneurshipById(entrepreneurshipId).subscribe((data) => {
        this.entrepreneurship = data;
        this.entrepreneurshipForm.patchValue(data);
        this.setImages(data.images);
        this.setVideos(data.videos);
      });
    }
  }

  get imageUrlsArray() {
    return (this.entrepreneurshipForm.get('images') as FormArray);
  }

  get videoUrlsArray() {
    return (this.entrepreneurshipForm.get('videos') as FormArray);
  }

  // Método para manejar la selección de archivos
  onFileSelected(event: any, mediaType: 'image' | 'video') {
    const files: File[] = Array.from(event.target.files);
    files.forEach(file => {
      if (mediaType === 'image') {
        if (file.size <= 2 * 1024 * 1024) {  // Verifica que la imagen no exceda los 2MB
          this.uploadImage(file);
        } else {
          alert('El tamaño de la imagen no puede exceder los 2MB');
        }
      } else if (mediaType === 'video') {
        if (file.size <= 5 * 1024 * 1024) {  // Verifica que el video no exceda los 5MB
          this.uploadVideo(file);
        } else {
          alert('El tamaño del video no puede exceder los 5MB');
        }
      }
    });
  }

  // Vista previa de la imagen
  previewImage(file: File): string {
    return URL.createObjectURL(file); // Para mostrar una vista previa de la imagen antes de subirla
  }

  // Carga de la imagen a Cloudinary
  uploadImage(file: File) {
    this.isUploading = true;  // Indicamos que está subiendo un archivo
    this.mediaUploadService.uploadImage(file).subscribe(
      (response) => {
        const imageUrl = response.secure_url;
        this.imageUrls.push(imageUrl);
        this.imageUrlsArray.push(this.fb.control(imageUrl)); // Agrega la URL al FormArray
        this.isUploading = false;  // Indicar que la carga ha terminado
      },
      (error) => {
        console.error('Error al cargar la imagen:', error);
        this.isUploading = false;  // Si hay error, también se detiene la carga
      }
    );
  }

  // Carga del video a Cloudinary
  uploadVideo(file: File) {
    this.isUploading = true;  // Indicamos que está subiendo un archivo
    this.mediaUploadService.uploadVideo(file).subscribe(
      (response) => {
        const videoUrl = response.secure_url;
        this.videoUrls.push(videoUrl);
        this.videoUrlsArray.push(this.fb.control(videoUrl)); // Agrega la URL al FormArray
        this.isUploading = false;  // Indicar que la carga ha terminado
      },
      (error) => {
        console.error('Error al cargar el video:', error);
        this.isUploading = false;  // Si hay error, también se detiene la carga
      }
    );
  }

  saveEntrepreneurship(): void {
    if (this.isEditing) {
      this.entrepreneurshipService.updateEntrepreneurship(this.entrepreneurship.id, this.entrepreneurshipForm.value).subscribe(() => {
        this.router.navigate(['/entrepreneurship']);
      });
    } else {
      this.entrepreneurshipService.postEntrepreneurship(this.entrepreneurshipForm.value).subscribe(() => {
        this.router.navigate(['/entrepreneurship']);
      });
    }
  }

  setImages(images: string[]) {
    images.forEach(image => {
      this.imageUrlsArray.push(this.fb.control(image));
    });
  }

  setVideos(videos: string[]) {
    videos.forEach(video => {
      this.videoUrlsArray.push(this.fb.control(video));
    });
  }

  trackByIndex(index: number): number {
    return index; // Optimización de *ngFor
  }
}
