import type { IntersectionsColumns } from '../interfaces/intersection';

export const TOP_N = 100;
export const SANS_NOM = 'Intersection sans nom';
export type Statut = 'persistant' | 'recent' | 'ancien' | null;

export function statutFromRanks(r1: number, r2: number): Statut {
  const in1 = r1 >= 1 && r1 <= TOP_N, in2 = r2 >= 1 && r2 <= TOP_N;
  if (in1 && in2) return 'persistant';
  if (in2) return 'recent';
  if (in1) return 'ancien';
  return null;
}

let cache: { src: IntersectionsColumns; map: Map<string, number> } | null = null;
function keyMap(inters: IntersectionsColumns) {
  if (cache?.src !== inters) cache = { src: inters, map: new Map(inters.cle.map((k, i) => [k, i])) };
  return cache.map;
}

/** "45.5235|-73.5987" → "45.5235_-73.5987" (aucune % à encoder dans l'URL) */
export const interParam = (inters: IntersectionsColumns, i: number) => inters.cle[i].replace('|', '_');
export const parseInterParam = (inters: IntersectionsColumns, p: string | null): number | null =>
  p ? (keyMap(inters).get(p.replace('_', '|')) ?? null) : null;

export const hasName = (inters: IntersectionsColumns, i: number) => inters.nom[i] !== SANS_NOM;
export const interCoords = (inters: IntersectionsColumns, i: number) => `${inters.lat[i].toFixed(4)}, ${inters.lon[i].toFixed(4)}`;