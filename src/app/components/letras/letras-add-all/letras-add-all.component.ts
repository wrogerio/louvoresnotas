import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LetraModel } from '../../../interfaces/models';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-letras-add-all',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './letras-add-all.component.html',
  styleUrl: './letras-add-all.component.css',
})
export class LetrasAddAllComponent {
  louvor_id: string = '';
  form: FormGroup;

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      letra: ['', Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      this.louvor_id = params.get('louvor_id') ?? '';
    });
  }

  LimparLetra() {
    const letra = this.form.get('letra')?.value || '';

    const textoLimpo = letra
      .split(/\n\s*\n/) // separa os parágrafos
      .map((paragrafo: string) =>
        paragrafo
          .replace(/[\r\n]+/g, ' ')
          .replaceAll('  ', ' ')
          .trim()
      ) // remove quebras de linha internas
      .join('\n\n'); // junta os parágrafos novamente com espaçamento entre eles

    this.form.get('letra')?.setValue(textoLimpo);
  }

  async onSubmit() {
    const letra = this.form.get('letra')?.value || '';
    if (!letra.trim()) {
      alert('A letra não pode estar vazia.');
      return;
    }

    const linhas = letra.split('\n');
    let ordem = 1;

    for (const linha of linhas) {
      const texto = linha.trim();
      if (!texto) continue; // Ignora linha vazia

      const isIntro = texto.toLowerCase().includes('introdução');

      const data: LetraModel = {
        ordem: ordem++,
        letra: texto,
        letra_normalizada: texto.toLowerCase(), // ou algum método de normalização
        notas: '',
        is_intro: isIntro,
        louvor_id: this.louvor_id, // você precisa definir esse ID em algum lugar
      };

      try {
        const response = await this.supabaseService.addLetra(data);
        if (response == '') {
          console.error('Erro ao inserir linha:', texto);
          break; // Interrompe o loop se houver erro
        }
      } catch (error) {
        console.error('Erro ao inserir linha:', texto, error);
      }
    }

    this.router.navigate(['/louvores', 'edit', this.louvor_id]);
  }
}
