import { Component, inject, OnInit } from '@angular/core'; 
import { AuthService } from '../../../auth/services/service.service';
import { ActiveUser } from '../../../auth/types/account-data';
import { Entrepreneurship } from '../../entrepreneurship/models/entrepreneurship.model';
import { DonationService } from '../../donation/services/donation.service';
import { EntrepreneurshipService } from '../../entrepreneurship/services/entrepreneurship.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Donation } from '../../donation/models/donation.model';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {

  activeUser: ActiveUser | undefined;
  donateds: Donation[] = [];
  donatedEntrepreneurships: Entrepreneurship[] = [];
  createdEntrepreneurships: Entrepreneurship[] = []; // Nueva propiedad para los emprendimientos creados por el usuario
  currentSection: string = ''; // Nueva propiedad para gestionar la sección activa

  authService = inject(AuthService);
  donationService = inject(DonationService);
  entrepreneurshipService = inject(EntrepreneurshipService);
  router = inject(Router);
  amounts: number[] = [];

  ngOnInit() {
    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
    });
  }

  // Método para cambiar la sección activa (Donaciones o Emprendimientos)
  showSection(section: string) {
    this.currentSection = section;

    // Si la sección seleccionada es 'donations', cargamos las donaciones del usuario
    if (section === 'donations' && this.activeUser) {
      this.loadDonatedEntrepreneurships(this.activeUser.id);
    }
  }

  // Cargar los emprendimientos a los que el usuario ha donado
  loadDonatedEntrepreneurships(userId: string) {
    this.donationService.getDonationsByUserId(userId).subscribe(donations => {
      this.donateds = donations;
      console.log(donations);
      const entrepreneurshipIds = donations.map(donation => donation.idEntrepreneurship).filter(id => id !== undefined);

      // Cargar cada emprendimiento por su id
      this.donatedEntrepreneurships = []; // Limpiamos la lista antes de cargar los nuevos emprendimientos
      entrepreneurshipIds.forEach(id => {
        this.entrepreneurshipService.getEntrepreneurshipById(id!).subscribe(entrepreneurship => {
          this.donatedEntrepreneurships.push(entrepreneurship);
        });
      });
    });
  }

  // Navegar a los detalles de un emprendimiento
  navigateToDetails(id: number | undefined): void {
    if (id) {
      this.router.navigate([`/entrepreneurships/${id}`]);
    }
  }

  // Método para redirigir a la ruta de favoritos del usuario activo
  goToFavorites(): void {
    if (this.activeUser) {
      this.router.navigate([`/favorites/${this.activeUser.id}`]);  // Redirige a la ruta de favoritos
    } else {
      console.error('No active user found');
    }
  }

  // Método para redirigir a la ruta de mis emprendimientos del usuario activo
  goToMyEntrepreneurships(): void {
    if (this.activeUser) {
      console.log("User ID:", this.activeUser.id); // Verifica que el id esté presente
      this.router.navigate([`/update-entrepreneurships/${this.activeUser.id}`]);
    } else {
      console.error('No active user found');
    }
  }
}
