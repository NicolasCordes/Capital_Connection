import { Component, EventEmitter, OnInit } from '@angular/core';
import { Entrepreneurship } from '../../models/entrepreneurship.model';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entrepreneurship-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrepreneurship-list-component.component.html',
  styleUrl: './entrepreneurship-list-component.component.css',
})
export class EntrepreneurshipListComponent implements OnInit {
  entrepreneurships: Entrepreneurship[] = [];

  constructor(
    private entrepreneurshipService: EntrepreneurshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.entrepreneurshipService.getEntrepreneurship().subscribe((data) => {
      this.entrepreneurships = data;
    });
  }

  navigateToDetails(id: number): void {
    this.router.navigate([`/entrepreneurships/${id}`]);
  }

  deleteEntrepreneurship(id: number): void {
    this.entrepreneurshipService.deleteEntrepreneurship(id).subscribe(() => {
      this.entrepreneurships = this.entrepreneurships.filter(
        (entrepreneurship) => entrepreneurship.id !== id
      );
    });
  }
}
