  import { Injectable } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';

  @Injectable({
    providedIn: 'root',
  })
    export class LoadingService {
      private loadingSubject = new BehaviorSubject<boolean>(false);
      isLoading$ = this.loadingSubject.asObservable();

      private pendingRequests = 0;
      setLoadingState(state: boolean) {
        if (state) {
          this.pendingRequests++;
        } else {
          this.pendingRequests--;
        }

        setTimeout(() => {
          this.loadingSubject.next(this.pendingRequests > 0);
        });
      }
    }
