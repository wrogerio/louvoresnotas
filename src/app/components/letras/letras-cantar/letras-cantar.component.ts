import { Component, Renderer2, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { LetraModel } from '../../../interfaces/models';
import { IsIntroPipe } from '../../../pipes/is-intro.pipe';
import { CommonModule } from '@angular/common';
import { FormataNotasPipe } from '../../../pipes/formata-notas.pipe';
import { FormataNotasPipe2 } from '../../../pipes/formata-notas2.pipe';

@Component({
  selector: 'app-letras-cantar',
  imports: [IsIntroPipe, CommonModule, FormataNotasPipe, FormataNotasPipe2],
  templateUrl: './letras-cantar.component.html',
  styleUrls: ['./letras-cantar.component.css'],
})
export class LetrasCantarComponent {
  id: string = '';
  Letras: LetraModel[] = [];
  Apresentacao: string[] = [];
  fontSize: number = 1;

  constructor(private supabaseService: SupabaseService, private route: ActivatedRoute, private router: Router, private renderer: Renderer2, private cdr: ChangeDetectorRef) {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? '';

      if (this.id) {
        this.carregaLetra();
        console.log('ID recebido:', this.id);
      }
    });

    // Inicializa fontSize do localStorage
    const savedFontSize = localStorage.getItem('fontSizeLS');
    if (savedFontSize) {
      this.fontSize = parseFloat(savedFontSize);
    } else {
      localStorage.setItem('fontSizeLS', '1.4');
      this.fontSize = 1.4;
    }
  }

  // Função para aumentar o tamanho da fonte
  aumentarFonte() {
    this.fontSize = parseFloat((this.fontSize + 0.2).toFixed(2));
    localStorage.setItem('fontSizeLS', this.fontSize.toString());
  }

  // Função para diminuir o tamanho da fonte
  diminuirFonte() {
    this.fontSize = parseFloat((this.fontSize - 0.2).toFixed(2));
    localStorage.setItem('fontSizeLS', this.fontSize.toString());
  }

  // Função para carregar as letras do banco
  async carregaLetra() {
    if (this.id) {
      const response = await this.supabaseService.getLetrasByLouvorId(this.id);
      if (response) {
        this.Letras = response as LetraModel[];
        this.cdr.detectChanges();
      } else {
        console.error('Error loading letra:', response);
      }
    }
  }
}
