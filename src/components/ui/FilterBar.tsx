import { Bike, Check, Gauge, PersonStanding, RotateCcw } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useMeta } from '../../hooks/useMeta';
import { resetFilters, setGravite, setLieu, setPeriode, toggleUsager } from '../../slices/filtersSlice';
import { DEFAULT_FILTERS as D, type GraviteFiltre, type Lieu, type Periode, type Usager } from '../../interfaces/filters';
import { P1_FIN } from '../../utils/constants';
import FilterSummary from './FilterSummary';
import Segmented from './Segmented';

const USAGERS = [
  { value: 'pieton', label: 'Piétons', Icon: PersonStanding, title: 'Collisions impliquant au moins un piéton' },
  { value: 'velo', label: 'Cyclistes', Icon: Bike, title: 'Collisions impliquant au moins un cycliste' },
  { value: 'moto', label: 'Motos', Icon: Gauge, title: 'Motos et cyclomoteurs' },
] as const satisfies readonly { value: Usager; label: string; Icon: unknown; title: string }[];

export default function FilterBar() {
  const dispatch = useAppDispatch();
  const f = useAppSelector(s => s.filters);
  const { annees } = useMeta();
  const [a0, a1] = annees;

  const periodes: { value: Periode; label: string }[] = [
    { value: 'all', label: `Toute la période (${a0}-${a1})` },
    { value: 'p1', label: `${a0}-${P1_FIN}` },
    { value: 'p2', label: `${P1_FIN + 1}-${a1}` },
  ];
  const gravites: { value: GraviteFiltre; label: string; title: string }[] = [
    { value: 'toutes', label: 'Toutes', title: 'Toutes les collisions, même sans blessé' },
    { value: 'blesses', label: 'Avec blessés', title: 'Au moins une personne blessée ou décédée' },
    { value: 'graves', label: 'Graves ou mortelles', title: 'Blessure grave ou décès' },
  ];
  const lieux: { value: Lieu; label: string }[] = [
    { value: 'tous', label: 'Partout' },
    { value: 'intersection', label: 'À une intersection' },
    { value: 'hors', label: 'Hors intersection' },
  ];

  const isDefault = f.periode === D.periode && f.gravite === D.gravite && f.lieu === D.lieu && f.usagers.length === 0;

  return (
    <div className="border-b border-line bg-white lg:sticky lg:top-(--header-h) lg:z-30">
      <div className="page-container space-y-3 py-3">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <Segmented ariaLabel="Période" label="Période" value={f.periode} options={periodes} onChange={v => dispatch(setPeriode(v))} />
          <Segmented ariaLabel="Gravité" label="Gravité des collisions" value={f.gravite} options={gravites} onChange={v => dispatch(setGravite(v))} />

          <div className="flex flex-col gap-1" role="group" aria-label="Usagers impliqués">
            <span className="kicker">
              Usagers impliqués <span className="font-normal normal-case tracking-normal text-ink-faint">(aucun choix = tous)</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {USAGERS.map(({ value, label, Icon, title }) => {
                const on = f.usagers.includes(value);
                return (
                  <button key={value} type="button" className="chip py-1.5" aria-pressed={on} title={title}
                    onClick={() => dispatch(toggleUsager(value))}>
                    {on ? <Check className="size-3.5" aria-hidden /> : <Icon className="size-3.5" aria-hidden />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <Segmented ariaLabel="Lieu" label="Lieu" value={f.lieu} options={lieux} onChange={v => dispatch(setLieu(v))} />

          {!isDefault && (
            <button type="button" onClick={() => dispatch(resetFilters())}
              className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-medium text-ink-muted hover:border-brand/40 hover:text-brand">
              <RotateCcw className="size-3.5" aria-hidden /> Tout réinitialiser
            </button>
          )}
        </div>

        <FilterSummary />
      </div>
    </div>
  );
}