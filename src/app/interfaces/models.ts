export interface LetraModel {
  id?: string;
  ordem: number;
  letra: string;
  letra_normalizada: string;
  notas: string;
  is_intro: boolean;
  louvor_id: string;
}

export interface LouvorModel {
  id: string;
  nome: string;
  grupo: string;
  cantor: string;
  inicio: string;
  tom: string;
  url: string;
  conferido: boolean;
}

export interface LouvorComLetrasModel extends LouvorModel {
  letras: LetraModel[];
}

export interface LetraComLouvorModel extends LetraModel {
  louvor: LouvorModel;
}
