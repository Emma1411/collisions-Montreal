import { ArrowRight } from 'lucide-react';
import { useMeta } from '../../hooks/useMeta';
import { dataset } from '../../utils/datasetStore';
import { fmtPct } from '../../utils/format';
import { interCoords, hasName } from '../../utils/intersections';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function SimilarIntersections({ idx, onSelect }: { idx: number; onSelect: (i: number) => void }) {
  const meta = useMeta();
  const inters = dataset.intersections!;
  const list = (dataset.similaires?.[String(idx)] ?? []).filter(s => s.s >= 0.6).slice(0, 5);

  return (
    <section aria-labelledby="t-sim" className="mt-8 space-y-3 border-t border-line pt-6">
      <div>
        <h3 id="t-sim" className="text-sm font-semibold text-ink">Intersections qui lui ressemblent</h3>
        <p className="text-xs text-ink-muted">
          Leur profil de collisions est proche (comparé sur {meta.traits.length} caractéristiques : usagers, heures, saison…).
          Elles ne sont pas forcément voisines.
        </p>
      </div>
      {list.length === 0 ? (
        <p className="text-xs text-ink-muted">Aucune intersection au profil comparable n’a été calculée pour celle-ci.</p>
      ) : (
        <ul className="space-y-2">
          {list.map(s => (
            <li key={s.i}>
              <button type="button" onClick={() => onSelect(s.i)}
                className="w-full rounded-lg border border-line p-3 text-left transition-colors hover:border-brand/40 hover:bg-canvas">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {inters.nom[s.i]}
                    {!hasName(inters, s.i) && <span className="block text-xs font-normal text-ink-muted">{interCoords(inters, s.i)}</span>}
                  </span>
                  <span className="shrink-0 rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-brand">
                    {fmtPct(s.s)} de ressemblance
                  </span>
                </span>
                {s.t.length > 0 && (
                  <span className="mt-2 flex flex-wrap gap-1">
                    {s.t.slice(0, 4).map(t => <span key={t} className="rounded bg-canvas px-1.5 py-0.5 text-[11px] text-ink-muted">{cap(t)}</span>)}
                    {s.t.length > 4 && <span className="px-1 text-[11px] text-ink-faint">+{s.t.length - 4}</span>}
                  </span>
                )}
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand">Voir sur la carte <ArrowRight className="size-3.5" aria-hidden /></span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}