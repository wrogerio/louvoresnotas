import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  exibir: boolean = true;

  constructor() {
    // get exbirLS from localStorage
    const exibirLS = localStorage.getItem('exibir');
    if (exibirLS) {
      this.exibir = exibirLS === 's';
    } else {
      this.exibir = true; // default value
      localStorage.setItem('exibir', 's');
    }
  }
}
