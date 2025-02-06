import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ActiveUser } from '../../types/account-data';
import { ThemeSwitcherComponent } from "../../features/theme-switcher/theme-switcher.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, ThemeSwitcherComponent, MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isDarkThemeActive: boolean = false;

  activeUser: ActiveUser | undefined;

  constructor(private authService: AuthService) {}

  // Getter que devuelve la URL de la imagen según el estado del tema
  get logoUrl(): string {
    return this.isDarkThemeActive
      ? 'https://res.cloudinary.com/dyho1ydzl/image/upload/v1738812935/Logo_Minimal_D_dark.png'
      : 'https://res.cloudinary.com/dyho1ydzl/image/upload/v1738812935/Logo_Minimal_D_light.png';
  }

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
