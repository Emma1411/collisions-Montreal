export interface IntersectionsColumns {
  n: number;
  cle: string[];      
  lat: number[];
  lon: number[];
  nom: string[];
  statut: number[];    
  rang_p1: number[];   
  rang_p2: number[];   
  categorie: number[]; 
  profilee: number[];  
}

export interface Similaire { i: number; s: number; t: string[] }
export type SimilairesMap = Record<string, Similaire[]>;