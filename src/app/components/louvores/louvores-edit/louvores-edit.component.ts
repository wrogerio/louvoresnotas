import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { LetraModel, LouvorModel } from '../../../interfaces/models';
import { IsIntroPipe } from '../../../pipes/is-intro.pipe';
import { FormataNotasPipe } from '../../../pipes/formata-notas.pipe';

@Component({
  selector: 'app-louvores-edit',
  imports: [RouterModule, ReactiveFormsModule, IsIntroPipe, FormataNotasPipe],
  standalone: true,
  templateUrl: './louvores-edit.component.html',
  styleUrl: './louvores-edit.component.css',
})
export class LouvoresEditComponent {
  id: string = '';
  form: FormGroup;
  letras: LetraModel[] = [];

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cantor: ['', Validators.required],
      inicio: ['', Validators.required],
      tom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      formula: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? '';
      if (this.id) {
        this.carregaLouvor();
        this.carregaLetras();
        console.log('ID recebido:', this.id);
      }
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      const data = this.form.value as LouvorModel;
      data.id = this.id; // Adiciona o ID ao objeto de dados

      data.nome = data.nome.trim();
      data.cantor = data.cantor.trim();
      data.inicio = data.inicio.trim();
      data.tom = data.tom.trim();
      data.formula = data.formula.trim();

      try {
        const response = await this.supabaseService.updateLouvor(data);

        if (!response) {
          console.error('Error updating louvor:', response);
          return;
        }

        this.router.navigate(['']);
      } catch (error) {
        console.error('Error updating louvor:', error);
      }
    }
  }

  async carregaLouvor() {
    try {
      const louvor = await this.supabaseService.getLouvorById(this.id);
      if (louvor) {
        console.log('Louvor encontrado:', louvor);
        this.form.patchValue({
          nome: louvor.nome,
          cantor: louvor.cantor,
          inicio: louvor.inicio,
          tom: louvor.tom,
          formula: louvor.formula,
        });
      } else {
        console.error('Louvor not found');
      }
    } catch (error) {
      console.error('Error fetching louvor:', error);
    }
  }

  async carregaLetras() {
    try {
      const letras = await this.supabaseService.getLetrasByLouvorId(this.id);
      if (letras) {
        console.log('Letras encontradas:', letras);
        this.letras = letras;
      } else {
        console.error('Letras not found');
      }
    } catch (error) {
      console.error('Error fetching letras:', error);
    }
  }
}
