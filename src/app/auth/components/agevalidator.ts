import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ageValidator(control: AbstractControl): ValidationErrors | null {
  const birthDate = new Date(control.value);
  const currentDate = new Date();
  
  // Calcular la edad
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  
  // Si la fecha de nacimiento aún no ha llegado este año, restar un año
  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  // Si la edad es mayor o igual a 16, el validador es válido
  return age >= 16 ? null : { 'ageInvalid': true };
}
