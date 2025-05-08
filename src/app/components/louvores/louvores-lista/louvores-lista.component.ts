import { Component } from '@angular/core';
import { LouvorModel } from '../../../interfaces/models';
import { SupabaseService } from '../../../services/supabase.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-louvores-lista',
  imports: [RouterModule, FormsModule ],
  standalone: true,
  templateUrl: './louvores-lista.component.html',
  styleUrl: './louvores-lista.component.css',
})
export class LouvoresListaComponent {
  listaLouvores: LouvorModel[] = [];
  listaLouvoresFiltrada: LouvorModel[] = [];
  isEditing: boolean = false;
  contador: number = 0;
  filtro_search: string = '';

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.carregarLouvores();
  }

  filtrar() {
    const filtro = this.filtro_search.trim().toLowerCase();
    if (!filtro) {
      this.listaLouvoresFiltrada = [...this.listaLouvores];
      return;
    }

    this.listaLouvoresFiltrada = this.listaLouvores.filter(louvor =>
      louvor.nome.toLowerCase().includes(filtro) ||
      louvor.cantor.toLowerCase().includes(filtro) ||
      louvor.tom.toLowerCase().includes(filtro) ||
      louvor.inicio.toLowerCase().includes(filtro)
    );
  }

  incrementa() {
    this.contador++;

    if(this.contador >= 15){
      this.isEditing = true;
    }
  }

  async carregarLouvores() {
    try {
      this.listaLouvores = await this.supabaseService.getLouvoresLista();
      this.listaLouvoresFiltrada = [...this.listaLouvores];
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
