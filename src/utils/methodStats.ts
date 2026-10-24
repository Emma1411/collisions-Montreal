import type { CollisionColumns } from '../interfaces/collision';
import type { Filters } from '../interfaces/filters';
import { aggregate } from './aggregate';
import { aggregateByIntersection } from './byIntersection';
import { CODE_NON_PRECISE } from './constants';

export interface MethodStats {
  horsInter: number;     // collisions non rattachées à une intersection
  locImprecise: number;  // position marquée imprécise
  horsChemin: number;    // hors chemin public
  nonPrecise: { genre: number; surface: number; eclairage: number; meteo: number };
}

const ALL: Filters = { periode: 'all', gravite: 'toutes', usagers: [], lieu: 'tous' };

export function computeMethodStats(c: CollisionColumns, nInter: number): MethodStats {
  const agg = aggregate(c, ALL);
  const { hors } = aggregateByIntersection(c, ALL, nInter);
  let li = 0, hc = 0;
  for (let i = 0; i < c.n; i++) {
    const fl = c.flagsCol[i];
    if (fl & c.flags.loc_imprecise) li++;
    if (fl & c.flags.hors_chemin_public) hc++;
  }
  return {
    horsInter: hors, locImprecise: li, horsChemin: hc,
    nonPrecise: {
      genre: agg.genre[CODE_NON_PRECISE], surface: agg.surface[CODE_NON_PRECISE],
      eclairage: agg.eclairage[CODE_NON_PRECISE], meteo: agg.meteo[CODE_NON_PRECISE],
    },
  };
}