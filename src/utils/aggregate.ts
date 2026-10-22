
import type { CollisionColumns } from '../interfaces/collision';
import type { Filters } from '../interfaces/filters';
import { HEURE_INCONNUE, JOUR_BASE, MOIS_BASE, N_ANNEES } from './constants';
import { periodeRange } from './periode';

export interface UserStats {
  n: number;
  graves: number;
  mortelles: number;
}

export interface Aggregate {
  total: number;
  avecBlesses: number;
  graves: number;
  mortelles: number;
  parAnnee: Uint32Array; // [annee*5 + gravite], gravite 1..4
  heureJour: Uint32Array; // [jour*24 + heure]
  heureInconnue: number;
  parMois: Uint32Array; // 12
  usagers: {
    pieton: UserStats;
    velo: UserStats;
    moto: UserStats;
  };
  genre: Uint32Array;
  surface: Uint32Array;
  eclairage: Uint32Array;
  meteo: Uint32Array;
}

const USAGER_BIT = (c: CollisionColumns, u: string) =>
  u === 'pieton'
    ? c.flags.pieton
    : u === 'velo'
      ? c.flags.velo
      : c.flags.moto | c.flags.cyclomoteur;

export function aggregate(c: CollisionColumns, f: Filters): Aggregate {
  const a: Aggregate = {
    total: 0,
    avecBlesses: 0,
    graves: 0,
    mortelles: 0,
    parAnnee: new Uint32Array(N_ANNEES * 5),
    heureJour: new Uint32Array(7 * 24),
    heureInconnue: 0,
    parMois: new Uint32Array(12),
    usagers: {
      pieton: { n: 0, graves: 0, mortelles: 0 },
      velo: { n: 0, graves: 0, mortelles: 0 },
      moto: { n: 0, graves: 0, mortelles: 0 },
    },
    genre: new Uint32Array(100),
    surface: new Uint32Array(100),
    eclairage: new Uint32Array(100),
    meteo: new Uint32Array(100),
  };

  const [aMin, aMax] = periodeRange(f.periode, c.annee0);

  const gMin =
    f.gravite === 'toutes' ? 1 : f.gravite === 'blesses' ? 2 : 3;

  const uMask = f.usagers.reduce((m, u) => m | USAGER_BIT(c, u), 0);
  const { en_intersection: EI, pieton, velo, moto, cyclomoteur } = c.flags;

  for (let i = 0; i < c.n; i++) {
    const an = c.annee[i];
    const g = c.gravite[i];
    const fl = c.flagsCol[i];

    if (an < aMin || an > aMax || g < gMin) continue;
    if (uMask && !(fl & uMask)) continue;
    if (f.lieu === 'intersection' && !(fl & EI)) continue;
    if (f.lieu === 'hors' && fl & EI) continue;

    a.total++;

    if (g >= 2) a.avecBlesses++;
    if (g === 3) a.graves++;
    if (g === 4) a.mortelles++;

    a.parAnnee[an * 5 + g]++;

    const h = c.heure[i];

    if (h > 23 || h === HEURE_INCONNUE) {
      a.heureInconnue++;
    } else {
      a.heureJour[(c.jour[i] - JOUR_BASE) * 24 + h]++;
    }

    a.parMois[c.mois[i] - MOIS_BASE]++;

    const bump = (s: UserStats) => {
      s.n++;
      if (g === 3) s.graves++;
      if (g === 4) s.mortelles++;
    };

    if (fl & pieton) bump(a.usagers.pieton);
    if (fl & velo) bump(a.usagers.velo);
    if (fl & (moto | cyclomoteur)) bump(a.usagers.moto);

    a.genre[c.genre[i]]++;
    a.surface[c.surface[i]]++;
    a.eclairage[c.eclairage[i]]++;
    a.meteo[c.meteo[i]]++;
  }

  return a;
}
