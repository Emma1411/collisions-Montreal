import { useAggregate } from '../../hooks/useAggregate';
import { MOIS } from '../../utils/constants';
import { fmtInt } from '../../utils/format';
import { rangeColor } from '../../utils/heat';

export default function SeasonalityStrip() {
  const agg = useAggregate();
  if (!agg) return null;

  const pm = Array.from(agg.parMois);
  const max = Math.max(...pm), min = Math.min(...pm);
  const iMax = pm.indexOf(max), iMin = pm.indexOf(min);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="kicker">Saisonnalité mensuelle (12 mois)</p>
        {agg.total > 0 && (
          <span className="text-[11px] font-medium text-brand">
            Plus chargé : {MOIS[iMax]} · plus calme : {MOIS[iMin]}
          </span>
        )}
      </div>
      <div className="grid grid-cols-12 gap-0.75" role="img" aria-label="Collisions par mois, cumul de la période">
        {pm.map((v, m) => (
          <span
            key={m}
            title={`${MOIS[m]} : ${fmtInt(v)} collisions (cumul de la période)`}
            className="h-6 rounded-[3px] transition-colors duration-500"
            style={{ backgroundColor: rangeColor(v, min, max) }}
          />
        ))}
      </div>
      <div className="grid grid-cols-12 gap-0.75 text-center text-[10px] text-ink-faint" aria-hidden>
        {'JFMAMJJASOND'.split('').map((c, i) => <span key={i}>{c}</span>)}
      </div>
      <p className="text-[11px] text-ink-faint">Cumul sur la période filtrée ; échelle du mois le plus calme au plus chargé.</p>
    </div>
  );
}