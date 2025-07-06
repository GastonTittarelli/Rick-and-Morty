import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTranslate'
})
export class StatusTranslatePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Alive':
        return 'Vivo';
      case 'Dead':
        return 'Muerto';
      case 'unknown':
        return 'Desconocido';
      default:
        return value;
    }
  }
}