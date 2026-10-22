import type { Periode } from '../interfaces/filters';
import { N_ANNEES, P1_FIN } from './constants';

/** Indices d'années [début, fin] inclus (0 = annee0). */
export function periodeRange(p: Periode, annee0: number): [number, number] {
  if (p === 'p1') return [0, P1_FIN - annee0];
  if (p === 'p2') return [P1_FIN + 1 - annee0, N_ANNEES - 1];
  return [0, N_ANNEES - 1];
}