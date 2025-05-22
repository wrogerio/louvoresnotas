import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { LetraModel, LouvorModel } from '../../../interfaces/models';

@Component({
  selector: 'app-letras-edit',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './letras-edit.component.html',
  styleUrl: './letras-edit.component.css',
})
export class LetrasEditComponent {
  id: string = '';
  louvor_id: string = '';
  form: FormGroup;
  ligar_atalhos: boolean = true;
  mostrar_controles: boolean = true;

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

      data.letra = data.letra.trim().replace(/\n/g, ' ').replaceAll('  ', ' ');
      data.notas = data.notas.trim();

      try {
        const response = await this.supabaseService.updateLetra(data);

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
      } else {
        console.error('Error loading letra:', response);
      }
    }
  }

  toogleLigarAtalhos() {
    this.ligar_atalhos = !this.ligar_atalhos;
  }

  toggoleMostrarControles() {
    debugger;
    this.mostrar_controles = !this.mostrar_controles;
  }

  onKeyDown(event: KeyboardEvent, textarea: HTMLTextAreaElement): void {
    if (!this.ligar_atalhos) {
      return;
    }

    const cursorPos = textarea.selectionStart;
    const content = textarea.value;

    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
      event.preventDefault();

      let insercao = '';
      let novaPosicaoCursor = cursorPos;
      let ignorarProximoChar = 0;

      if (event.key === '+') {
        const nota = prompt('Digite a nota musical:');
        if (nota !== null && nota.trim() !== '') {
          const currentChar = content.charAt(cursorPos) || '';
          insercao = `{${currentChar}|${nota.trim()}}`;
          novaPosicaoCursor = cursorPos + insercao.length;
          ignorarProximoChar = currentChar ? 1 : 0;
        } else {
          return;
        }
      } else if (event.key === '-') {
        const nota = prompt('Digite a nota musical:');
        if (nota !== null && nota.trim() !== '') {
          insercao = ` ...{.|${nota.trim()}}... `;
          const posRelativaFechamento = insercao.indexOf('}') + 2;
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
          insercao = ` | ...{.|${nota.trim()}}... `;
          const posRelativaFechamento = insercao.indexOf('}') + 6;
          novaPosicaoCursor = cursorPos + posRelativaFechamento;
        } else {
          return;
        }
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

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = novaPosicaoCursor;
        textarea.focus();
      }, 400);
    }
  }
}
