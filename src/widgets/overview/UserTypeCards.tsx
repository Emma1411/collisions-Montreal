import { Bike, Check, Gauge, PersonStanding, type LucideIcon } from 'lucide-react';
import AnimatedNumber from '../../components/ui/AnimatedNumber';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useUsersAggregate } from '../../hooks/useAggregate';
import type { Usager } from '../../interfaces/filters';
import { toggleUsager } from '../../slices/filtersSlice';
import { COLORS } from '../../utils/colors';
import { fmtPct } from '../../utils/format';

const TYPES: { usager: Usager; label: string; sujet: string; Icon: LucideIcon }[] = [
  { usager: 'pieton', label: 'Piétons', sujet: 'un piéton', Icon: PersonStanding },
  { usager: 'velo', label: 'Cyclistes', sujet: 'un cycliste', Icon: Bike },
  { usager: 'moto', label: 'Motos et cyclomoteurs', sujet: 'une moto ou un cyclomoteur', Icon: Gauge },
];

function LegendRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-2.5 shrink-0 rounded-sm" style={{ background: color }} aria-hidden />
      <span>{label}</span>
      <AnimatedNumber value={value} className="ml-auto font-medium text-ink" />
    </span>
  );
}

export default function UserTypeCards() {
  const dispatch = useAppDispatch();
  const actifs = useAppSelector(s => s.filters.usagers);
  const agg = useUsersAggregate();
  if (!agg) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TYPES.map(({ usager, label, sujet, Icon }) => {
        const s = agg.usagers[usager];
        const on = actifs.includes(usager);
        const autres = Math.max(0, s.n - s.graves - s.mortelles);
        const pct = (v: number) => (s.n ? (v / s.n) * 100 : 0);
        const serieuses = s.n ? (s.graves + s.mortelles) / s.n : 0;

        return (
          <button key={usager} type="button" aria-pressed={on} onClick={() => dispatch(toggleUsager(usager))}
            className={`card p-5 text-left transition-shadow hover:shadow-md ${on ? 'ring-2 ring-brand' : ''}`}>
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-4" aria-hidden />
              </span>
              {label}
            </span>

            <AnimatedNumber value={s.n} className="num mt-3 block text-3xl text-ink" />
            <span className="block text-xs text-ink-muted">collisions impliquant {sujet}</span>

            <span className="mt-3 block text-sm text-ink-muted">
              <AnimatedNumber value={serieuses} format={fmtPct} className="font-semibold text-ink" /> sont graves ou mortelles
            </span>

            <span className="mt-2 flex h-2 overflow-hidden rounded-full bg-canvas" aria-hidden>
              <span className="h-full transition-[width] duration-500" style={{ width: `${pct(s.mortelles)}%`, background: COLORS.mortel }} />
              <span className="h-full transition-[width] duration-500" style={{ width: `${pct(s.graves)}%`, background: COLORS.grave }} />
              <span className="h-full flex-1" style={{ background: COLORS.autre }} />
            </span>

            <span className="mt-2 grid gap-1 text-xs text-ink-muted">
              <LegendRow color={COLORS.mortel} label="Mortelles" value={s.mortelles} />
              <LegendRow color={COLORS.grave} label="Graves" value={s.graves} />
              <LegendRow color={COLORS.autre} label="Autres (légères ou dégâts seulement)" value={autres} />
            </span>

            <span className={`mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${on ? 'bg-brand text-white' : 'bg-brand-soft text-brand'}`}>
              {on ? <><Check className="size-3.5" aria-hidden /> Filtre actif · cliquer pour retirer</> : `Voir seulement : ${label.toLowerCase()}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}