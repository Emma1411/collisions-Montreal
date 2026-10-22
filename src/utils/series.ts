import type { Aggregate } from './aggregate';
import { COLORS } from './colors';

export type Niveau = 'toutes' | 'blesses' | 'leger' | 'grave' | 'mortel' | 'dm';

const GRAVITES: Record<Niveau, number[]> = {
  toutes: [1, 2, 3, 4], blesses: [2, 3, 4], leger: [2], grave: [3], mortel: [4], dm: [1],
};

export const NIVEAUX: { value: Niveau; label: string; color: string; phrase: string }[] = [
  { value: 'blesses', label: 'Avec blessés', color: COLORS.blesses, phrase: 'les collisions avec blessés' },
  { value: 'leger', label: 'Légères', color: COLORS.leger, phrase: 'les collisions légères' },
  { value: 'grave', label: 'Graves', color: COLORS.grave, phrase: 'les collisions graves' },
  { value: 'mortel', label: 'Mortelles', color: COLORS.mortel, phrase: 'les collisions mortelles' },
  { value: 'dm', label: 'Dégâts matériels seulement', color: COLORS.dm, phrase: 'les collisions avec dégâts matériels seulement' },
];

export interface PointAnnuel { annee: number; valeur: number }

export function serieAnnuelle(a: Aggregate, annee0: number, [from, to]: [number, number], niveau: Niveau): PointAnnuel[] {
  const out: PointAnnuel[] = [];
  for (let y = from; y <= to; y++) {
    out.push({ annee: annee0 + y, valeur: GRAVITES[niveau].reduce((s, g) => s + a.parAnnee[y * 5 + g], 0) });
  }
  return out;
}

export const variation = (a: number, b: number): number | null => (a === 0 ? null : (b - a) / a);