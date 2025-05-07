import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formataNotas',
})
export class FormataNotasPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return '| ' + value.replaceAll(' ', '').replaceAll(',', ' | ').replaceAll('+', ' |<br>| ') + ' | ';
  }
}
