import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { Entrepreneurship } from '../../models/entrepreneurship.model';

@Component({
  selector: 'app-entrepreneurship-form-component',
  standalone: true,
  imports: [],
  templateUrl: './entrepreneurship-form-component.component.html',
  styleUrl: './entrepreneurship-form-component.component.css'
})
export class EntrepreneurshipFormComponent implements OnInit {
  entrepreneurshipForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private entrepreneurshipService: EntrepreneurshipService
  ) {
    this.entrepreneurshipForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      goal: [0, Validators.required],
      category: ['', Validators.required],
      images: [[]],
      videos: [[]],
      reviews: [[]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.entrepreneurshipForm.valid) {
      const entrepreneurship: Entrepreneurship = this.entrepreneurshipForm.value;
      this.entrepreneurshipService.postEntrepreneurship(entrepreneurship).subscribe((data) => {
        console.log('New entrepreneurship created', data);
      });
    }
  }
}