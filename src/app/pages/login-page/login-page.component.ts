import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../../auth/components/login/login.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

}
