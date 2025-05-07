import { Component } from '@angular/core';
import { LouvorModel } from '../../../interfaces/models';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-louvores-lista',
  imports: [],
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
}
