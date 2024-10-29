import { Component, OnInit } from '@angular/core';
import { Entrepreneurship } from '../../models/entrepreneurship.model';
import { ActivatedRoute } from '@angular/router';
import { EntrepreneurshipService } from '../../services/entrepreneurship.service';

@Component({
  selector: 'app-entrepreneurship-detail-component',
  standalone: true,
  imports: [],
  templateUrl: './entrepreneurship-detail-component.component.html',
  styleUrl: './entrepreneurship-detail-component.component.css'
})
export class EntrepreneurshipDetailComponent implements OnInit {
  entrepreneurship: Entrepreneurship | null = null;

  constructor(
    private route: ActivatedRoute,
    private entrepreneurshipService: EntrepreneurshipService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.entrepreneurshipService.getEntrepreneurshipById(id).subscribe((data) => {
        this.entrepreneurship = data;
      });
    }
  }
}