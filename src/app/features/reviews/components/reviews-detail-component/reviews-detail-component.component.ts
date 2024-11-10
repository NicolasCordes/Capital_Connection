import { Component, inject, Input, OnInit } from '@angular/core';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-reviews-detail-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-detail-component.component.html',
  styleUrl: './reviews-detail-component.component.css'
})
export class ReviewsDetailComponentComponent  implements OnInit{
  @Input() review: Review | null = null;

 
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
  

