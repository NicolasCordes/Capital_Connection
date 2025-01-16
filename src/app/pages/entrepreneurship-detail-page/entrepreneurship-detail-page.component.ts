import { Component, OnInit } from '@angular/core';
import { EntrepreneurshipDetailComponent } from '../../features/entrepreneurship/components/entrepreneurship-detail/entrepreneurship-detail.component';

@Component({
  selector: 'app-entrepreneurship-detail-page',
  standalone: true,
  imports: [EntrepreneurshipDetailComponent],
  templateUrl: './entrepreneurship-detail-page.component.html',
  styleUrl: './entrepreneurship-detail-page.component.css'
})
export class EntrepreneurshipDetailPageComponent implements OnInit{
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

}
