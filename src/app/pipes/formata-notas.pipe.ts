import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formataNotas',
})
export class FormataNotasPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string): SafeHtml {
    // Primeiro, dividimos por palavras (mantendo pontuação como parte)
    const palavras = texto.split(/(\s+)/); // preserva os espaços entre as palavras

    const palavrasFormatadas = palavras.map((palavra) => {
      // Verifica se a palavra contém alguma nota {letra|nota}
      if (palavra.includes('{') && palavra.includes('}')) {
        // Substitui todas as notas dentro da palavra
        const formatada = palavra.replace(/\{([^|]+)\|([^}]+)\}/g, (match, letra, nota) => {
          return `<span class="nota"><small class="nota-label">${nota}</small>${letra}</span>`;
        });

        // Envolve a palavra inteira com nowrap
        return `<span style="white-space: nowrap;">${formatada}</span>`;
      }

      // Caso contrário, retorna a palavra normal
      return palavra;
    });

    const resultado = palavrasFormatadas.join('');
    return this.sanitizer.bypassSecurityTrustHtml(resultado);
  }
}
