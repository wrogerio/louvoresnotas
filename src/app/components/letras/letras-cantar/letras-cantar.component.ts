import { Component, Renderer2, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
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
  imports: [CommonModule, FormsModule, FormataNotasPipe, FormataIntroducoes, QuebralinhaPipe],
  templateUrl: './letras-cantar.component.html',
  styleUrls: ['./letras-cantar.component.css'],
})
export class LetrasCantarComponent implements OnDestroy {
  tons: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  mapaTons: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  tomOriginal: string = '';
  tomSelecionado: string = '';
  tomDoLouvor: string = '';
  ranking: number = 0;
  conferido: boolean = false;
  mostrarNotas: boolean = true;
  id: string = '';
  Letras: LetraModel[] = [];
  LetrasOriginal: LetraModel[] = [];
  Apresentacao: string[] = [];
  fontSize: number = 1;
  nomeDoLouvor: string = '';
  nomeDoCantor: string = '';

  // --- Propriedades de Scroll ---
  scrollStep: number = 1;
  scrollIntervalTime: number = 70;
  scrollInterval: any = null; // ID do intervalo de scroll. Inicializado como null.
  isScrolling: boolean = false; // Indica se o scroll está ativo

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
    this.fontSize = savedFontSize ? parseFloat(savedFontSize) : 1.5;
    localStorage.setItem('fontSizeLS', this.fontSize.toString());
  }

  ngOnDestroy(): void {
    // Garante que o scroll para quando o componente é destruído
    this.stopScroll();
  }

  async carregaLetra() {
    if (this.id) {
      const response = await this.supabaseService.getLetrasByLouvorId(this.id);
      if (response) {
        this.LetrasOriginal = JSON.parse(JSON.stringify(response));
        this.Letras = JSON.parse(JSON.stringify(response));
        this.cdr.detectChanges();

        const responseLouvor = await this.supabaseService.getLouvorById(this.id);
        if (responseLouvor) {
          this.nomeDoLouvor = responseLouvor.nome;
          this.nomeDoCantor = responseLouvor.cantor;
          this.tomOriginal = responseLouvor.tom;
          this.tomSelecionado = responseLouvor.tom;
          this.tomDoLouvor = responseLouvor.tom;
          this.tomSelecionado = this.tomOriginal;
          this.conferido = responseLouvor.conferido;
          this.ranking = responseLouvor.ranking;

          await this.supabaseService.aumentarRanking(this.id, this.ranking, this.conferido);
          this.ranking += 1;
        }
      } else {
        console.error('Erro ao carregar letra:', response);
      }
    }
  }

  alterarTom() {
    const diff = this.calcularSemitons(this.tomOriginal, this.tomSelecionado);

    this.Letras = this.LetrasOriginal.map((item) => ({
      ...item,
      letra: this.transporLetra(item.letra, diff),
    }));

    this.tomDoLouvor = this.tomSelecionado;
  }

  handleScreenClick(event: MouseEvent) {
    this.toggleScroll();
  }

  calcularSemitons(de: string, para: string): number {
    const from = this.mapaTons.indexOf(de);
    const to = this.mapaTons.indexOf(para);

    if (from === -1 || to === -1) return 0;

    let diff = to - from;

    if (diff > 6) diff -= 12;
    if (diff < -6) diff += 12;

    return diff;
  }

  transporLetra(texto: string, semitons: number): string {
    return texto.replace(/\{([^|]+)\|([A-G][b#]?m?(7|sus|dim|aug)?[^\}\s]*)\}/g, (_match, silaba, acorde) => {
      const novoAcorde = this.transporAcorde(acorde, semitons);
      return `{${silaba}|${novoAcorde}}`;
    });
  }

  conferir() {
    if (this.id) {
      this.supabaseService
        .conferirLouvor(this.id, !this.conferido)
        .then(() => {
          this.conferido = !this.conferido;
        })
        .catch((error) => {
          console.error('Erro ao conferir louvor:', error);
        });
    }
  }

  transporAcorde(acorde: string, semitons: number): string {
    if (!acorde || !/[A-G]/.test(acorde[0])) return acorde;

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

    const regex = /^([A-G](?:#|b|##|bb)?)(.*)$/;
    const match = acorde.match(regex);

    if (!match) return acorde;

    let [_, notaBase, sufixo] = match;

    if (enarmonias[notaBase]) {
      notaBase = enarmonias[notaBase];
    }

    const indexOriginal = this.mapaTons.indexOf(notaBase);
    if (indexOriginal === -1) return acorde;

    let novoIndex = (indexOriginal + semitons) % 12;
    if (novoIndex < 0) novoIndex += 12;

    const novaNotaBase = this.mapaTons[novoIndex];

    let notaFinal = novaNotaBase;
    if (novaNotaBase === 'B#' && !sufixo.includes('dim')) notaFinal = 'C';
    if (novaNotaBase === 'E#' && !sufixo.includes('dim')) notaFinal = 'F';
    if (novaNotaBase === 'Cb' && !sufixo.includes('aug')) notaFinal = 'B';
    if (novaNotaBase === 'Fb' && !sufixo.includes('aug')) notaFinal = 'E';

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

  toggleMostrarNotas() {
    this.mostrarNotas = !this.mostrarNotas;
  }

  // --- Métodos de Scroll Atualizados ---
  startScroll() {
    if (this.isScrolling) {
      return; // Já está rolando, não faz nada
    }

    this.isScrolling = true;
    // Sempre limpa o intervalo anterior antes de iniciar um novo, por segurança
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }

    this.scrollInterval = setInterval(() => {
      window.scrollBy(0, this.scrollStep);
    }, this.scrollIntervalTime);
  }

  stopScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null; // Zera a referência APÓS limpar
    } else {
    }
    this.isScrolling = false;
  }

  toggleScroll() {
    if (this.isScrolling) {
      this.stopScroll();
    } else {
      this.startScroll();
    }
  }

  aumentarVelocidade() {
    if (this.scrollIntervalTime > 15) {
      this.scrollIntervalTime -= 15; // Aumenta a velocidade diminuindo o intervalo
      if (this.isScrolling) {
        this.stopScroll(); // Para o scroll atual
        this.startScroll(); // Reinicia com a nova velocidade
      }
    } else {
      console.log('Velocidade já está no máximo.');
    }
  }

  diminuirVelocidade() {
    this.scrollIntervalTime += 15; // Diminui a velocidade aumentando o intervalo
    if (this.isScrolling) {
      this.stopScroll(); // Para o scroll atual
      this.startScroll(); // Reinicia com a nova velocidade
    }
  }
}
