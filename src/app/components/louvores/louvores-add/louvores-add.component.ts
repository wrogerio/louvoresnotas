import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { LouvorModel } from '../../../interfaces/models';

@Component({
  selector: 'app-louvores-add',
  imports: [RouterModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './louvores-add.component.html',
  styleUrl: './louvores-add.component.css',
})
export class LouvoresAddComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private router: Router) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cantor: ['', Validators.required],
      inicio: ['', Validators.required],
      grupo: ['', Validators.required],
      tom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      url: [''],
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      const data = this.form.value as LouvorModel;

      data.nome = data.nome.trim();
      data.cantor = data.cantor.trim();
      data.inicio = data.inicio.trim();
      data.tom = data.tom.trim();
      data.url = data.url.trim();
      data.grupo = data.grupo.trim();

      try {
        const response = await this.supabaseService.addLouvor(data);

        if (!response) {
          console.error('Error adding louvor:', response);
          return;
        }

        this.router.navigate(['']);
      } catch (error) {
        console.error('Error adding louvor:', error);
      }
    }
  }

  completar() {
    var novoValor = '';

    if (this.form.value.cantor === 'hc') {
      novoValor = 'Harpa Cristã';
    }

    this.form.patchValue({
      nome: this.form.value.nome.trim(),
      cantor: novoValor,
      inicio: this.form.value.inicio.trim(),
      grupo: this.form.value.grupo.trim(),
      tom: this.form.value.tom.trim(),
      url: this.form.value.url.trim(),
    });
  }
}
