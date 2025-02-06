    import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
    import { filter, map, Subscription } from 'rxjs';
    import { AuthService } from '../../services/auth.service';
    import { CommonModule } from '@angular/common';
    import { RouterModule } from '@angular/router';
    import { EntrepreneurshipService } from '../../services/entrepreneurship.service';
    import { Entrepreneurship } from '../../types/entrepreneurship.model';

    @Component({
      selector: 'app-home-page',
      standalone: true,
      imports: [CommonModule, RouterModule],
      templateUrl: './home-page.component.html',
      styleUrls: ['./home-page.component.css'],
    })
    export class HomePageComponent implements OnInit, OnDestroy {
      username = 'invitado';
      private sub?: Subscription;
      entrepreneurships: Entrepreneurship[] = [];
      showArrows = false;
      slidesVisible = 3;
      private gap = 30; // Espacio entre slides en px
      isTouch: boolean = false;
      startX: number = 0;
      currentIndex: number = 0; // Índice del slide actual


      constructor(
        private authService: AuthService,
        private entrepreneurshipService: EntrepreneurshipService,
        private cdr: ChangeDetectorRef

      ) {}

      ngOnInit(): void {
        window.scrollTo(0, 0);
        this.detectTouchDevice();


        this.entrepreneurshipService.getEntrepreneurshipsActives(0, 9).subscribe({
          next: (response) => {
            this.entrepreneurships = response.content;
            this.updateArrowVisibility();
          },
          error: (err) => {
            console.error('Error al obtener entrepreneurships', err);
          },
        });

        this.sub = this.authService.auth().subscribe({
          next: (activeUser) => {
            this.username = activeUser?.username || 'invitado';
          },
        });

        window.addEventListener('resize', this.updateArrowVisibility.bind(this));
      }

      goToSlide(index: number): void {
        this.currentIndex = index;
      }
      private detectTouchDevice(): void {
        const mediaQuery = window.matchMedia('(pointer: coarse)');
        this.isTouch = mediaQuery.matches;

        mediaQuery.addEventListener('change', e => {
          this.isTouch = e.matches;
        });
      }
        @HostListener('touchstart', ['$event'])
        onTouchStart(event: TouchEvent): void {
          this.startX = event.touches[0].clientX;
        }

        @HostListener('touchend', ['$event'])
        onTouchEnd(event: TouchEvent): void {
          const endX = event.changedTouches[0].clientX;
          if (Math.abs(this.startX - endX) > 50) {
            if (this.startX > endX) {
              this.nextSlide();
            } else {
              this.previousSlide();
            }
          }
        }
      ngOnDestroy(): void {
        this.sub?.unsubscribe();
        window.removeEventListener('resize', this.updateArrowVisibility.bind(this));
        const mediaQuery = window.matchMedia('(pointer: coarse)');
        mediaQuery.removeEventListener('change', () => {});
      }

      updateArrowVisibility(): void {
        const screenWidth = window.innerWidth;
        this.slidesVisible = screenWidth < 480 ? 1 :
                              screenWidth < 768 ? 2 : 3;
        this.showArrows = this.entrepreneurships.length > this.slidesVisible;

        document.documentElement.style.setProperty('--slides-visible', this.slidesVisible.toString());
        document.documentElement.style.setProperty('--gap', `${this.gap}px`);
      }

      previousSlide(): void {
        if (this.currentIndex === 0) {
          this.currentIndex = this.entrepreneurships.length - 1;
        } else {
          this.currentIndex--;
        }
      }

      nextSlide(): void {
        if (this.currentIndex === this.entrepreneurships.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
      }

      moveSlider(direction: 'left' | 'right'): void {
        if (direction === 'right') {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }

      getProgressWidth(goal: number, collected: number): number {
        if (!goal) return 0;
        const progress = Math.min((collected / goal) * 100, 100);
        return Math.round(progress);
      }

    }
