import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Para usar Reactive Forms
import { AppComponent } from './app.component';
import { LouvoresAddComponent } from './components/louvores/louvores-add/louvores-add.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule, // Para Reactive Forms
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule {}
