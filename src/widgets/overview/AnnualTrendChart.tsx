import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Segmented from '../../components/ui/Segmented';
import { useTrendAggregate } from '../../hooks/useAggregate';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useMeta } from '../../hooks/useMeta';
import { COLORS } from '../../utils/colors';
import { fmtInt, fmtPct, fmtVar } from '../../utils/format';
import { periodeRange } from '../../utils/periode';
import { NIVEAUX, serieAnnuelle, variation, type Niveau, type PointAnnuel } from '../../utils/series';

const at = (s: PointAnnuel[], y: number) => s.find(p => p.annee === y)?.valeur;
const change = (s: PointAnnuel[], y0: number, y1: number) => {
  const a = at(s, y0), b = at(s, y1);
  return a === undefined || b === undefined ? null : variation(a, b);
};

export default function AnnualTrendChart() {
  const meta = useMeta();
  const agg = useTrendAggregate();
  const periode = useAppSelector(s => s.filters.periode);
  const [niveau, setNiveau] = useState<Niveau>('blesses');
  const a0 = meta.annees[0];

  const view = useMemo(() => {
    if (!agg) return null;
    const range = periodeRange(periode, a0);
    return { data: serieAnnuelle(agg, a0, range, niveau), blesses: serieAnnuelle(agg, a0, range, 'blesses') };
  }, [agg, periode, a0, niveau]);
  if (!view || view.data.length === 0) return null;

  const { data } = view;
  const conf = NIVEAUX.find(n => n.value === niveau)!;
  const first = data[0], last = data[data.length - 1];

  const notes: string[] = [];
  const v = data.length > 1 ? variation(first.valeur, last.valeur) : null;
  if (v !== null) notes.push(`Entre ${first.annee} et ${last.annee}, ${conf.phrase} ont ${v <= 0 ? 'baissé' : 'augmenté'} de ${fmtPct(Math.abs(v))}.`);

  const c20 = change(data, 2019, 2020), c21 = change(data, 2020, 2021);
  if (c20 !== null) notes.push(`En 2020, année de pandémie : ${fmtVar(c20)} par rapport à 2019${c21 !== null ? `, puis ${fmtVar(c21)} en 2021` : ''}.`);

  const dm14 = niveau === 'dm' ? change(data, 2013, 2014) : null;
  const bl14 = niveau === 'dm' ? change(view.blesses, 2013, 2014) : null;
  const rupture = dm14 !== null && bl14 !== null && dm14 < bl14 - 0.1;
  if (rupture) {
    notes.push(`Baisse brutale en 2014 (${fmtVar(dm14!)}), absente chez les collisions avec blessés (${fmtVar(bl14!)}) : les chiffres d’avant et d’après 2014 ne sont pas comparables.`);
  }

  const y2020 = at(data, 2020);

  return (
    <section className="card p-5" aria-labelledby="titre-tendance">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-md">
          <p className="kicker">Année par année · {first.annee}–{last.annee}</p>
          <h2 id="titre-tendance" className="mt-1 text-lg font-semibold tracking-tight text-ink">Combien de collisions par année ?</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Suit vos filtres Période, Usagers et Lieu. La gravité se choisit ici, avec les boutons colorés.
          </p>
        </div>
        <Segmented ariaLabel="Gravité à afficher" label="Gravité à afficher" value={niveau}  onChange={(v) => setNiveau(v as Niveau)}
          options={NIVEAUX.map(n => ({ value: n.value, label: n.label, color: n.color }))} />
      </div>

      <div className="mt-4" role="img"
        aria-label={`${conf.label} : ${fmtInt(first.valeur)} collisions en ${first.annee}, ${fmtInt(last.valeur)} en ${last.annee}`}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={conf.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={conf.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={COLORS.line} />
            <XAxis dataKey="annee" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: COLORS.muted }} />
            <YAxis domain={[0, 'auto']} tickLine={false} axisLine={false} width={52}
              tick={{ fontSize: 12, fill: COLORS.muted }} tickFormatter={(x: number) => fmtInt(x)} />
            <Tooltip formatter={val => [`${fmtInt(Number(val))} collisions`, conf.label]} labelFormatter={l => `Année ${l}`} />
            <Area type="monotone" dataKey="valeur" stroke={conf.color} strokeWidth={2} fill="url(#trend-fill)"
              dot={{ r: 3, fill: conf.color }} activeDot={{ r: 5 }} animationDuration={600} />
            {rupture && (
              <ReferenceLine x={2014} stroke="#94a3b8" strokeDasharray="4 4"
                label={{ value: '2014 : baisse brutale', position: 'insideTopRight', fontSize: 11, fill: COLORS.muted }} />
            )}
            {y2020 !== undefined && (
              <ReferenceDot x={2020} y={y2020} r={5} fill={COLORS.mortel} stroke="#fff" strokeWidth={2}
                label={{ value: '2020 · pandémie', position: 'bottom', fontSize: 11, fill: COLORS.muted }} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {notes.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-lg bg-canvas px-3 py-2 text-xs text-ink-muted">
          {notes.map(n => <li key={n}>{n}</li>)}
        </ul>
      )}
    </section>
  );
}