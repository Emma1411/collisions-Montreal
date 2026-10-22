import { useAggregate } from '../../hooks/useAggregate';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useMeta } from '../../hooks/useMeta';
import { describeFilters } from '../../utils/describeFilters';
import { fmtInt, fmtPct } from '../../utils/format';
import AnimatedNumber from './AnimatedNumber';

export default function FilterSummary() {
  const f = useAppSelector(s => s.filters);
  const meta = useMeta();
  const agg = useAggregate();
  if (!agg) return null;

  const overall = meta.totaux.retenues;
  const share = overall ? agg.total / overall : 0;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-live="polite">
      <p className="text-sm text-ink-muted">
        Vous regardez : <strong className="font-semibold text-ink">{describeFilters(f, meta.annees)}</strong>
      </p>
      <div className="flex items-center gap-3">
        <span className="h-2 w-28 overflow-hidden rounded-full bg-canvas" aria-hidden>
          <span className="block h-full rounded-full bg-brand transition-[width] duration-500"
            style={{ width: `${share > 0 ? Math.max(share * 100, 1.5) : 0}%` }} />
        </span>
        <p className="text-sm">
          <AnimatedNumber value={agg.total} className="font-semibold text-brand" />{' '}
          <span className="text-ink-muted">collisions sur {fmtInt(overall)} ({fmtPct(share)})</span>
        </p>
      </div>
      {agg.total === 0 && <p role="status" className="text-sm font-medium text-mortel">Aucune collision ne correspond à ces filtres.</p>}
    </div>
  );
}