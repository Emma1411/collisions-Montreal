export type Dtype = 'uint8' | 'uint16';

export interface BinColumnDef { name: string; dtype: Dtype; offset: number; bytes: number }
export interface BinHeader {
  n: number;
  annee0: number;
  flags: Record<'pieton' | 'velo' | 'moto' | 'cyclomoteur' | 'en_intersection' | 'hors_chemin_public' | 'loc_imprecise', number>;
  columns: BinColumnDef[];
}

export interface CollisionColumns {
  n: number;
  annee0: number;
  flags: BinHeader['flags'];
  inter: Uint16Array;
  annee: Uint8Array;       
  mois: Uint8Array;
  jour: Uint8Array;
  heure: Uint8Array;
  gravite: Uint8Array;      
  flagsCol: Uint8Array;
  genre: Uint8Array;
  surface: Uint8Array;
  eclairage: Uint8Array;
  meteo: Uint8Array;
  categorie: Uint8Array;
  localisation: Uint8Array;
}