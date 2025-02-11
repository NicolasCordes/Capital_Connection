import { Component } from '@angular/core';
import { SignupComponent } from "../../auth/components/sign-up/sign-up.component";
import { SignupwgoogleComponent } from "../../auth/components/signupwgoogle/signupwgoogle.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signupgoogle',
  standalone: true,
  imports: [SignupwgoogleComponent],
  templateUrl: './signupgoogle.component.html',
  styleUrl: './signupgoogle.component.css'
})
export class SignupgoogleComponent {


}

