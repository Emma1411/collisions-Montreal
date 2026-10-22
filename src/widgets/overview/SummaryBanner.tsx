import { TrendingDown, TrendingUp } from 'lucide-react';
import { useKpiAggregate } from '../../hooks/useAggregate';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useMeta } from '../../hooks/useMeta';
import { fmtPct } from '../../utils/format';
import { periodeRange } from '../../utils/periode';
import { serieAnnuelle, variation } from '../../utils/series';

export default function SummaryBanner() {
  const meta = useMeta();
  const agg = useKpiAggregate();
  const periode = useAppSelector(s => s.filters.periode);
  if (!agg) return null;

  const s = serieAnnuelle(agg, meta.annees[0], periodeRange(periode, meta.annees[0]), 'blesses');
  if (s.length < 2) return null;
  const first = s[0], last = s[s.length - 1];
  const v = variation(first.valeur, last.valeur);
  if (v === null) return null;
  const Icon = v <= 0 ? TrendingDown : TrendingUp;

  return (
    <div className="card flex items-center gap-4 border-brand/20 bg-brand-soft/50 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-brand">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">
          Les collisions avec blessés ont {v <= 0 ? 'baissé' : 'augmenté'} de {fmtPct(Math.abs(v))} entre {first.annee} et {last.annee}.
        </p>
        <p className="text-xs text-ink-muted">Comparaison des deux années extrêmes de la période, selon les filtres actifs.</p>
      </div>
    </div>
  );
}