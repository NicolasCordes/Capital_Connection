import { Component, OnInit } from '@angular/core';
import { Entrepreneurship } from '../../models/entrepreneurship.model';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';

@Component({
  selector: 'app-entrepreneurship-list-component',
  standalone: true,
  imports: [],
  templateUrl: './entrepreneurship-list-component.component.html',
  styleUrl: './entrepreneurship-list-component.component.css'
})
export class EntrepreneurshipListComponent implements OnInit {
  entrepreneurships: Entrepreneurship[] = [];

  constructor(private entrepreneurshipService: EntrepreneurshipService) {}

  ngOnInit(): void {
    this.entrepreneurshipService.getEntrepreneurship().subscribe((data) => {
      this.entrepreneurships = data;
    });
  }

  deleteEntrepreneurship(id: number): void {
    this.entrepreneurshipService.deleteEntrepreneurship(id).subscribe(() => {
      this.entrepreneurships = this.entrepreneurships.filter(
        (entrepreneurship) => entrepreneurship.id !== id
      );
    });
  }
}
