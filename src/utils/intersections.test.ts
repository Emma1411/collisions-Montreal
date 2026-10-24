import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { decodeCollisions } from '../services/collisionsService';
import { aggregate } from './aggregate';
import { aggregateByIntersection, detailFor } from './byIntersection';
import { statutFromRanks } from './intersections';
import type { Filters } from '../interfaces/filters';
import type { IntersectionsColumns, SimilairesMap } from '../interfaces/intersection';
import type { Meta } from '../interfaces/meta';

const dir = fileURLToPath(new URL('../../public/data/', import.meta.url));
const meta: Meta = JSON.parse(readFileSync(dir + 'meta.json', 'utf8'));
const inters: IntersectionsColumns = JSON.parse(readFileSync(dir + 'intersections.json', 'utf8'));
const sims: SimilairesMap = JSON.parse(readFileSync(dir + 'similaires.json', 'utf8'));
const cols = decodeCollisions(new Uint8Array(gunzipSync(readFileSync(dir + 'collisions.bin.gz'))));

describe('intersections.json', () => {
  it('clés uniques et colonnes de même longueur', () => {
    expect(new Set(inters.cle).size).toBe(inters.n);
    for (const k of ['lat', 'lon', 'nom', 'rang_p1', 'rang_p2', 'categorie'] as const) expect(inters[k].length).toBe(inters.n);
  });

  it('statuts dérivés des rangs = meta.stabilite', () => {
    const c = { persistant: 0, recent: 0, ancien: 0 };
    for (let i = 0; i < inters.n; i++) { const s = statutFromRanks(inters.rang_p1[i], inters.rang_p2[i]); if (s) c[s]++; }
    expect(c).toEqual({ persistant: meta.stabilite.persistants, recent: meta.stabilite.recents, ancien: meta.stabilite.anciens });
  });

  it('top 50 en commun', () => {
    let k = 0;
    for (let i = 0; i < inters.n; i++) if (inters.rang_p1[i] >= 1 && inters.rang_p1[i] <= 50 && inters.rang_p2[i] >= 1 && inters.rang_p2[i] <= 50) k++;
    expect(k).toBe(meta.stabilite.top50_en_commun);
  });

  it('similaires : indices valides', () => {
    for (const [k, list] of Object.entries(sims)) {
      expect(Number(k)).toBeLessThan(inters.n);
      for (const s of list) { expect(s.i).toBeLessThan(inters.n); expect(s.s).toBeLessThanOrEqual(1); }
    }
  });
});

describe('agrégation par intersection', () => {
  const cas: Filters[] = [
    { periode: 'all', gravite: 'toutes', usagers: [], lieu: 'tous' },
    { periode: 'p2', gravite: 'blesses', usagers: ['pieton'], lieu: 'tous' },
    { periode: 'p1', gravite: 'graves', usagers: ['velo', 'moto'], lieu: 'intersection' },
    { periode: 'all', gravite: 'toutes', usagers: [], lieu: 'hors' },
  ];

  it.each(cas)('somme des intersections + hors = total (%o)', f => {
    const s = aggregateByIntersection(cols, f, inters.n);
    const total = Array.from(s.n).reduce((a, b) => a + b, 0) + s.hors;
    expect(total).toBe(aggregate(cols, f).total);
  });

  it('fiche = agrégat pour l’intersection la plus touchée', () => {
    const f = cas[0];
    const s = aggregateByIntersection(cols, f, inters.n);
    let best = 0;
    for (let i = 1; i < inters.n; i++) if (s.blesses[i] > s.blesses[best]) best = i;
    expect(detailFor(cols, f, best).n).toBe(s.n[best]);
  });
});