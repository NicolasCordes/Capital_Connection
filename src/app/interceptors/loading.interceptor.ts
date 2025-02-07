import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // URLs que queremos excluir del spinner
  const excludedUrls = ['http://localhost:4200/entrepreneurships', '/filter']; // Incluye '/filter' si es necesario
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (!isExcluded) {
    loadingService.setLoadingState(true); // Activar spinner solo si la URL no está en la lista de exclusión
  }

  return next(req).pipe(
    finalize(() => {
      if (!isExcluded) {
        loadingService.setLoadingState(false); // Desactivar spinner solo si la URL no estaba excluida
      }
    })
  );
};
