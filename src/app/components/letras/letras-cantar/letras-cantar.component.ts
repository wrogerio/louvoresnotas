import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { LetraModel } from '../../../interfaces/models';
import { IsIntroPipe } from '../../../pipes/is-intro.pipe';
import { FormataNotasPipe } from '../../../pipes/formata-notas.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-letras-cantar',
  imports: [IsIntroPipe, FormataNotasPipe, CommonModule],
  templateUrl: './letras-cantar.component.html',
  styleUrl: './letras-cantar.component.css',
})
export class LetrasCantarComponent {
  id: string = '';
  Letras: LetraModel[] = [];
  mostrarNotas: boolean = true;
  fontSize: number = 1;

  constructor(private supabaseService: SupabaseService, private route: ActivatedRoute, private router: Router) {
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
      localStorage.setItem('fontSizeLS', '1');
    }
  }

  alteraMostrarNotas() {
    this.mostrarNotas = !this.mostrarNotas;
  }

  aumentarFonte() {
    this.fontSize = parseFloat((this.fontSize + 0.15).toFixed(2));
    localStorage.setItem('fontSizeLS', this.fontSize.toString());
  }

  diminuirFonte() {
    this.fontSize = parseFloat((this.fontSize - 0.15).toFixed(2));
    localStorage.setItem('fontSizeLS', this.fontSize.toString());
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
