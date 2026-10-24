import type { CollisionColumns } from '../interfaces/collision';
import type { Filters } from '../interfaces/filters';
import { INTER_AUCUNE, P1_FIN } from './constants';
import { ECLAIRAGE_SOMBRE, SURFACE_NON_SECHE } from './groups';
import { periodeRange } from './periode';

const lookup = (codes: number[]) => { const a = new Uint8Array(256); for (const c of codes) a[c] = 1; return a; };
const NON_SECHE = lookup(SURFACE_NON_SECHE);
const SOMBRE = lookup(ECLAIRAGE_SOMBRE);

export interface InterStats {
  n: Uint32Array;          // collisions affichées
  blesses: Uint32Array;    // dont avec blessés
  graves: Uint32Array;     // gravité 3
  mortelles: Uint32Array;  // gravité 4
  p1: Uint32Array;         // avec blessés 2012-2016 (tous filtres sauf la période)
  p2: Uint32Array;         // avec blessés 2017-2021
  hors: number;            // collisions affichées non rattachées à une intersection
}

export interface Ranking { order: number[]; rank: Uint32Array }

// Mêmes règles que aggregate.ts, sauf la période (gérée à part)
function baseFilter(c: CollisionColumns, f: Filters) {
  const gMin = f.gravite === 'toutes' ? 1 : f.gravite === 'blesses' ? 2 : 3;
  const bit = (u: string) => (u === 'pieton' ? c.flags.pieton : u === 'velo' ? c.flags.velo : c.flags.moto | c.flags.cyclomoteur);
  const uMask = f.usagers.reduce((m, u) => m | bit(u), 0);
  const EI = c.flags.en_intersection;
  const ok = (fl: number, g: number) =>
    g >= gMin && (!uMask || (fl & uMask) !== 0) && (f.lieu === 'tous' || (f.lieu === 'intersection') === ((fl & EI) !== 0));
  return { gMin, ok };
}

export function aggregateByIntersection(c: CollisionColumns, f: Filters, nInter: number): InterStats {
  const s: InterStats = {
    n: new Uint32Array(nInter), blesses: new Uint32Array(nInter), graves: new Uint32Array(nInter),
    mortelles: new Uint32Array(nInter), p1: new Uint32Array(nInter), p2: new Uint32Array(nInter), hors: 0,
  };
  const { gMin, ok } = baseFilter(c, f);
  const [aMin, aMax] = periodeRange(f.periode, c.annee0);
  const split = P1_FIN - c.annee0;
  const gP = Math.max(2, gMin);

  for (let i = 0; i < c.n; i++) {
    const g = c.gravite[i];
    if (!ok(c.flagsCol[i], g)) continue;
    const it = c.inter[i];
    const valid = it !== INTER_AUCUNE && it < nInter;
    const an = c.annee[i];
    if (valid && g >= gP) { if (an <= split) s.p1[it]++; else s.p2[it]++; }
    if (an < aMin || an > aMax) continue;
    if (!valid) { s.hors++; continue; }
    s.n[it]++;
    if (g >= 2) s.blesses[it]++;
    if (g === 3) s.graves[it]++; else if (g === 4) s.mortelles[it]++;
  }
  return s;
}

export function buildRanking(s: InterStats): Ranking {
  const n = s.n.length;
  const order: number[] = [];
  for (let i = 0; i < n; i++) if (s.blesses[i] > 0) order.push(i);
  order.sort((a, b) => s.blesses[b] - s.blesses[a] || s.n[b] - s.n[a] || a - b);
  const rank = new Uint32Array(n);
  let prev = -1, pr = 0;
  order.forEach((i, k) => { if (s.blesses[i] !== prev) { pr = k + 1; prev = s.blesses[i]; } rank[i] = pr; });
  return { order, rank };
}

export interface InterDetail { n: number; pieton: number; velo: number; moto: number; vehSeul: number; nonSeche: number; sombre: number }

/** Profil d'une seule intersection (balayage des 131 200 lignes, quelques ms). */
export function detailFor(c: CollisionColumns, f: Filters, idx: number): InterDetail {
  const d: InterDetail = { n: 0, pieton: 0, velo: 0, moto: 0, vehSeul: 0, nonSeche: 0, sombre: 0 };
  const { ok } = baseFilter(c, f);
  const [aMin, aMax] = periodeRange(f.periode, c.annee0);
  const moto = c.flags.moto | c.flags.cyclomoteur;
  const vul = c.flags.pieton | c.flags.velo | moto;
  for (let i = 0; i < c.n; i++) {
    if (c.inter[i] !== idx) continue;
    const an = c.annee[i];
    if (an < aMin || an > aMax) continue;
    const fl = c.flagsCol[i];
    if (!ok(fl, c.gravite[i])) continue;
    d.n++;
    if (fl & c.flags.pieton) d.pieton++;
    if (fl & c.flags.velo) d.velo++;
    if (fl & moto) d.moto++;
    if (!(fl & vul)) d.vehSeul++;
    if (NON_SECHE[c.surface[i]]) d.nonSeche++;
    if (SOMBRE[c.eclairage[i]]) d.sombre++;
  }
  return d;
}