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

  filtrar() {
    // normaliza o filtro (minusculo + sem acentos)
    const filtro = this.removerAcentos(this.filtro_search.trim().toLowerCase());
    if (!filtro) {
      this.listaLouvoresFiltrada = [...this.listaLouvores];
      this.qtdLouvores = this.listaLouvores.length;
      return;
    }

    this.listaLouvoresFiltrada = this.listaLouvores.filter((louvor) => {
      // concatena todos os campos que quer buscar
      const texto = [louvor.nome, louvor.cantor, louvor.tom, louvor.inicio, louvor.url].join(' ').toLowerCase();
      // remove acentos
      const textoSemAcento = this.removerAcentos(texto);
      return textoSemAcento.includes(filtro);
    });

    this.qtdLouvores = this.listaLouvoresFiltrada.length;
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
