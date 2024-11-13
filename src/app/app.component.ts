import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { ActiveUser } from './types/account-data';
import { FooterComponent } from "./shared/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  activeUser: ActiveUser | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.auth().subscribe(activeUser => {
      this.activeUser = activeUser;
    });
  }

  onLogOut() {
    this.authService.logout().subscribe(() => {
      window.location.href = '/';
    });
  }
}

