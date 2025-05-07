import { Routes } from '@angular/router';
import { LouvoresListaComponent } from './components/louvores/louvores-lista/louvores-lista.component';
import { LouvoresAddComponent } from './components/louvores/louvores-add/louvores-add.component';
import { LouvoresEditComponent } from './components/louvores/louvores-edit/louvores-edit.component';
import { LetrasListaComponent } from './components/letras/letras-lista/letras-lista.component';

export const routes: Routes = [
  { path: '', component: LouvoresListaComponent },
  { path: 'louvores/add', component: LouvoresAddComponent },
  { path: 'louvores/edit/:id', component: LouvoresEditComponent },
  { path: 'letras/louvor/:id', component: LetrasListaComponent },
];
