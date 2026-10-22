import AnimatedNumber from '../../components/ui/AnimatedNumber';
import KpiCard from '../../components/ui/KpiCard';
import { useAggregate } from '../../hooks/useAggregate';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useMeta } from '../../hooks/useMeta';
import { COLORS } from '../../utils/colors';
import { P1_FIN } from '../../utils/constants';
import { fmtDec1, fmtInt, fmtPct, fmtVar } from '../../utils/format';
import { periodeRange } from '../../utils/periode';
import { serieAnnuelle, variation, type Niveau } from '../../utils/series';

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

export default function KpiRow() {
  const meta = useMeta();
  const agg = useAggregate();
  const periode = useAppSelector(s => s.filters.periode);
  if (!agg) return null;

  const [a0, a1] = meta.annees;
  const range = periodeRange(periode, a0);
  const nbAnnees = range[1] - range[0] + 1;
  const serieLabel = `${a0 + range[0]}–${a0 + range[1]}`;
  const serie = (n: Niveau) => serieAnnuelle(agg, a0, range, n).map(p => p.valeur);
  const overall = meta.totaux.retenues;

  const graves = serie('grave');
  const vGraves = periode === 'all' && graves.length === 10 ? variation(sum(graves.slice(0, 5)), sum(graves.slice(5))) : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Collisions affichées" hint="Toutes celles qui correspondent à vos filtres"
        value={agg.total} unit="collisions" serie={serie('toutes')} serieLabel={serieLabel} color={COLORS.total}
        note={<><AnimatedNumber value={overall ? agg.total / overall : 0} format={fmtPct} /> des {fmtInt(overall)} collisions de la base</>}
      />
      <KpiCard
        label="Avec blessés" hint="Au moins une personne blessée ou décédée"
        value={agg.avecBlesses} unit="collisions" tone="brand"
        badge={agg.total ? <AnimatedNumber value={agg.avecBlesses / agg.total} format={fmtPct} /> : undefined}
        badgeTitle="Part des collisions affichées"
        serie={serie('blesses')} serieLabel={serieLabel} color={COLORS.blesses}
        note="Part des collisions affichées"
      />
      <KpiCard
        label="Graves" hint="Blessure grave, sans décès"
        value={agg.graves} unit="collisions"
        badge={vGraves === null ? undefined : <AnimatedNumber value={vGraves} format={fmtVar} />}
        badgeTitle={`${P1_FIN + 1}-${a1} comparé à ${a0}-${P1_FIN}`}
        serie={graves} serieLabel={serieLabel} color={COLORS.grave}
        note={vGraves === null ? 'Nombre de collisions graves' : `${P1_FIN + 1}–${a1} comparé à ${a0}–${P1_FIN}`}
      />
      <KpiCard
        label="Mortelles" hint="Au moins une personne décédée"
        value={agg.mortelles} unit="collisions" tone="mortel"
        serie={serie('mortel')} serieLabel={serieLabel} color={COLORS.mortel}
        note={<>En moyenne <AnimatedNumber value={agg.mortelles / nbAnnees} format={fmtDec1} /> par an</>}
      />
    </div>
  );
}