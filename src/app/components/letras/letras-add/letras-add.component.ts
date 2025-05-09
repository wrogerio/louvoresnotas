import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { LetraModel, LouvorModel } from '../../../interfaces/models';

@Component({
  selector: 'app-letras-add',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './letras-add.component.html',
  styleUrl: './letras-add.component.css',
})
export class LetrasAddComponent {
  louvor_id: string = '';
  form: FormGroup;
  qtdLetras: number = 0;

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      ordem: [0, Validators.required],
      letra: ['', Validators.required],
      notas: ['', Validators.required],
      is_intro: [false],
      louvor_id: [''],
    });

    this.route.paramMap.subscribe((params) => {
      this.louvor_id = params.get('louvor_id') ?? '';
    });

    this.supabaseService.getQtdLetrasByLouvorId(this.louvor_id).then((qtd) => {
      this.qtdLetras = qtd;
      this.form.patchValue({ ordem: this.qtdLetras + 1 });
    });
  }

  async onSubmit() {
    const data = this.form.value as LetraModel;
    data.louvor_id = this.louvor_id;

    data.letra = data.letra.trim();
    data.notas = data.notas.trim();

    try {
      const response = await this.supabaseService.addLetra(data);

      if (!response) {
        console.error('Error adding letra:', response);
        return;
      }

      this.router.navigate(['/louvores/edit', this.louvor_id]);
    } catch (error) {
      console.error('Error adding letra:', error);
    }
  }
}
