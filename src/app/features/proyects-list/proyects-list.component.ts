import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/service.service';
import { ActiveUser } from '../../auth/types/account-data';

@Component({
  selector: 'app-proyects-list',
  standalone: true,
  imports: [],
  templateUrl: './proyects-list.component.html',
  styleUrl: './proyects-list.component.css'
})
export class ProyectsListComponent implements OnInit{
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)
  ngOnInit(): void {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });
  }
}
