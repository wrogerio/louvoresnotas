import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formataNotas2',
})
export class FormataNotasPipe2 implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string): SafeHtml {
    const resultado = texto.replaceAll(',', ' | ').replaceAll('+', '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(resultado);
  }
}
