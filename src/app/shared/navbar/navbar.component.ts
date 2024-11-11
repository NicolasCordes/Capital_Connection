import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/service.service';
import { CommonModule } from '@angular/common';
import { ActiveUser } from '../../auth/types/account-data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
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