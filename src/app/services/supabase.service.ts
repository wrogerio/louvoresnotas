import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LouvorModel } from '../interfaces/models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;

  constructor() {}

  async getLouvoresLista(): Promise<LouvorModel[]> {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/TbLouvores?select=*&order=cantor.asc,nome.asc`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.supabaseKey,
          Authorization: `Bearer ${this.supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json(); // já será um array de LouvorModel
  }
}
