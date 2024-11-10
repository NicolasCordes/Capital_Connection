import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/service.service';
import { ActiveUser } from '../../../auth/types/account-data';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css'
})
export class ProfileDetailsComponent implements OnInit{

  activeUser: ActiveUser | undefined;
  
  authService= inject(AuthService)

  ngOnInit() {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
    });
  }
 
}
