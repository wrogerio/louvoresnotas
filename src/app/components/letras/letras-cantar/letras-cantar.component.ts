import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { LetraModel } from '../../../interfaces/models';
import { IsIntroPipe } from '../../../pipes/is-intro.pipe';
import { FormataNotasPipe } from '../../../pipes/formata-notas.pipe';

@Component({
  selector: 'app-letras-cantar',
  imports: [IsIntroPipe, FormataNotasPipe],
  templateUrl: './letras-cantar.component.html',
  styleUrl: './letras-cantar.component.css',
})
export class LetrasCantarComponent {
  id: string = '';
  Letras: LetraModel[] = [];
  mostrarNotas: boolean = true;

  constructor(private supabaseService: SupabaseService, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? '';

      if (this.id) {
        this.carregaLetra();
        console.log('ID recebido:', this.id);
      }
    });
  }

  alteraMostrarNotas() {
    this.mostrarNotas = !this.mostrarNotas;
  }

  async carregaLetra() {
    if (this.id) {
      const response = await this.supabaseService.getLetrasByLouvorId(this.id);
      if (response) {
        this.Letras = response as LetraModel[];
        console.log('Letras carregadas:', this.Letras);
      } else {
        console.error('Error loading letra:', response);
      }
    }
  }
}
