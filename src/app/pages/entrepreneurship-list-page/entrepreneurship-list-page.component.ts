import { Component, OnInit } from '@angular/core';
import { EntrepreneurshipListComponent } from "../../features/entrepreneurship/components/entrepreneurship-list/entrepreneurship-list.component";

@Component({
  selector: 'app-entrepreneurship-list-page',
  standalone: true,
  imports: [EntrepreneurshipListComponent],
  templateUrl: './entrepreneurship-list-page.component.html',
  styleUrl: './entrepreneurship-list-page.component.css'
})
export class EntrepreneurshipListPageComponent implements OnInit{
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

}
