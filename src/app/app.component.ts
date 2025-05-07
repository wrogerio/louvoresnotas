import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LouvoresListaComponent } from './components/louvores/louvores-lista/louvores-lista.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LouvoresListaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Louvores Notas';
}
