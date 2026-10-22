export interface Groupe { key: string; label: string; codes: number[] }
export interface GroupeCount { key: string; label: string; n: number }

export function compter(counts: ArrayLike<number>, groupes: Groupe[], total: number, autre = 'Autre / inconnu'): GroupeCount[] {
  const out = groupes.map(g => ({ key: g.key, label: g.label, n: g.codes.reduce((s, c) => s + (counts[c] ?? 0), 0) }));
  const reste = total - out.reduce((s, g) => s + g.n, 0);
  if (reste > 0) out.push({ key: 'autre', label: autre, n: reste });
  return out;
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const GENRE_GROUPES: Groupe[] = [
  { key: 'veh', label: 'Véhicule contre véhicule', codes: [31] },
  { key: 'pieton', label: 'Véhicule contre piéton', codes: [32] },
  { key: 'velo', label: 'Véhicule contre cycliste', codes: [33] },
  { key: 'fixe', label: 'Choc contre un objet fixe', codes: [...range(40, 55), 59] },
  { key: 'animal', label: 'Collision avec un animal', codes: [35, 36, 37] },
  { key: 'seul', label: 'Sans collision (capotage, sortie de route…)', codes: [71, 72, 73, 74, 75, 99] },
];

export const SURFACE_GROUPES: Groupe[] = [
  { key: 'seche', label: 'Chaussée sèche', codes: [11] },
  { key: 'mouillee', label: 'Mouillée / eau', codes: [12, 13] },
  { key: 'hiver', label: 'Neige / glace / gadoue', codes: [15, 16, 17, 18] },
];

export const ECLAIRAGE_GROUPES: Groupe[] = [
  { key: 'jour', label: 'Plein jour', codes: [1] },
  { key: 'demi', label: 'Demi-obscurité (aube, crépuscule)', codes: [2] },
  { key: 'nuit-e', label: 'Nuit, chemin éclairé', codes: [3] },
  { key: 'nuit-ne', label: 'Nuit, chemin non éclairé', codes: [4] },
];

export const METEO_GROUPES: Groupe[] = [
  { key: 'clair', label: 'Clair', codes: [11] },
  { key: 'couvert', label: 'Couvert', codes: [12] },
  { key: 'pluie', label: 'Pluie / averses', codes: [14, 15] },
  { key: 'neige', label: 'Neige / grêle / verglas', codes: [17, 18, 19] },
];