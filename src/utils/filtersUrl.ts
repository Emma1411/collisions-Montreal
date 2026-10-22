import { DEFAULT_FILTERS, type Filters, type GraviteFiltre, type Lieu, type Periode, type Usager } from '../interfaces/filters';

const PERIODES: Periode[] = ['all', 'p1', 'p2'];
const GRAVITES: GraviteFiltre[] = ['blesses', 'graves', 'toutes'];
const LIEUX: Lieu[] = ['tous', 'intersection', 'hors'];
const USAGERS: Usager[] = ['pieton', 'velo', 'moto'];

export function parseFilters(sp: URLSearchParams): Filters {
  const p = sp.get('p') as Periode, g = sp.get('g') as GraviteFiltre, l = sp.get('l') as Lieu;
  return {
    periode: PERIODES.includes(p) ? p : DEFAULT_FILTERS.periode,
    gravite: GRAVITES.includes(g) ? g : DEFAULT_FILTERS.gravite,
    lieu: LIEUX.includes(l) ? l : DEFAULT_FILTERS.lieu,
    usagers: (sp.get('u') ?? '').split(',').filter((x): x is Usager => USAGERS.includes(x as Usager)),
  };
}

export function writeFilters(sp: URLSearchParams, f: Filters) {
  const set = (k: string, v: string, d: string) => (v === d ? sp.delete(k) : sp.set(k, v));
  set('p', f.periode, DEFAULT_FILTERS.periode);
  set('g', f.gravite, DEFAULT_FILTERS.gravite);
  set('l', f.lieu, DEFAULT_FILTERS.lieu);
  if (f.usagers.length) sp.set('u', [...f.usagers].sort().join(','));
  else sp.delete('u');
}