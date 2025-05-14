import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formataIntro',
})
export class FormataIntroducoes implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string): SafeHtml {
    const resultado = texto.replaceAll(',', ' | ').replaceAll('+', '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(resultado);
  }
}
