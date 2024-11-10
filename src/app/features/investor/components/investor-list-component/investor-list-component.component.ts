import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-investor-list-component',
  standalone: true,
  imports: [],
  templateUrl: './investor-list-component.component.html',
  styleUrl: './investor-list-component.component.css'
})
export class InvestorListComponentComponent implements OnInit{
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
