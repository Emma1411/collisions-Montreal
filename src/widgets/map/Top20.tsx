import SeverityLegend from '../../components/ui/SeverityLegend';
import { COLORS } from '../../utils/colors';
import type { InterStats, Ranking } from '../../utils/byIntersection';
import { dataset } from '../../utils/datasetStore';
import { fmtInt } from '../../utils/format';
import { hasName, interCoords } from '../../utils/intersections';

interface Props { stats: InterStats; ranking: Ranking; selected: number | null; onSelect: (i: number) => void }

export default function Top20({ stats, ranking, selected, onSelect }: Props) {
  const inters = dataset.intersections!;
  const top = ranking.order.slice(0, 20);
  const max = top.length ? stats.blesses[top[0]] : 0;

  return (
    <section aria-labelledby="t-top" className="space-y-4">
      <div className="space-y-1">
        <h2 id="t-top" className="text-lg font-semibold tracking-tight text-ink">Top 20 des intersections</h2>
        <p className="text-xs text-ink-muted">
          Classées par nombre de collisions avec blessés, selon vos filtres. Un nombre élevé ne veut pas dire que l’intersection est
          plus dangereuse : il peut venir d’une circulation plus forte.
        </p>
        <p className="text-xs text-ink-muted">Cliquez sur une ligne pour ouvrir sa fiche. La pastille donne la gravité la plus élevée :</p>
        <SeverityLegend />
      </div>

      {top.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucune collision avec blessés ne correspond à ces filtres.</p>
      ) : (
        <ol className="space-y-1.5">
          {top.map(i => {
            const sev = stats.mortelles[i] > 0 ? COLORS.mortel : stats.graves[i] > 0 ? COLORS.grave : COLORS.leger;
            return (
              <li key={i}>
                <button type="button" onClick={() => onSelect(i)} aria-current={selected === i}
                  className={`grid w-full grid-cols-[2rem_1fr_auto] items-center gap-x-2 rounded-lg border p-2 text-left transition-colors hover:bg-canvas ${selected === i ? 'border-brand bg-brand-soft/40' : 'border-line'}`}>
                  <span className="text-center text-sm font-semibold tabular-nums text-ink-muted">{ranking.rank[i]}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ background: sev }} aria-hidden />
                      <span className="truncate">{inters.nom[i]}</span>
                    </span>
                    {!hasName(inters, i) && <span className="block text-[11px] text-ink-muted">{interCoords(inters, i)}</span>}
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-canvas" aria-hidden>
                      <span className="block h-full rounded-full bg-brand" style={{ width: `${max ? (stats.blesses[i] / max) * 100 : 0}%` }} />
                    </span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-ink">{fmtInt(stats.blesses[i])}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}