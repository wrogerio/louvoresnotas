import { Component } from '@angular/core';
import { LouvorModel } from '../../../interfaces/models';
import { SupabaseService } from '../../../services/supabase.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-louvores-lista',
  imports: [RouterModule, FormsModule],
  standalone: true,
  templateUrl: './louvores-lista.component.html',
  styleUrl: './louvores-lista.component.css',
})
export class LouvoresListaComponent {
  listaLouvores: LouvorModel[] = [];
  listaLouvoresFiltrada: LouvorModel[] = [];
  isEditing: boolean = false;
  contador: number = 0;
  limite: number = 0;
  filtro_search: string = '';
  qtdLouvores: number = 0;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.inicializarContadorLocalStorage();
    this.carregarLouvores();
  }

  inicializarContadorLocalStorage() {
    const limiteLS = localStorage.getItem('limiteLouvores');

    if (limiteLS === null) {
      localStorage.setItem('limiteLouvores', '45');
      this.limite = 15;
    } else {
      this.limite = parseInt(limiteLS, 10);
    }

    // Sempre reinicia o contador ao carregar a página
    this.contador = 0;
    localStorage.setItem('contadorLouvores', '0');
    this.isEditing = false;
  }

  removerAcentos(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  async filtrar() {
    const frase = this.filtro_search.trim();

    if (!frase) {
      // sem filtro: exibe tudo
      this.listaLouvoresFiltrada = [...this.listaLouvores];
      this.qtdLouvores = this.listaLouvoresFiltrada.length;
      return;
    }

    if (frase.length < 3) {
      // se a frase tem menos de 3 caracteres, não faz nada
      this.listaLouvoresFiltrada = [...this.listaLouvores];
      this.qtdLouvores = this.listaLouvoresFiltrada.length;
      return;
    }

    try {
      // chama o método que busca no Supabase pelas letras
      this.listaLouvoresFiltrada = await this.supabaseService.searchLouvoresByLyricSubstring(frase);

      this.qtdLouvores = this.listaLouvoresFiltrada.length;
    } catch (error) {
      console.error('Erro na busca por letra:', error);
      // opcional: fallback pra busca local por campos do louvor
      this.listaLouvoresFiltrada = this.listaLouvores.filter((louvor) => {
        const texto = [louvor.nome, louvor.cantor, louvor.tom, louvor.inicio, louvor.url].join(' ').toLowerCase();
        return this.removerAcentos(texto).includes(this.removerAcentos(frase.toLowerCase()));
      });
      this.qtdLouvores = this.listaLouvoresFiltrada.length;
    }
  }

  incrementa() {
    this.contador++;
    localStorage.setItem('contadorLouvores', this.contador.toString());

    if (this.contador >= this.limite) {
      this.isEditing = true;
    }
  }

  async carregarLouvores() {
    try {
      this.listaLouvores = await this.supabaseService.getLouvoresLista();
      this.listaLouvoresFiltrada = [...this.listaLouvores];
      this.qtdLouvores = this.listaLouvoresFiltrada.length;
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
