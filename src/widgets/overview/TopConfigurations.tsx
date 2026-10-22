import AnimatedNumber from '../../components/ui/AnimatedNumber';
import { useAggregate } from '../../hooks/useAggregate';
import { fmtPct } from '../../utils/format';
import { compter, GENRE_GROUPES } from '../../utils/groups';

export default function TopConfigurations() {
  const agg = useAggregate();
  if (!agg) return null;

  const rows = compter(agg.genre, GENRE_GROUPES, agg.total, 'Autres types de collision')
    .filter(r => r.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 6);
  const max = rows[0]?.n ?? 0;

  return (
    <section className="card p-5" aria-labelledby="titre-configs">
      <h3 id="titre-configs" className="text-base font-semibold tracking-tight text-ink">Qui a heurté quoi ?</h3>
      <p className="text-xs text-ink-muted">
        Les types de collision les plus fréquents, selon vos filtres. Exemple : « Véhicule contre piéton » = un véhicule a heurté un piéton.
      </p>
      <ol className="mt-4 space-y-3">
        {rows.map((r, i) => (
          <li key={r.key} className="grid gap-x-3 gap-y-1 sm:grid-cols-[17rem_1fr_11rem] sm:items-center">
            <span className="text-sm text-ink">{i + 1}. {r.label}</span>
            <span className="h-3 overflow-hidden rounded bg-canvas" aria-hidden>
              <span className="block h-full rounded bg-brand transition-[width] duration-500" style={{ width: `${max ? (r.n / max) * 100 : 0}%` }} />
            </span>
            <span className="text-sm tabular-nums text-ink sm:text-right">
              <AnimatedNumber value={r.n} /> <span className="text-ink-muted">(<AnimatedNumber value={agg.total ? r.n / agg.total : 0} format={fmtPct} />)</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}