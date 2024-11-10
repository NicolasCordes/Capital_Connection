import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/service.service';
import { ActiveUser } from '../../../auth/types/account-data';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.css'
})
export class ProfileListComponent implements OnInit {
    activeUser: ActiveUser | undefined;
  
    authService= inject(AuthService)
  
    ngOnInit() {
      this.authService.auth().subscribe((user) => {
        this.activeUser = user;
      });
    }
  
   
  }