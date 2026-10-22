import { COLORS } from '../../utils/colors';

export const SEVERITIES = [
  { label: 'Mortelle', color: COLORS.mortel, def: 'au moins une personne est décédée' },
  { label: 'Grave', color: COLORS.grave, def: 'blessure grave, sans décès' },
  { label: 'Légère', color: COLORS.leger, def: 'blessures légères seulement' },
  { label: 'Dégâts matériels', color: COLORS.dm, def: 'aucune personne blessée' },
];

export default function SeverityLegend({ withDefinitions = false }: { withDefinitions?: boolean }) {
  return (
    <ul className={withDefinitions ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-4' : 'flex flex-wrap gap-x-4 gap-y-1'}>
      {SEVERITIES.map(s => (
        <li key={s.label} className="flex items-start gap-2 text-xs">
          <span className="mt-0.5 size-3 shrink-0 rounded-sm" style={{ background: s.color }} aria-hidden />
          <span>
            <span className="font-semibold text-ink">{s.label}</span>
            {withDefinitions && <span className="block text-ink-muted">{s.def}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}