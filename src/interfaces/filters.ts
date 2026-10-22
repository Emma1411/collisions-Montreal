export type Periode = 'all' | 'p1' | 'p2';            
export type GraviteFiltre = 'blesses' | 'graves' | 'toutes';
export type Usager = 'pieton' | 'velo' | 'moto';
export type Lieu = 'tous' | 'intersection' | 'hors';

export interface Filters {
  periode: Periode;
  gravite: GraviteFiltre;
  usagers: Usager[];   
  lieu: Lieu;
}

export const DEFAULT_FILTERS: Filters = { periode: 'all', gravite: 'toutes', usagers: [], lieu: 'tous' };