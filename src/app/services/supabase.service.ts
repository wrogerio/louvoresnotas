import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LetraModel, LouvorModel } from '../interfaces/models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;

  constructor() {}

  async getLouvoresLista(): Promise<LouvorModel[]> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLouvores?select=*&order=cantor.asc,nome.asc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json(); // já será um array de LouvorModel
  }

  async getLouvorById(id: string): Promise<LouvorModel> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLouvores?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data[0]; // já será um LouvorModel
  }

  async addLouvor(louvor: LouvorModel): Promise<boolean> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLouvores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
      body: JSON.stringify(louvor),
    });

    if (!response.ok) {
      return false;
    }

    return true; // já será um LouvorModel
  }

  async removerLouvor(id: string): Promise<any> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLouvores?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    return true; // já será um LouvorModel
  }

  async updateLouvor(louvor: LouvorModel): Promise<boolean> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLouvores?id=eq.${louvor.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
      body: JSON.stringify(louvor),
    });

    if (!response.ok) {
      return false;
    }

    return true; // já será um LouvorModel
  }

  async getLetrasByLouvorId(louvorId: string): Promise<LetraModel[]> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras?louvor_id=eq.${louvorId}&order=ordem.asc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar letras');
    }

    const data = await response.json();
    return data as LetraModel[];
  }

  async getLetraById(id: string): Promise<LetraModel> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar letra');
    }

    const data = await response.json();
    return data[0] as LetraModel;
  }

  async addLetra(letra: LetraModel): Promise<boolean> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
      body: JSON.stringify(letra),
    });

    if (!response.ok) {
      return false;
    }

    return true; // já será um LouvorModel
  }

  async updateLetra(letra: LetraModel): Promise<boolean> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras?id=eq.${letra.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
      body: JSON.stringify(letra),
    });

    if (!response.ok) {
      return false;
    }

    return true; // já será um LouvorModel
  }

  async removerLetra(id: string): Promise<any> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    return true; // já será um LouvorModel
  }
}
