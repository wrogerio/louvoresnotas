import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { LetraModel, LouvorModel } from '../../../interfaces/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-letras-edit',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './letras-edit.component.html',
  styleUrl: './letras-edit.component.css',
})
export class LetrasEditComponent {
  id: string = '';
  louvor_id: string = '';
  form: FormGroup;
  ligar_atalhos: boolean = true;
  ligar_teclado_inteligente: boolean = false;
  mostrar_controles: boolean = true;
  notasCampoHarmonico: string = '';
  jaBusqueiCampoHarmonico: boolean = false;
  campoHarmonico = [
    { Tom: 'C', Acordes: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'] },
    { Tom: 'Db', Acordes: ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cdim'] },
    { Tom: 'D', Acordes: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'] },
    { Tom: 'Eb', Acordes: ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Ddim'] },
    { Tom: 'E', Acordes: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'] },
    { Tom: 'F', Acordes: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'] },
    { Tom: 'Gb', Acordes: ['Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm', 'Fdim'] },
    { Tom: 'G', Acordes: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'] },
    { Tom: 'Ab', Acordes: ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gdim'] },
    { Tom: 'A', Acordes: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'] },
    { Tom: 'Bb', Acordes: ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'] },
    { Tom: 'B', Acordes: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'] },
  ];
  tomAtual: string = ''; // Tom padrão, pode ser alterado conforme necessário

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      ordem: [0, Validators.required],
      letra: ['', Validators.required],
      notas: [''],
      is_intro: [false],
      id: [''],
      louvor_id: [''],
    });

    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? '';
      this.louvor_id = params.get('louvor_id') ?? '';

      if (this.id) {
        this.carregaLetra();
      }
    });
  }
  async onSubmit() {
    if (this.form.valid) {
      const data = this.form.value as LetraModel;
      data.id = this.id;
      data.louvor_id = this.louvor_id;
      data.ordem = data.ordem;

      data.letra = data.letra.trim().replace(/\n/g, ' ').replaceAll('  ', ' ');
      data.notas = data.notas.trim();

      try {
        const response = await this.supabaseService.updateLetraById(data);

        if (!response) {
          console.error('Error updating letra:', response);
          return;
        }

        this.carregaLetra();
      } catch (error) {
        console.error('Error updating letra:', error);
      }
    }
  }

  async carregaLetra() {
    if (this.id) {
      const response = await this.supabaseService.getLetraById(this.id);
      if (response) {
        this.form.patchValue({
          louvor_id: this.louvor_id,
          id: this.id,
          ordem: response.ordem,
          letra: response.letra,
          notas: response.notas,
          is_intro: response.is_intro,
        });

        const responseTomDoLouvor = await this.supabaseService.getTomDoLouvor(this.louvor_id);
        if (responseTomDoLouvor) {
          debugger;
          this.tomAtual = responseTomDoLouvor || 'ZERO';
          // agora que ja sabe o tom, salvar as notas do campo harmonico no local
          if (!this.jaBusqueiCampoHarmonico) {
            this.notasCampoHarmonico = this.campoHarmonico.find((c) => c.Tom.toLowerCase() === this.tomAtual.toLowerCase())?.Acordes.join(', ') || '';
          }
          this.jaBusqueiCampoHarmonico = true;
        } else {
          console.error('Error loading tom do louvor:', responseTomDoLouvor);
        }
      } else {
        console.error('Error loading letra:', response);
      }
    }
  }

  toogleLigarAtalhos() {
    this.ligar_atalhos = !this.ligar_atalhos;
  }

  toggleMostrarControles() {
    this.mostrar_controles = !this.mostrar_controles;
  }

  onKeyDown(event: KeyboardEvent, textarea: HTMLTextAreaElement): void {
    let pararPosicionamento = false;
    if (!this.ligar_atalhos) {
      return;
    }

    const cursorPos = textarea.selectionStart;
    const content = textarea.value;

    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/' || event.key === '4' || event.key === '6') {
      event.preventDefault();

      let insercao = '';
      let novaPosicaoCursor = cursorPos;
      let ignorarProximoChar = 0;

      if (event.key === '+') {
        const nota = prompt('Digite a nota musical:');
        if (nota !== null && nota.trim() !== '') {
          const novaNota = this.getNotaCampoHarmonico(this.tomAtual, nota.trim()) || nota.trim();
          const currentChar = content.charAt(cursorPos) || '';
          insercao = `{${currentChar}|${novaNota.trim()}}`;
          novaPosicaoCursor = cursorPos + insercao.length;
          ignorarProximoChar = currentChar ? 1 : 0;
        } else {
          return;
        }
      } else if (event.key === '-') {
        const nota = prompt('Digite a nota musical:');
        if (nota !== null && nota.trim() !== '') {
          const novaNota = this.getNotaCampoHarmonico(this.tomAtual, nota.trim()) || nota.trim();
          insercao = ` ....{.|${novaNota.trim()}}.... `;
          const posRelativaFechamento = insercao.indexOf('}') + 5;
          novaPosicaoCursor = cursorPos + posRelativaFechamento;
        } else {
          return;
        }
      } else if (event.key === '*') {
        const repeticoes = prompt('Quantas vezes vai repetir?');
        if (repeticoes === null || repeticoes.trim() === '') {
          return;
        }
        insercao = ` qq <span class='fw-bold text-danger'>Repetir (${repeticoes}X)</span>`;
        novaPosicaoCursor = cursorPos + insercao.length + 15;
      } else if (event.key === '/') {
        const nota = prompt('Digite a nota musical:');
        if (nota !== null && nota.trim() !== '') {
          const novaNota = this.getNotaCampoHarmonico(this.tomAtual, nota.trim()) || nota.trim();
          insercao = ` | ....{.|${novaNota.trim()}}.... `;
          const posRelativaFechamento = insercao.indexOf('}') + 6;
          novaPosicaoCursor = cursorPos + posRelativaFechamento;
        } else {
          return;
        }
      } else if (event.key === '6') {
        this.goToNext();
        textarea.focus();
        event.preventDefault();
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = 0;
          textarea.focus();
          pararPosicionamento = true;
        }, 400);
        return;
      } else if (event.key === '4') {
        this.goToPrev();
        event.preventDefault();
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = 0;
          textarea.focus();
          pararPosicionamento = true;
        }, 400);
        return;
      }

      const novoTexto = content.substring(0, cursorPos) + insercao + content.substring(cursorPos + ignorarProximoChar);
      textarea.value = novoTexto;

      // Atualiza formControl se necessário
      const formControlName = textarea.getAttribute('formControlName');
      if (formControlName && this.form.get(formControlName)) {
        this.form.get(formControlName)?.setValue(novoTexto);
      }

      // Reposiciona o cursor após a inserção
      this.onSubmit();

      if (pararPosicionamento) return;
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = novaPosicaoCursor;
        textarea.focus();
      }, 400);
    }
  }

  onKeyUp(event: KeyboardEvent, textarea: HTMLTextAreaElement) {
    if (!this.ligar_teclado_inteligente) return;

    if (!event.key || event.key.length !== 1) return;

    if (!event.key.match(/[a-g4-6]/)) return;

    if (event.key.toLowerCase() === 't') return;

    const key = event.key;

    if (key.length === 1 && key.match(/[a-zA-Z]/)) {
      const cursorPos = textarea.selectionStart;
      const content = textarea.value;

      // A letra digitada está antes do cursor (cursor já avançou no keyup)
      // Então a letra digitada está na posição cursorPos - 1
      const posLetraDigitada = cursorPos - 1;

      // Letra que estava no cursor antes da letra digitada (que agora está depois da posição cursor)
      const letraDepois = content.charAt(cursorPos);

      const notaMusical = this.getNotaCampoHarmonico(this.tomAtual, key) || key;

      // Texto antes da letra digitada
      const antes = content.substring(0, posLetraDigitada);
      // Texto depois da letra depois (pulando letraDepois)
      const depois = content.substring(cursorPos + 1);

      // Construir o novo texto sem a letra digitada e sem a letraDepois fora da inserção
      const novoTexto = antes + `{${letraDepois}|${notaMusical}}` + depois;

      textarea.value = novoTexto;

      const formControlName = textarea.getAttribute('formControlName');
      if (formControlName && this.form.get(formControlName)) {
        this.form.get(formControlName)?.setValue(novoTexto);
      }

      // Posiciona cursor logo após a inserção
      const novaPosicaoCursor = antes.length + `{${letraDepois}|${notaMusical}}`.length;
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = novaPosicaoCursor;
        textarea.focus();
      }, 0);

      this.onSubmit();
    }
  }

  getNotaCampoHarmonico(tom: string, entrada: string): string | null {
    // const campo = this.campoHarmonico.find((c) => c.Tom.toLowerCase() === tom.toLowerCase());
    // if (!campo) return null;
    // const entradaUpper = entrada.toUpperCase();
    // const nota = campo.Acordes.find((acorde) => acorde.toUpperCase().startsWith(entradaUpper));
    // return nota || null;

    // buscar as notas do campo harmonico
    // Transforma o conteúdo do input em um array, removendo espaços
    const notas = this.notasCampoHarmonico
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n); // Remove strings vazias

    // Busca a primeira nota que começa com a entrada
    const notaEncontrada = notas.find((nota) => nota.toLowerCase().startsWith(entrada.toLowerCase())) || '';
    return notaEncontrada;
  }

  toggleLigarTecladoInteligente() {
    this.ligar_teclado_inteligente = !this.ligar_teclado_inteligente;
  }

  async goToPrev() {
    const ordemAtual = this.form.value.ordem;
    const ordemAnterior = ordemAtual - 1;
    const letraAnterior = await this.supabaseService.getLetraByLouvorIdAndOrdem(this.louvor_id, ordemAnterior);

    if (letraAnterior) {
      this.ligar_teclado_inteligente = false;
      this.router.navigate(['/louvores', this.louvor_id, 'letras', 'edit', letraAnterior.id]);
    } else {
      console.log('Não há letra anterior.');
    }
  }

  async goToNext() {
    const ordemAtual = this.form.value.ordem;
    const proximaOrdem = ordemAtual + 1;

    const proximaLetra = await this.supabaseService.getLetraByLouvorIdAndOrdem(this.louvor_id, proximaOrdem);
    if (proximaLetra) {
      this.ligar_teclado_inteligente = false;
      this.router.navigate(['/louvores', this.louvor_id, 'letras', 'edit', proximaLetra.id]);
    } else {
      console.log('Não há próxima letra.');
    }
  }
}
