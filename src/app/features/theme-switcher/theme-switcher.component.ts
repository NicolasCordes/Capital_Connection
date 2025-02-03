import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [MatSlideToggleModule, FormsModule, CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.css',
})
export class ThemeSwitcherComponent {
  isDarkThemeActive = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    // Detecta la preferencia de tema predeterminado del sistema operativo
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Si el localStorage no tiene un valor guardado, usa la preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
      this.isDarkThemeActive = true;
      this.applyDarkTheme();
    } else {
      this.isDarkThemeActive = false;
      this.applyLightTheme();
    }
  }

  onChange(newValue: boolean): void {
    this.isDarkThemeActive = newValue;
    if (newValue) {
      this.applyDarkTheme();
      localStorage.setItem('theme', 'dark'); // Guardar el tema oscuro
    } else {
      this.applyLightTheme();
      localStorage.setItem('theme', 'light'); // Guardar el tema claro
    }
  }

  private applyDarkTheme(): void {
    this.document.body.classList.add('dark-theme');
  }

  private applyLightTheme(): void {
    this.document.body.classList.remove('dark-theme');
  }
}
