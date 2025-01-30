  import { Component, inject, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
  import { AuthService } from '../../../../services/auth.service';
  import { CommonModule } from '@angular/common';
  import { ActiveUser } from '../../../../types/account-data';
  import { UploadVideoComponent } from "../uploads/upload-video/upload-video.component";
  import { UploadImageComponent } from "../uploads/upload-image/upload-image.component";
  import { EntrepreneurshipService } from '../../../../services/entrepreneurship.service';
import { Entrepreneurship } from '../../../../types/entrepreneurship.model';

  @Component({
    selector: 'app-entrepreneurships-updates',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, UploadVideoComponent, UploadImageComponent],
    templateUrl: './entrepreneurships-updates.component.html',
    styleUrls: ['./entrepreneurships-updates.component.css']
  })
  export class EntrepreneurshipsUpdatesComponent implements OnInit{
    createdEntrepreneurships: Entrepreneurship[] = [];
  editForm: FormGroup;
  editingEntrepreneurship: Entrepreneurship | null = null;
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  router = inject(Router);
  entrepreneurshipService = inject(EntrepreneurshipService);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  modalMessage: String = '';
  isModalVisible: boolean = false;

  constructor() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      images: this.fb.array([], [Validators.required, this.minimumLengthArray(1)]),
      videos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
      this.loadCreatedEntrepreneurships();
    });
  }

  // FormArrays para imágenes y videos
  get imagesArray() {
    return this.editForm.get('images') as FormArray;
  }

  get videosArray() {
    return this.editForm.get('videos') as FormArray;
  }

  loadCreatedEntrepreneurships() {
    if (this.activeUser) {
      this.entrepreneurshipService.getEntrepreneurshipsByAccountId(this.activeUser.id).subscribe(entrepreneurships => {
        this.createdEntrepreneurships = entrepreneurships;
      });
    }
  }

  editEntrepreneurship(entrepreneurship: Entrepreneurship) {
    this.editingEntrepreneurship = entrepreneurship;
    this.editForm.patchValue({
      name: entrepreneurship.name,
      description: entrepreneurship.description,
      category: entrepreneurship.category
    });

    // Limpiar y cargar imágenes y videos en los FormArray
    this.imagesArray.clear();
    this.videosArray.clear();
    entrepreneurship.images.forEach(imageUrl => this.imagesArray.push(this.fb.control(imageUrl)));
    entrepreneurship.videos.forEach(videoUrl => this.videosArray.push(this.fb.control(videoUrl)));
  }

  saveChanges() {
    if (this.editForm.invalid || !this.editingEntrepreneurship) {
      return;
    }

    const updatedEntrepreneurship: Entrepreneurship = {
      ...this.editingEntrepreneurship,
      ...this.editForm.value
    };

    if(this.editingEntrepreneurship.id)
    this.entrepreneurshipService.updateEntrepreneurship(this.editingEntrepreneurship.id, updatedEntrepreneurship).subscribe(() => {
      this.loadCreatedEntrepreneurships();
      this.editingEntrepreneurship = null;
    });
  }

  cancelEdit() {
    this.editingEntrepreneurship = null;
  }

  onImagesUploaded(imageUrls: string[]): void {
    imageUrls.forEach(url => this.imagesArray.push(this.fb.control(url)));
  }

  onVideosUploaded(videoUrls: string[]): void {
    videoUrls.forEach(url => this.videosArray.push(this.fb.control(url)));
  }

  removeImage(index: number, isPersistedImage: boolean = false): void {


    const imageUrl = this.imagesArray.at(index).value;
    this.imagesArray.removeAt(index);

    if (isPersistedImage && this.editingEntrepreneurship) {
      const updatedImages = this.imagesArray.value;
      const updatedEntrepreneurship = { ...this.editingEntrepreneurship, images: updatedImages };

    }
  }

  removeVideo(index: number, isPersistedVideo: boolean = false): void {

    const videoUrl = this.videosArray.at(index).value;
    this.videosArray.removeAt(index);

    if (isPersistedVideo && this.editingEntrepreneurship) {
      const updatedVideos = this.videosArray.value;
      const updatedEntrepreneurship = { ...this.editingEntrepreneurship, videos: updatedVideos };

    }
  }

  showModal(){
    this.modalMessage = '¿Esta seguro que desea eliminar este emprendimiento?';
    this.isModalVisible = true;
  }

  deleteEntrepreneurship(entrepreneurship: Entrepreneurship) {
    this.closeModal()
    if (entrepreneurship.id) {
      this.entrepreneurshipService.deactivateEntrepreneurship(entrepreneurship.id).subscribe(() => {
        this.loadCreatedEntrepreneurships();
      });


    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }


  minimumLengthArray(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return control.length >= minLength ? null : { minLengthArray: { requiredLength: minLength, actualLength: control.length } };
      }
      return null;
    };
  }

  navigateToDetails(id: number | undefined): void {
    this.router.navigate([`/entrepreneurships/${id}`]);
  }

}
