export function parHeure(heureJour: ArrayLike<number>): number[] {
  const out = new Array<number>(24).fill(0);
  for (let d = 0; d < 7; d++) for (let h = 0; h < 24; h++) out[h] += heureJour[d * 24 + h];
  return out;
}

/** Heure de début de la fenêtre de 3 heures consécutives la plus chargée. */
export function pic3h(ph: number[]): number {
  let best = 0, bestSum = -1;
  for (let h = 0; h <= 21; h++) {
    const s = ph[h] + ph[h + 1] + ph[h + 2];
    if (s > bestSum) { bestSum = s; best = h; }
  }
  return best;
}