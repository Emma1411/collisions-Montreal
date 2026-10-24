import { useMemo, useState } from 'react';
import { Bike, Car, Check, Gauge, Link2, PersonStanding, X } from 'lucide-react';
import ProgressRow from '../../components/ui/ProgressRow';
import { useAggregate } from '../../hooks/useAggregate';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useMeta } from '../../hooks/useMeta';
import { detailFor, type InterStats, type Ranking } from '../../utils/byIntersection';
import { P1_FIN } from '../../utils/constants';
import { dataset } from '../../utils/datasetStore';
import { fmtInt, fmtPct } from '../../utils/format';
import { ECLAIRAGE_SOMBRE, SURFACE_NON_SECHE } from '../../utils/groups';
import { hasName, interCoords, statutFromRanks } from '../../utils/intersections';
import { variation } from '../../utils/series';

interface Props { idx: number; stats: InterStats; ranking: Ranking; onClose: () => void }

const share = (counts: ArrayLike<number>, codes: number[], total: number) =>
  total ? codes.reduce((s, c) => s + (counts[c] ?? 0), 0) / total : 0;

export default function IntersectionSheet({ idx, stats, ranking, onClose }: Props) {
  const meta = useMeta();
  const f = useAppSelector(s => s.filters);
  const agg = useAggregate();
  const inters = dataset.intersections!;
  const detail = useMemo(() => detailFor(dataset.collisions!, f, idx), [idx, f]);
  const [copied, setCopied] = useState(false);

  const [a0, a1] = meta.annees;
  const lbl1 = `${a0}–${P1_FIN}`, lbl2 = `${P1_FIN + 1}–${a1}`;
  const statut = statutFromRanks(inters.rang_p1[idx], inters.rang_p2[idx]);
  const STATUT = {
    persistant: ['Point chaud persistant', `Dans le top 100 en ${lbl1} et en ${lbl2}.`],
    recent: ['Nouveau point chaud', `Absent du top 100 en ${lbl1}, présent en ${lbl2}.`],
    ancien: ['Ancien point chaud', `Dans le top 100 en ${lbl1}, plus en ${lbl2}.`],
  } as const;

  const blesses = stats.blesses[idx], graves = stats.graves[idx], mortelles = stats.mortelles[idx];
  const rank = ranking.rank[idx];
  const p1 = stats.p1[idx], p2 = stats.p2[idx];
  const v = p1 > 0 ? variation(p1, p2) : null;
  const typeRue = meta.libelles.categorie[String(inters.categorie[idx])];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copiez ce lien :', window.location.href);
    }
  };

  const ville = agg && {
    nonSeche: share(agg.surface, SURFACE_NON_SECHE, agg.total),
    sombre: share(agg.eclairage, ECLAIRAGE_SOMBRE, agg.total),
  };
  const maxP = Math.max(p1, p2, 1);

  return (
    <article className="space-y-6" aria-labelledby="titre-fiche">
      <header className="space-y-2">
        {statut && (
          <p title={STATUT[statut][1]} className="inline-block rounded bg-brand-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
            {STATUT[statut][0]}
          </p>
        )}
        <h2 id="titre-fiche" className="text-2xl font-semibold tracking-tight text-ink">{inters.nom[idx]}</h2>
        <p className="text-xs text-ink-muted">
          {[typeRue, hasName(inters, idx) ? null : interCoords(inters, idx)].filter(Boolean).join(' · ') || interCoords(inters, idx)}
        </p>
        {statut && <p className="text-xs text-ink-muted">{STATUT[statut][1]}</p>}
      </header>

      <section aria-label="Chiffres de l’intersection" className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-canvas p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Avec blessés</p>
          <p className="num text-3xl text-ink">{fmtInt(blesses)}</p>
          {rank > 0 && <p className="text-[11px] text-ink-muted">N° {fmtInt(rank)} sur {fmtInt(ranking.order.length)}</p>}
        </div>
        <div className="rounded-lg bg-grave-soft p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-grave">Graves</p>
          <p className="num text-3xl text-ink">{fmtInt(graves)}</p>
          <p className="text-[11px] text-ink-muted">{blesses ? fmtPct(graves / blesses) : '0 %'} des blessés</p>
        </div>
        <div className="rounded-lg bg-mortel-soft p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-mortel">Mortelles</p>
          <p className="num text-3xl text-ink">{fmtInt(mortelles)}</p>
        </div>
      </section>

      <section aria-labelledby="t-comp" className="space-y-3 rounded-xl border border-line p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 id="t-comp" className="text-sm font-semibold text-ink">Avant / après</h3>
          <span className="text-[11px] text-ink-muted">collisions avec blessés</span>
        </div>
        {[[lbl1, p1], [lbl2, p2]].map(([label, n]) => (
          <div key={label as string} className="space-y-1">
            <div className="flex justify-between text-sm"><span className="text-ink-muted">{label}</span><span className="font-medium tabular-nums text-ink">{fmtInt(n as number)}</span></div>
            <span className="block h-2 overflow-hidden rounded-full bg-canvas" aria-hidden>
              <span className="block h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${((n as number) / maxP) * 100}%` }} />
            </span>
          </div>
        ))}
        <p className="text-xs text-ink-muted">
          {p1 + p2 < 6
            ? 'Trop peu de collisions pour comparer les deux périodes.'
            : p1 === 0
              ? `Aucune collision avec blessés en ${lbl1}, ${p2} en ${lbl2}.`
              : `${v! <= 0 ? 'Baisse' : 'Hausse'} de ${fmtPct(Math.abs(v!))} entre les deux périodes. Le filtre Période ne s’applique pas ici.`}
        </p>
      </section>

      {detail.n > 0 && (
        <section aria-labelledby="t-qui" className="space-y-3">
          <h3 id="t-qui" className="text-sm font-semibold text-ink">Qui était impliqué ? <span className="font-normal text-ink-muted">(sur {fmtInt(detail.n)} collisions)</span></h3>
          <ul className="space-y-2.5">
            <ProgressRow icon={<PersonStanding className="size-4 text-ink-faint" aria-hidden />} label="Un piéton" value={detail.pieton} total={detail.n} />
            <ProgressRow icon={<Bike className="size-4 text-ink-faint" aria-hidden />} label="Un cycliste" value={detail.velo} total={detail.n} />
            <ProgressRow icon={<Gauge className="size-4 text-ink-faint" aria-hidden />} label="Une moto ou un cyclomoteur" value={detail.moto} total={detail.n} />
            <ProgressRow icon={<Car className="size-4 text-ink-faint" aria-hidden />} label="Véhicules seulement" value={detail.vehSeul} total={detail.n} />
          </ul>
          <p className="text-[11px] text-ink-faint">Une collision peut impliquer plusieurs types d’usagers : les pourcentages ne s’additionnent pas toujours à 100 %.</p>
          {detail.n < 20 && <p className="text-[11px] text-ink-muted">Peu de collisions : prenez ces pourcentages avec précaution.</p>}
        </section>
      )}

      {detail.n > 0 && ville && (
        <section aria-labelledby="t-cond" className="grid grid-cols-2 gap-2">
          <h3 id="t-cond" className="sr-only">Conditions</h3>
          <div className="rounded-lg bg-canvas p-3">
            <p className="num text-2xl text-ink">{fmtPct(detail.nonSeche / detail.n)}</p>
            <p className="text-xs text-ink-muted">Chaussée mouillée, enneigée ou glacée</p>
            <p className="mt-1 text-[11px] text-ink-faint">Ensemble des collisions affichées : {fmtPct(ville.nonSeche)}</p>
          </div>
          <div className="rounded-lg bg-canvas p-3">
            <p className="num text-2xl text-ink">{fmtPct(detail.sombre / detail.n)}</p>
            <p className="text-xs text-ink-muted">Demi-obscurité ou nuit</p>
            <p className="mt-1 text-[11px] text-ink-faint">Ensemble des collisions affichées : {fmtPct(ville.sombre)}</p>
          </div>
        </section>
      )}

      <footer className="flex gap-2">
        <button type="button" onClick={copy} className="btn-primary flex-1 justify-center">
          {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
          {copied ? 'Lien copié' : 'Copier le lien'}
        </button>
        <button type="button" onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2.5 text-sm font-medium text-ink-muted hover:border-brand/40 hover:text-brand">
          <X className="size-4" aria-hidden /> Fermer
        </button>
      </footer>
    </article>
  );
}