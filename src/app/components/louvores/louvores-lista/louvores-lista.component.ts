import { Component } from '@angular/core';
import { LouvorModel } from '../../../interfaces/models';
import { SupabaseService } from '../../../services/supabase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-louvores-lista',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './louvores-lista.component.html',
  styleUrl: './louvores-lista.component.css',
})
export class LouvoresListaComponent {
  listaLouvores: LouvorModel[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.carregarLouvores();
  }

  async carregarLouvores() {
    try {
      this.listaLouvores = await this.supabaseService.getLouvoresLista();
    } catch (error) {
      console.error('Erro ao carregar louvores:', error);
    }
  }

  async removerLouvor(id: string) {
    const confirmado = confirm('Tem certeza que deseja remover este louvor?');

    if (confirmado) {
      try {
        const { error } = await this.supabaseService.removerLouvor(id);

        if (error) {
          console.error('Erro ao remover louvor:', error);
          alert('Erro ao remover louvor.');
        } else {
          this.listaLouvores = this.listaLouvores.filter((x) => x.id !== id);
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
      }
    }
  }
}
