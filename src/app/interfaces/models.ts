export interface LetraModel {
  id: string;
  ordem: number;
  letra: string;
  notas: string;
  is_intro: boolean;
  louvor_id: string;
}

export interface LouvorModel {
  id: string;
  nome: string;
  cantor: string;
  inicio: string;
  tom: string;
  formula: string;
}

export interface LouvorComLetrasModel extends LouvorModel {
  letras: LetraModel[];
}

export interface LetraComLouvorModel extends LetraModel {
  louvor: LouvorModel;
}
