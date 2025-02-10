import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { ActiveUser } from './types/account-data';
import { FooterComponent } from "./shared/footer/footer.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from './services/loading.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MatSlideToggleModule, MatProgressSpinnerModule, AsyncPipe ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  activeUser: ActiveUser | undefined;  isLoading = false;


  constructor(private authService: AuthService, public loadingService: LoadingService,private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
    this.loadingService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.authService.auth().subscribe(activeUser => {
      this.activeUser = activeUser;
    });

    // Detectar si estamos en la página de callback
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        // Si hay un código en la URL, lo manejamos
        this.authService.handleOAuth2Callback(code).subscribe(success => {
          if (success) {
            this.router.navigate(['/dashboard']); // Redirige a la página principal
          }
        });
      }
    });
  }

  onLogOut() {
    this.authService.logout().subscribe(() => {
      window.location.href = '/';
    });
  }
}
