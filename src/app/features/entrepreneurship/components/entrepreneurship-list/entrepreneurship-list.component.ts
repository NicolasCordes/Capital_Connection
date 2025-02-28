import { Component, EventEmitter, HostListener, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { ActiveUser } from '../../../../types/account-data';
import { EntrepreneurshipService } from '../../../../services/entrepreneurship.service';
import { DonationService } from '../../../../services/donation.service';
import { Entrepreneurship } from '../../../../types/entrepreneurship.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entrepreneurship-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './entrepreneurship-list.component.html',
  styleUrls: ['./entrepreneurship-list.component.css'],
})
export class EntrepreneurshipListComponent implements OnInit {
  entrepreneurships: Entrepreneurship[] = [];
  originalEntrepreneurships: Entrepreneurship[] = []; // Guardar la lista original
  @Output() entrepreneurshipDeleted = new EventEmitter<void>();
  page: number = 0;
  size: number = 12;
  isLoading: boolean = false;
  hasMore: boolean = true;
  activeUser: ActiveUser | undefined;
  userType: string = 'Guest';
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  category: string | null = null;
  goalValue: string | null = null;  // Cambié 'String' a 'string'
  goal: number | null = null;

  // Estado del botón de orden
  sortState: number = 0; // 0 = sin orden, 1 = mayor a menor, 2 = menor a mayor

  filterForm: FormGroup = this.fb.group({
    category: [''],
    goal: [''],
  });

  constructor(
    private entrepreneurshipService: EntrepreneurshipService,
    private donationService: DonationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {


    this.authService.auth().subscribe((user) => {
      this.activeUser = user;
      this.userType = user ? 'Registered User' : 'Guest';
    });

      // Captura el parámetro de consulta 'category'
    this.route.queryParams.subscribe((params) => {
      const category = params['category'];
      if (category) {
        this.category = category;
        this.filterForm.get('category')?.setValue(category); // Actualiza el formulario
        this.onFilter(); // Aplica el filtro
      } else {
        this.loadEntrepreneurships(); // Carga todos los emprendimientos si no hay categoría
      }
    });
  }


  onFilter(): void {
    this.page = 0;
    this.entrepreneurships = [];
    this.originalEntrepreneurships = []; // Resetear la lista original
    this.hasMore = true;

    // Obtener valores de los filtros
    this.category = this.filterForm.get('category')?.value;
    this.goalValue = this.filterForm.get('goal')?.value;
    this.goal = this.goalValue ? Number(this.goalValue) : null;
    this.sortState = 0;

    let goalCondition: 'asc' | 'desc' | 'none' = 'none';  // Valor por defecto es 'none'
    // Determinar la condición de orden basada en el goal
    if (this.goal !== null) {
      // Si hay un valor de goal, se asigna 'asc' o 'desc' según el valor ingresado
      goalCondition = this.sortState === 1 ? 'desc' : (this.sortState === 2 ? 'asc' : 'none');
    }

    // Llamar al servicio para cargar los emprendimientos con los filtros y orden
    this.loadEntrepreneurships(this.category, this.goal, goalCondition);
  }


  loadEntrepreneurships(
    category?: string | null,
    goal?: number | null,
    goalCondition: 'asc' | 'desc' | 'none' = 'none',
    sortDirection: 'asc' | 'desc' = 'asc'
  ): void {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;

    // Asegúrate de que goal esté definido como null si es undefined
    if (goal === undefined) goal = null;

    this.entrepreneurshipService
      .getEntrepreneurshipsFiltered(category, goal, this.page, this.size, goalCondition, sortDirection)
      .subscribe(
        (data) => {
          if (data && data.content) {
            this.entrepreneurships = [...this.entrepreneurships, ...data.content];
            this.hasMore = data.content.length === this.size;
            if (this.hasMore) this.page++;
          } else {
            this.hasMore = false;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al obtener emprendimientos:', error);
          this.isLoading = false;
        }
      );
  }


  toggleSort(): void {
    const category = this.category;
    const goal = this.goal;

    if (goal !== null) {
      this.sortState = (this.sortState + 1) % 3;
      let goalCondition: 'asc' | 'desc' | 'none' = 'none';

      // Corregir la asignación de goalCondition según sortState
      if (this.sortState === 1) {
        goalCondition = 'asc'; // Ascendente: de menor a mayor
      } else if (this.sortState === 2) {
        goalCondition = 'desc'; // Descendente: de mayor a menor
      }

      this.page = 0;
      this.entrepreneurships = [];
      this.hasMore = true;
      // No pasar sortDirection, o alinearlo con goalCondition si es necesario
      this.loadEntrepreneurships(category, goal, goalCondition);
    } else {
      this.sortState = (this.sortState + 1) % 3;
      const sortDirection = this.sortState === 1 ? 'asc' : 'desc'; // Ajustar según el estado

      this.page = 0;
      this.entrepreneurships = [];
      this.hasMore = true;
      this.loadEntrepreneurships(category, null, 'none', sortDirection);
    }
  }

 getSortLabel(): string {
  if (this.sortState === 0) return "=";
  if (this.sortState === 1) return "Asc";
  return "Desc";
}

  getProgressWidth(goal: number, collected: number): number {
    if (!goal) return 0;
    const progress = Math.min((collected / goal) * 100, 100);
    return Math.round(progress);
  }

  navigateToDetails(id: number | null): void {
    if (id) {
      this.router.navigate([`/entrepreneurships/${id}`]);
    }
  }

  deleteEntrepreneurship(id: number | null): void {
    console.log('hola, id: ', id);
    if (!id) return;
    console.log("Llamando a deactivateEntrepreneurship con ID:", id);
    this.entrepreneurshipService.deactivateEntrepreneurship(id).subscribe({
      next: () => {
        console.log("Petición exitosa, eliminando de la lista...");
        this.entrepreneurships = this.entrepreneurships.filter(
          (entrepreneurship) => entrepreneurship.id !== id
        );
        console.log("estoy en el handleee");
        this.entrepreneurshipDeleted.emit();
      },
      error: (err) => {
        console.error("Error al desactivar:", err);
      },
    });
  }


  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 120 &&
      !this.isLoading &&
      this.hasMore
    ) {
      this.loadEntrepreneurships();
    }
  }
}
