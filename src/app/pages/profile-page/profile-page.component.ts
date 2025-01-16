import { Component, OnInit } from '@angular/core';
import { ProfileListComponent } from '../../features/profile/profile-list/profile-list.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileListComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit{
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

}
