import { useMemo } from 'react';
import { ETL } from '../../content/siteConfig';
import { useMeta } from '../../hooks/useMeta';
import { COLORS } from '../../utils/colors';
import { P1_FIN } from '../../utils/constants';
import { dataset } from '../../utils/datasetStore';
import { fmtInt, fmtPct } from '../../utils/format';

const TOP = 50, W = 640, ROW = 11, PAD_T = 40, H = PAD_T + TOP * ROW + 14, XL = 190, XR = 450;
const yOf = (r: number) => PAD_T + (r - 1) * ROW + ROW / 2;
const cut = (s: string, n = 26) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const inTop = (r: number) => r >= 1 && r <= TOP;

interface Row { i: number; r1: number; r2: number }

export default function SlopeChart() {
  const meta = useMeta();
  const it = dataset.intersections!;
  const { both, left, right } = useMemo(() => {
    const both: Row[] = [], left: Row[] = [], right: Row[] = [];
    for (let i = 0; i < it.n; i++) {
      const row = { i, r1: it.rang_p1[i], r2: it.rang_p2[i] };
      const a = inTop(row.r1), b = inTop(row.r2);
      if (a && b) both.push(row); else if (a) left.push(row); else if (b) right.push(row);
    }
    both.sort((x, y) => x.r2 - y.r2);
    return { both, left, right };
  }, [it]);

  const [a0, a1] = meta.annees;
  const l1 = `${a0}–${P1_FIN}`, l2 = `${P1_FIN + 1}–${a1}`;
  const rk = (v: number) => (inTop(v) ? `n° ${v}` : `hors du top ${TOP}`);
  const tip = (r: Row) => `${it.nom[r.i]} : ${rk(r.r1)} en ${l1}, ${rk(r.r2)} en ${l2}`;
  const renouvellement = 1 - both.length / TOP;
  const { persistants, recents, anciens } = meta.stabilite;

  return (
    <figure className="space-y-4">
      <p className="max-w-3xl text-sm text-ink-muted">
        On croit souvent que les intersections les plus touchées sont toujours les mêmes. Les données montrent autre chose :
        sur les {TOP} premières de {l1}, <strong className="font-semibold text-ink">{both.length} seulement</strong> sont encore
        parmi les {TOP} premières en {l2}. Le classement a changé à <strong className="font-semibold text-ink">{fmtPct(renouvellement)}</strong>.
        {ETL.rang && <> Le classement est établi selon {ETL.rang}.</>}
      </p>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" className="mx-auto h-auto w-full min-w-136 max-w-3xl"
          aria-label={`Classement des ${TOP} premières intersections en ${l1} et en ${l2} : ${both.length} sont dans les deux classements.`}>
          <text x={XL} y={16} textAnchor="middle" className="fill-ink text-[13px] font-semibold">{l1}</text>
          <text x={XR} y={16} textAnchor="middle" className="fill-ink text-[13px] font-semibold">{l2}</text>
          <text x={XL} y={30} textAnchor="middle" className="fill-ink-muted text-[10px]">rang</text>
          <text x={XR} y={30} textAnchor="middle" className="fill-ink-muted text-[10px]">rang</text>

          {[10, 20, 30, 40, 50].map(r => (
            <g key={r}>
              <line x1={XL} x2={XR} y1={yOf(r)} y2={yOf(r)} stroke={COLORS.line} strokeDasharray="2 4" />
              <text x={8} y={yOf(r) + 3} className="fill-ink-faint text-[10px]">n° {r}</text>
              <text x={W - 8} y={yOf(r) + 3} textAnchor="end" className="fill-ink-faint text-[10px]">n° {r}</text>
            </g>
          ))}

          {left.map(r => (
            <g key={r.i}><title>{tip(r)}</title><circle cx={XL} cy={yOf(r.r1)} r={3} fill={COLORS.autre} /></g>
          ))}
          {right.map(r => (
            <g key={r.i}><title>{tip(r)}</title><circle cx={XR} cy={yOf(r.r2)} r={3} fill={COLORS.autre} /></g>
          ))}
          {both.map(r => (
            <g key={r.i}>
              <title>{tip(r)}</title>
              <line x1={XL} y1={yOf(r.r1)} x2={XR} y2={yOf(r.r2)} stroke={COLORS.brand} strokeWidth={1.5} opacity={0.85} />
              <circle cx={XL} cy={yOf(r.r1)} r={3.5} fill={COLORS.brand} />
              <circle cx={XR} cy={yOf(r.r2)} r={3.5} fill={COLORS.brand} />
            </g>
          ))}

          {[...both, ...left].filter(r => r.r1 <= 5).map(r => (
            <text key={`l${r.i}`} x={XL - 9} y={yOf(r.r1) + 3} textAnchor="end" className="fill-ink text-[10px]">{r.r1}. {cut(it.nom[r.i])}</text>
          ))}
          {[...both, ...right].filter(r => r.r2 <= 5).map(r => (
            <text key={`r${r.i}`} x={XR + 9} y={yOf(r.r2) + 3} className="fill-ink text-[10px]">{r.r2}. {cut(it.nom[r.i])}</text>
          ))}
        </svg>
      </div>

      <figcaption className="space-y-2 text-xs text-ink-muted">
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          <li className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: COLORS.brand }} aria-hidden />Dans le top {TOP} aux deux périodes ({both.length})</li>
          <li className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: COLORS.autre }} aria-hidden />Dans le top {TOP} d’une seule période ({left.length + right.length})</li>
        </ul>
        <p>
          Sur le top 100 de chaque période : {fmtInt(persistants)} intersections sont persistantes (dans les deux), {fmtInt(recents)} sont nouvelles
          et {fmtInt(anciens)} ont quitté le classement. Un classement fondé sur quelques collisions peut aussi bouger par simple hasard :
          les données ne permettent pas d’en expliquer la cause, ni de juger l’effet d’un aménagement.
        </p>
      </figcaption>

      <details className="rounded-xl border border-line p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Voir la liste des {both.length} intersections présentes aux deux périodes</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Rang de chaque intersection dans les deux classements</caption>
            <thead className="text-xs text-ink-muted"><tr><th scope="col" className="py-1 pr-3 font-medium">Intersection</th><th scope="col" className="px-3 py-1 text-right font-medium">{l1}</th><th scope="col" className="px-3 py-1 text-right font-medium">{l2}</th></tr></thead>
            <tbody>
              {both.map(r => (
                <tr key={r.i} className="border-t border-line">
                  <th scope="row" className="py-1.5 pr-3 font-normal text-ink">{it.nom[r.i]}</th>
                  <td className="px-3 py-1.5 text-right tabular-nums text-ink-muted">n° {r.r1}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-ink-muted">n° {r.r2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}