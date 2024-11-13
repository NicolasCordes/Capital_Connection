import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadImageComponent } from '../uploads/upload-image/upload-image.component';
import { CommonModule } from '@angular/common';
import { UploadVideoComponent } from "../uploads/upload-video/upload-video.component";
import { AuthService } from '../../../../services/auth.service';
import { ActiveUser } from '../../../../types/account-data';
import { EntrepreneurshipService } from '../../../../services/entrepreneurship.service';

@Component({
  selector: 'app-entrepreneurship-form',
  standalone:true,
  imports: [UploadImageComponent, ReactiveFormsModule, CommonModule, UploadVideoComponent],
  templateUrl: './entrepreneurship-form.component.html',
  styleUrls: ['./entrepreneurship-form.component.css']
})
export class EntrepreneurshipFormComponent implements OnInit {
  entrepreneurshipForm: FormGroup;
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private entrepreneurshipService: EntrepreneurshipService,
    private router: Router
  ) {
    this.entrepreneurshipForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      goal: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      images: this.fb.array([], this.imagesRequiredValidator()),
      videos: this.fb.array([]),
      idUser: this.activeUser?.id,
    });
  }

  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
      console.log("Estado de autenticación:", this.activeUser, this.userType);
    });
  }

  imagesRequiredValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray && control.length === 0) {
        return { 'imagesRequired': true };
      }
      return null;
    };
  }

  get imagesArray() {
    return this.entrepreneurshipForm.get('images') as FormArray;
  }

  get videosArray() {
    return this.entrepreneurshipForm.get('videos') as FormArray;
  }

  onImagesUploaded(imageUrls: string[]): void {
    imageUrls.forEach(url => this.imagesArray.push(this.fb.control(url)));
  }

  onVideosUploaded(videoUrls: string[]): void {
    videoUrls.forEach(url => this.videosArray.push(this.fb.control(url)));
  }

  removeImage(index: number): void {
    this.imagesArray.removeAt(index);
  }

  removeVideo(index: number): void {
    this.videosArray.removeAt(index);
  }

  addEntrepreneurship(): void {
    if (this.entrepreneurshipForm.valid) {
      let ent = this.entrepreneurshipForm.getRawValue();
      ent.idUser = this.activeUser?.id;
      ent.collected = 1;
      console.log('Emprendimiento a enviar:', ent);
      this.entrepreneurshipService
        .postEntrepreneurship(ent)
        .subscribe({
          next: () => {
            this.router.navigate(['/entrepreneurships']);
          },
          error: (e: Error) => {
            console.log(e);
          }
        });
    }
  }
}
