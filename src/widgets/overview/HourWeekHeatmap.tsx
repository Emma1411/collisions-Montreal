
import { Fragment } from 'react';
import { useAggregate } from '../../hooks/useAggregate';
import { JOURS, JOURS_LONG } from '../../utils/constants';
import { fmtInt, fmtPct } from '../../utils/format';
import { heatColor } from '../../utils/heat';
import { parHeure, pic3h } from '../../utils/temporel';

const AXE = new Set([0, 4, 8, 12, 16, 20, 23]);

export default function HourWeekHeatmap() {
  const agg = useAggregate();
  if (!agg) return null;

  const hj = agg.heureJour;
  let max = 0;
  for (const v of hj) if (v > max) max = v;
  const ph = parHeure(hj);
  const pic = pic3h(ph);
  const connues = ph.reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          Intensité par jour de la semaine et par heure.
        </p>
        {connues > 0 && (
          <span className="rounded bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">
            Pic : {pic} h – {pic + 3} h
          </span>
        )}
      </div>

      <div className="overflow-x-auto pb-1">
        <div
          role="img"
          aria-label={
            connues > 0
              ? `Collisions par jour et par heure. Pic entre ${pic} h et ${pic + 3} h.`
              : 'Aucune donnée horaire'
          }
          className="grid min-w-136 grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-0.75"
        >
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span
              key={h}
              className="justify-self-center whitespace-nowrap text-[10px] tabular-nums text-ink-faint"
            >
              {AXE.has(h) ? `${String(h).padStart(2, '0')}h` : ''}
            </span>
          ))}
          {JOURS.map((j, d) => (
            <Fragment key={j}>
              <span className="self-center pr-2 text-right text-[11px] text-ink-muted">
                {j}
              </span>
              {Array.from({ length: 24 }, (_, h) => {
                const v = hj[d * 24 + h];
                return (
                  <span
                    key={h}
                    title={`${JOURS_LONG[d]} ${h} h : ${fmtInt(v)} collisions`}
                    className="h-5 rounded-[3px] transition-colors duration-500 sm:h-6"
                    style={{ backgroundColor: heatColor(v, max) }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-ink-faint sm:hidden">
        Faites glisser la grille pour voir toutes les heures.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted">
        <span aria-hidden className="inline-flex items-center gap-1">
          Moins
          {[0, 1, 2, 3, 4].map(i => (
            <span
              key={i}
              className="size-3 rounded-[3px]"
              style={{ backgroundColor: heatColor(i, 4) }}
            />
          ))}
          Plus
        </span>
        {agg.total > 0 && (
          <span>
            Heure non précisée pour {fmtPct(agg.heureInconnue / agg.total)} des
            collisions filtrées ({fmtInt(agg.heureInconnue)}), exclues de la
            matrice.
          </span>
        )}
      </div>
    </div>
  );
}
