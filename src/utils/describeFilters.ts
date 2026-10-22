import type { Filters, GraviteFiltre, Lieu, Usager } from '../interfaces/filters';
import { P1_FIN } from './constants';

const QUOI: Record<GraviteFiltre, string> = {
  toutes: 'Toutes les collisions',
  blesses: 'Les collisions avec blessés',
  graves: 'Les collisions graves ou mortelles',
};
const QUI: Record<Usager, string> = { pieton: 'des piétons', velo: 'des cyclistes', moto: 'des motos' };
const OU: Record<Lieu, string> = { tous: '', intersection: ', à une intersection', hors: ', hors intersection' };

const liste = (xs: string[]) => (xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} ou ${xs[xs.length - 1]}`);

export function describeFilters(f: Filters, [a0, a1]: [number, number]): string {
  const quand = f.periode === 'p1' ? `de ${a0} à ${P1_FIN}` : f.periode === 'p2' ? `de ${P1_FIN + 1} à ${a1}` : `de ${a0} à ${a1}`;
  const qui = f.usagers.length ? ` impliquant ${liste(f.usagers.map(u => QUI[u]))}` : '';
  return `${QUOI[f.gravite]}${qui}${OU[f.lieu]}, ${quand}`;
}