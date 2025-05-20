import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LetraModel, LouvorModel } from '../interfaces/models';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  async getLouvoresLista(): Promise<LouvorModel[]> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLouvores?select=*&order=created.desc&limit=30`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
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
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
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
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
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
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
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

  async addLetra(letra: LetraModel): Promise<string> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(letra),
    });

    if (!response.ok) {
      return '';
    }

    const data = await response.json();

    return data[0]?.id ?? '';
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

  async getQtdLetrasByLouvorId(louvorId: string): Promise<number> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras?louvor_id=eq.${louvorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar letras');
    }

    const data = await response.json();
    return data.length;
  }

  onLetraChanged(louvorId: string, callback: () => void) {
    return this.supabaseClient
      .channel('realtime-letras')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'TbLetras',
          filter: `louvor_id=eq.${louvorId}`,
        },
        () => {
          callback();
        }
      )
      .subscribe();
  }

  async ReordenarLetras(idLouvor: string): Promise<boolean> {
    try {
      // 1. Buscar todas as letras com o id do louvor, ordenadas pelo campo Ordem
      const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras?louvor_id=eq.${idLouvor}&order=ordem.asc`, {
        method: 'GET',
        headers: {
          apikey: this.supabaseKey,
          Authorization: `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });

      const letras = await response.json();

      if (!Array.isArray(letras)) {
        console.error('Erro ao buscar letras para reordenar:', letras);
        return false;
      }

      // 2. Loop para reordenar (Ordem = 1, 2, 3, ...)
      for (let i = 0; i < letras.length; i++) {
        const letra = letras[i];
        const novaOrdem = i + 1;

        if (letra.ordem != novaOrdem) {
          // Somente atualiza se estiver diferente
          if (letra.ordem !== novaOrdem) {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/TbLetras?id=eq.${letra.id}`, {
              method: 'PATCH',
              headers: {
                apikey: this.supabaseKey,
                Authorization: `Bearer ${this.supabaseKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ordem: novaOrdem }),
            });
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Erro ao reordenar letras:', error);
    }

    return false;
  }

  async duplicarLetra(idLetra: string): Promise<boolean> {
    try {
      // 1. Buscar a letra original
      const letraOriginal = await this.getLetraById(idLetra);
      if (!letraOriginal) {
        console.error('Letra não encontrada');
        return false;
      }

      // 2. Buscar todas as letras do mesmo louvor
      const letrasDoLouvor = await this.getLetrasByLouvorId(letraOriginal.louvor_id);
      const maiorOrdem = letrasDoLouvor.reduce((max, letra) => Math.max(max, letra.ordem), 0);

      // 3. Criar nova letra (sem o id)
      const novaLetra: LetraModel = {
        ...letraOriginal,
        ordem: maiorOrdem + 1,
      };

      delete novaLetra.id;

      // 4. Inserir nova letra
      const resultado = await this.addLetra(novaLetra);
      return resultado !== '';
    } catch (error) {
      console.error('Erro ao duplicar letra:', error);
      return false;
    }
  }

  private sanitizePhrase(raw: string): string {
    // para garantir: minusculas e sem pontuação extra
    return raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
  }

  async searchLouvoresByLyricSubstring(phrase: string): Promise<LouvorModel[]> {
    const clean = this.sanitizePhrase(phrase);

    // 1) Pega todos os louvor_id cujas letras normalizadas contenham a frase
    const { data: letrasData, error: err1 } = await this.supabaseClient.from('vlouvores').select('louvor_id').ilike('letra_normalizada', `%${clean}%`);

    if (err1) {
      console.error('Erro buscando letras normalizadas:', err1);
      throw err1;
    }

    // Cast para o formato certo
    const letras = letrasData as Array<{ louvor_id: string }>;
    const louvorIds = Array.from(new Set(letras.map((l) => l.louvor_id)));
    if (louvorIds.length === 0) return [];

    // 2) Busca os louvores pelos IDs
    const { data: louvoresData, error: err2 } = await this.supabaseClient.from('TbLouvores').select('*').in('id', louvorIds).order('cantor', { ascending: true }).order('nome', { ascending: true });

    if (err2) {
      console.error('Erro buscando louvores:', err2);
      throw err2;
    }

    // Cast final para LouvorModel[]
    return (louvoresData as LouvorModel[]) ?? [];
  }
}
