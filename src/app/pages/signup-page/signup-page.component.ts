import { Component, OnInit } from '@angular/core';
import { SignupComponent } from '../../auth/components/sign-up/sign-up.component';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [SignupComponent],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent implements OnInit{
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

}
