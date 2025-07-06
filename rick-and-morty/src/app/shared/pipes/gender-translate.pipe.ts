import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genderTranslate'
})
export class GenderTranslatePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Male':
        return 'Masculino';
      case 'Female':
        return 'Femenino';
      case 'Genderless':
        return 'Sin género';
      case 'unknown':
        return 'Desconocido';
      default:
        return value;
    }
  }
}
