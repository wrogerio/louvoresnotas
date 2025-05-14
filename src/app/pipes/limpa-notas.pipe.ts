import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limpaNotas',
})
export class LimpaNotasPipe implements PipeTransform {
  transform(texto: string): string {
    // Substitui {letra|nota} por apenas a letra
    return texto.replace(/\{([^|]+)\|[^}]+\}/g, '$1');
  }
}
