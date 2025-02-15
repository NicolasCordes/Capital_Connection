import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTransform',
  standalone:true
})
export class StatusPipe implements PipeTransform {
  transform(value: String): String {
    switch (value.toLowerCase()) {
      case 'approved':
        return 'Aprobada ✅';
      case 'pending':
        return 'Pendiente ⏳';
      case 'rejected':
        return 'Rechazada ❌';
      default:
        return 'Desconocido';
    }
  }
}
