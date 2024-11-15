import { Component, OnInit } from '@angular/core';
import { EntrepreneurshipFormComponent } from "../../features/entrepreneurship/components/entrepreneurship-form/entrepreneurship-form.component";

@Component({
  selector: 'app-entrepreneurship-form-page',
  standalone: true,
  imports: [EntrepreneurshipFormComponent],
  templateUrl: './entrepreneurship-form-page.component.html',
  styleUrl: './entrepreneurship-form-page.component.css'
})
export class EntrepreneurshipFormPageComponent implements OnInit{
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

}
