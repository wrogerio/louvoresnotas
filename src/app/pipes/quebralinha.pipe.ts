import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quebralinha',
})
export class QuebralinhaPipe implements PipeTransform {
  transform(value: string): string {
    const resultado = value.replaceAll('qq', '<br>');
    return resultado;
  }
}
