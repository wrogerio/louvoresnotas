import { Routes } from '@angular/router';
import { LouvoresListaComponent } from './components/louvores/louvores-lista/louvores-lista.component';
import { LouvoresAddComponent } from './components/louvores/louvores-add/louvores-add.component';
import { LouvoresEditComponent } from './components/louvores/louvores-edit/louvores-edit.component';
import { LetrasEditComponent } from './components/letras/letras-edit/letras-edit.component';
import { LetrasAddComponent } from './components/letras/letras-add/letras-add.component';
import { LetrasCantarComponent } from './components/letras/letras-cantar/letras-cantar.component';

export const routes: Routes = [
  { path: '', component: LouvoresListaComponent },
  { path: 'louvores/add', component: LouvoresAddComponent },
  { path: 'louvores/edit/:id', component: LouvoresEditComponent },
  { path: 'louvores/:louvor_id/letras/edit/:id', component: LetrasEditComponent },
  { path: 'louvores/:louvor_id/letras/add', component: LetrasAddComponent },
  { path: 'louvores/cantar/:id', component: LetrasCantarComponent}, // Assuming you want to show the list of letras for a louvor
  { path: '**', redirectTo: '' } // Redirect to home for any unknown routes
];
