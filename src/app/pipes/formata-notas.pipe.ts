import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formataNotas',
})
export class FormataNotasPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string): SafeHtml {
    const regex = /\{([^|]+)\|([^}]+)\}/g;

    const resultado = texto.replace(regex, (match, letra, nota) => {
      return `<span class="nota"><small class="nota-label">${nota}</small>${letra}</span>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(resultado);
  }
}

export class FormataNotasPipe2 implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string): SafeHtml {
    const resultado = texto.replaceAll(',', '|');

    return this.sanitizer.bypassSecurityTrustHtml(resultado);
  }
}
