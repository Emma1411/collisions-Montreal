const rgba = (a: number) => `rgb(11 92 147 / ${a.toFixed(3)})`;

/** Échelle depuis zéro (matrice horaire) ; la racine carrée garde les petites valeurs visibles. */
export const heatColor = (v: number, max: number) =>
  rgba(max > 0 && v > 0 ? 0.12 + 0.88 * Math.sqrt(v / max) : 0.05);

/** Échelle min-max (saisonnalité : les mois diffèrent peu, il faut étirer le contraste). */
export const rangeColor = (v: number, min: number, max: number) =>
  rgba(max > min ? 0.15 + 0.85 * ((v - min) / (max - min)) : 0.5);