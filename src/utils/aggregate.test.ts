
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { decodeCollisions } from '../services/collisionsService';
import { aggregate } from './aggregate';
import { CODE_NON_PRECISE, INTER_AUCUNE } from './constants';
import type { Filters } from '../interfaces/filters';
import type { Meta } from '../interfaces/meta';

const dir = fileURLToPath(new URL('../../public/data/', import.meta.url));
const meta: Meta = JSON.parse(readFileSync(dir + 'meta.json', 'utf8'));
const inters = JSON.parse(readFileSync(dir + 'intersections.json', 'utf8')) as { n: number };
const cols = decodeCollisions(
  new Uint8Array(gunzipSync(readFileSync(dir + 'collisions.bin.gz')))
);

const ALL: Filters = {
  periode: 'all',
  gravite: 'toutes',
  usagers: [],
  lieu: 'tous',
};

const sum = (a: ArrayLike<number>) =>
  Array.from(a).reduce((s, v) => s + v, 0);

describe('réconciliation collisions.bin.gz ↔ meta.json', () => {
  const a = aggregate(cols, ALL);

  it('totaux globaux', () => {
    expect(cols.n).toBe(meta.totaux.retenues);
    expect(a.total).toBe(meta.totaux.retenues);
    expect(a.avecBlesses).toBe(meta.totaux.blesses);
    expect(a.graves).toBe(meta.totaux.graves);
    expect(a.mortelles).toBe(meta.totaux.mortelles);
  });

  it('effectifs par année et par gravité', () => {
    for (const r of meta.qualite.rupture_annuelle) {
      const y = r.annee - cols.annee0;

      expect([1, 2, 3, 4].map(g => a.parAnnee[y * 5 + g])).toEqual([
        r.dm_seulement,
        r.leger,
        r.grave,
        r.mortel,
      ]);
    }
  });

  it('filtre « avec blessés »', () => {
    expect(aggregate(cols, { ...ALL, gravite: 'blesses' }).total).toBe(
      meta.totaux.blesses
    );
  });

  it('heure : inconnues + matrice = total', () => {
    expect(a.heureInconnue).toBe(meta.qualite.heure_inconnue_retenues);
    expect(sum(a.heureJour) + a.heureInconnue).toBe(a.total);
  });

  it('mois : somme = total', () => {
    expect(sum(a.parMois)).toBe(a.total);
  });

  it('index d’intersection valides (ou sentinelle)', () => {
    let invalides = 0;

    for (const v of cols.inter) {
      if (v !== INTER_AUCUNE && v >= inters.n) invalides++;
    }

    expect(invalides).toBe(0);
  });

  it('codes présents ∈ libellés du meta (0 = non précisé toléré)', () => {
    const dims = {
      genre: a.genre,
      surface: a.surface,
      eclairage: a.eclairage,
      meteo: a.meteo,
    };

    const inconnus: Record<string, Record<number, number>> = {};

    for (const [dim, counts] of Object.entries(dims)) {
      const lib = meta.libelles[dim as keyof Meta['libelles']];

      counts.forEach((n, code) => {
        if (
          n > 0 &&
          code !== CODE_NON_PRECISE &&
          lib[String(code)] === undefined
        ) {
          (inconnus[dim] ??= {})[code] = n;
        }
      });
    }

    expect(inconnus).toEqual({});
  });
});
