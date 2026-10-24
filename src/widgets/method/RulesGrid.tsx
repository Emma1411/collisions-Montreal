import { ClipboardList, Hash, Users, type LucideIcon } from 'lucide-react';

const RULES: { n: number; Icon: LucideIcon; titre: string; texte: string; limite: string }[] = [
  {
    n: 1, Icon: Hash, titre: 'Beaucoup de collisions ne veut pas dire plus dangereux',
    texte: 'Une intersection où passent des milliers de véhicules par jour aura plus de collisions qu’une rue calme, même si chaque passage y est plus sûr. Ce site compte des collisions, pas des risques.',
    limite: 'Ce qui est compté : le nombre de collisions.',
  },
  {
    n: 2, Icon: ClipboardList, titre: 'Seules les collisions rapportées sont comptées',
    texte: 'Le jeu de données ne contient que les collisions impliquant au moins un véhicule motorisé et ayant fait l’objet d’un rapport de police. Une chute à vélo sans voiture, ou un accrochage sans rapport, n’y figure pas.',
    limite: 'Ce qui manque : les collisions non rapportées.',
  },
  {
    n: 3, Icon: Users, titre: 'On ne sait pas combien de gens passent',
    texte: 'Les données ne disent pas combien de personnes marchent, pédalent ou roulent à chaque endroit. Impossible donc de calculer un « risque par passage » : on ne peut pas dire qu’une intersection est plus sûre qu’une autre.',
    limite: 'Ce qui manque : le nombre de passages.',
  },
];

export default function RulesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {RULES.map(({ n, Icon, titre, texte, limite }) => (
        <article key={n} className="flex flex-col gap-3 rounded-xl border border-line bg-canvas/50 p-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand"><Icon className="size-4" aria-hidden /></span>
            <span className="kicker">Règle n° {n}</span>
          </div>
          <h3 className="text-sm font-semibold text-ink">{titre}</h3>
          <p className="text-sm text-ink-muted">{texte}</p>
          <p className="mt-auto border-t border-line pt-2 text-xs text-ink-faint">{limite}</p>
        </article>
      ))}
    </div>
  );
}