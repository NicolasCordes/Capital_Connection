import { Component, EventEmitter, HostListener, inject, OnInit } from '@angular/core';
import { Entrepreneurship } from '../../models/entrepreneurship.model';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { DonationService } from '../../../donation/services/donation.service';
import { AuthService } from '../../../../auth/services/service.service';
import { ActiveUser } from '../../../../auth/types/account-data';

@Component({
  selector: 'app-entrepreneurship-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrepreneurship-list-component.component.html',
  styleUrl: './entrepreneurship-list-component.component.css',
})
export class EntrepreneurshipListComponent implements OnInit {
  entrepreneurships: Entrepreneurship[] = [];
  page = 0;             
  size = 12;              
  isLoading = false;       
  hasMore = true;    
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService= inject(AuthService)

   

  constructor(
    private entrepreneurshipService: EntrepreneurshipService,
    private donationService: DonationService,
    private router: Router
  ) {}

  ngOnInit(): void {
 
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });
    this.loadEntrepreneurships();
  }
  loadEntrepreneurships(): void {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;
  
    this.entrepreneurshipService.getEntrepreneurship(this.page, this.size).subscribe(
      (data) => {
        console.log('Datos recibidos de la API:', data);
  
        if (data && data.content) {
          const filteredEntrepreneurships = data.content.filter((entrepreneurship: Entrepreneurship) => entrepreneurship.activated === true);
  
          console.log('Emprendimientos filtrados:', filteredEntrepreneurships);
  
          this.entrepreneurships = [...this.entrepreneurships, ...filteredEntrepreneurships];
  
          this.hasMore = data.content.length === this.size;
  
          if (this.hasMore) this.page++;
  
        } else {
          this.hasMore = false;
        }
  
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.isLoading = false;
      }
    );
  }
  
  getProgressWidth(goal: number, collected: number): number {
    if (!goal) return 0; 
    const progress = Math.min((collected / goal) * 100, 100); 
    return Math.round(progress); 
  }

  navigateToDetails(id: number | null): void {
    this.router.navigate([`/entrepreneurships/${id}`]);
  }

  deleteEntrepreneurship(id: number | null): void {
    this.entrepreneurshipService.deleteEntrepreneurship(id).subscribe(() => {
      this.entrepreneurships = this.entrepreneurships.filter(
        (entrepreneurship) => entrepreneurship.id !== id
      );
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 120 && !this.isLoading && this.hasMore) {
      this.loadEntrepreneurships();
    }
  }
}