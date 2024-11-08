import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/service.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  activeUser = false;
  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sub = this.authService.auth().subscribe({
      next: (activeUser) => {
        if(activeUser) {
          this.activeUser = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onLogOut() {
    this.authService.logout().subscribe({
      next: (loggedOut) => {
        if (loggedOut) {
          this.activeUser = false;
          this.router.navigate(['/']);
        }
      }
    })
  }
}
