import { Component, Renderer2, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { LetraModel } from '../../../interfaces/models';
import { CommonModule } from '@angular/common';
import { FormataNotasPipe } from '../../../pipes/formata-notas.pipe';
import { QuebralinhaPipe } from '../../../pipes/quebralinha.pipe';
import { FormataIntroducoes } from '../../../pipes/formata-introducoes.pipe';
import { LimpaNotasPipe } from '../../../pipes/limpa-notas.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-letras-cantar',
  standalone: true,
  imports: [CommonModule, FormsModule, FormataNotasPipe, FormataIntroducoes, QuebralinhaPipe, LimpaNotasPipe],
  templateUrl: './letras-cantar.component.html',
  styleUrls: ['./letras-cantar.component.css'],
})
export class LetrasCantarComponent {
  tons: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  mapaTons: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  tomOriginal: string = '';
  tomSelecionado: string = '';
  tomDoLouvor: string = '';

  mostrarNotas: boolean = true;

  id: string = '';
  Letras: LetraModel[] = [];
  LetrasOriginal: LetraModel[] = [];
  Apresentacao: string[] = [];

  fontSize: number = 1;
  scrollInterval: any;
  scrollSpeed: number = 60;
  scrollStep: number = 1;
  isScrolling: boolean = false;

  nomeDoLouvor: string = '';

  constructor(private supabaseService: SupabaseService, private route: ActivatedRoute, private router: Router, private renderer: Renderer2, private cdr: ChangeDetectorRef) {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? '';

      if (this.id) {
        this.supabaseService.onLetraChanged(this.id, () => {
          this.carregaLetra();
        });

        this.carregaLetra();
      }
    });

    const savedFontSize = localStorage.getItem('fontSizeLS');
    this.fontSize = savedFontSize ? parseFloat(savedFontSize) : 1.4;
    localStorage.setItem('fontSizeLS', this.fontSize.toString());
  }

  async carregaLetra() {
    if (this.id) {
      const response = await this.supabaseService.getLetrasByLouvorId(this.id);
      if (response) {
        this.LetrasOriginal = JSON.parse(JSON.stringify(response)); // cópia original imutável
        this.Letras = JSON.parse(JSON.stringify(response)); // versão que será transposta
        this.cdr.detectChanges();

        const responseLouvor = await this.supabaseService.getLouvorById(this.id);
        if (responseLouvor) {
          this.nomeDoLouvor = responseLouvor.nome;
          this.tomOriginal = responseLouvor.tom;
          this.tomSelecionado = responseLouvor.tom;
          this.tomDoLouvor = responseLouvor.tom;
          this.tomSelecionado = this.tomOriginal;
        }
      } else {
        console.error('Erro ao carregar letra:', response);
      }
    }
  }

  alterarTom() {
    const diff = this.calcularSemitons(this.tomOriginal, this.tomSelecionado);
    console.log('[ALTERAR TOM] Transpondo de', this.tomOriginal, 'para', this.tomSelecionado, `(${diff} semitons)`);

    this.Letras = this.LetrasOriginal.map((item) => ({
      ...item,
      letra: this.transporLetra(item.letra, diff),
    }));

    this.tomDoLouvor = this.tomSelecionado;
  }

  calcularSemitons(de: string, para: string): number {
    const from = this.mapaTons.indexOf(de);
    const to = this.mapaTons.indexOf(para);

    if (from === -1 || to === -1) return 0;

    let diff = to - from;

    // Se quiser sempre transpor para frente: (mantém como está)
    // return (diff + 12) % 12;

    // Se quiser a menor distância (positiva ou negativa):
    if (diff > 6) diff -= 12; // Ex: C → A (9 → -3)
    if (diff < -6) diff += 12; // Ex: A → C (-9 → 3)

    return diff;
  }

  transporLetra(texto: string, semitons: number): string {
    return texto.replace(/\{([^|]+)\|([A-G][b#]?m?(7|sus|dim|aug)?[^\}\s]*)\}/g, (_match, silaba, acorde) => {
      const novoAcorde = this.transporAcorde(acorde, semitons);
      return `{${silaba}|${novoAcorde}}`;
    });
  }

  transporAcorde(acorde: string, semitons: number): string {
    // Caso especial para acordes sem nota base (ex: "N.C.")
    if (!acorde || !/[A-G]/.test(acorde[0])) return acorde;

    // Mapeamento de enarmonias para normalização
    const enarmonias: { [key: string]: string } = {
      'B#': 'C',
      Cb: 'B',
      'E#': 'F',
      Fb: 'E',
      'B##': 'C#',
      Cbb: 'A',
      'E##': 'F#',
      Fbb: 'D',
    };

    // Expressão regular para capturar todos os componentes do acorde
    const regex = /^([A-G](?:#|b|##|bb)?)(.*)$/;
    const match = acorde.match(regex);

    if (!match) return acorde;

    let [_, notaBase, sufixo] = match;

    // Normaliza enarmonias
    if (enarmonias[notaBase]) {
      notaBase = enarmonias[notaBase];
    }

    // Encontra o índice da nota base no mapa de tons
    const indexOriginal = this.mapaTons.indexOf(notaBase);
    if (indexOriginal === -1) return acorde;

    // Calcula o novo índice com tratamento para valores negativos
    let novoIndex = (indexOriginal + semitons) % 12;
    if (novoIndex < 0) novoIndex += 12;

    // Obtém a nova nota base
    const novaNotaBase = this.mapaTons[novoIndex];

    // Casos especiais para evitar notações como B# ou E#
    let notaFinal = novaNotaBase;
    if (novaNotaBase === 'B#' && !sufixo.includes('dim')) notaFinal = 'C';
    if (novaNotaBase === 'E#' && !sufixo.includes('dim')) notaFinal = 'F';
    if (novaNotaBase === 'Cb' && !sufixo.includes('aug')) notaFinal = 'B';
    if (novaNotaBase === 'Fb' && !sufixo.includes('aug')) notaFinal = 'E';

    // Retorna o acorde transposto
    return notaFinal + sufixo;
  }

  get transposicaoAtual(): string {
    const diff = this.calcularSemitons(this.tomOriginal, this.tomSelecionado);
    return diff === 0 ? '' : diff > 0 ? `(+${diff})` : `(${diff})`;
  }

  resetarTom() {
    this.tomSelecionado = this.tomOriginal;
    this.alterarTom();
  }

  aumentarFonte() {
    this.fontSize = parseFloat((this.fontSize + 0.2).toFixed(2));
    localStorage.setItem('fontSizeLS', this.fontSize.toString());
  }

  diminuirFonte() {
    this.fontSize = parseFloat((this.fontSize - 0.2).toFixed(2));
    localStorage.setItem('fontSizeLS', this.fontSize.toString());
  }

  iniciarScroll() {
    if (this.scrollInterval) return;
    this.isScrolling = true;
    this.scrollInterval = setInterval(() => {
      window.scrollBy({ top: this.scrollStep, behavior: 'smooth' });
    }, this.scrollSpeed);
  }

  pararScroll() {
    this.isScrolling = false;
    clearInterval(this.scrollInterval);
    this.scrollInterval = null;
  }

  aumentarVelocidade() {
    if (this.scrollSpeed > 20) this.scrollSpeed -= 20;
    this.reiniciarScroll();
  }

  diminuirVelocidade() {
    if (this.scrollSpeed < 1200) this.scrollSpeed += 40;
    this.reiniciarScroll();
  }

  reiniciarScroll() {
    if (this.isScrolling) {
      this.pararScroll();
      this.iniciarScroll();
    }
  }

  toggleScroll() {
    this.isScrolling ? this.pararScroll() : this.iniciarScroll();
  }

  toggleMostrarNotas() {
    this.mostrarNotas = !this.mostrarNotas;
  }
}
