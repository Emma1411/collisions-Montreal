import { CloudRain, Route, Sun, type LucideIcon } from 'lucide-react';
import AnimatedNumber from '../../components/ui/AnimatedNumber';
import Callout from '../../components/ui/Callout';
import { useAggregate } from '../../hooks/useAggregate';
import type { Aggregate } from '../../utils/aggregate';
import { fmtPct } from '../../utils/format';
import { compter, ECLAIRAGE_GROUPES, METEO_GROUPES, SURFACE_GROUPES, type Groupe } from '../../utils/groups';

const FALLBACK = '#cbd5e1';

interface Def {
    id: string;
    title: string;
    Icon: LucideIcon;
    groupes: Groupe[];
    colors: string[];
    counts: (a: Aggregate) => Uint32Array;
}

const DEFS: Def[] = [
    { id: 'surface', title: 'État de la route', Icon: Route, groupes: SURFACE_GROUPES, colors: ['#0b5c93', '#3b82f6', '#94a3b8'], counts: a => a.surface },
    { id: 'eclairage', title: 'Luminosité', Icon: Sun, groupes: ECLAIRAGE_GROUPES, colors: ['#f59e0b', '#fcd34d', '#3b82f6', '#1e293b'], counts: a => a.eclairage },
    { id: 'meteo', title: 'Météo', Icon: CloudRain, groupes: METEO_GROUPES, colors: ['#0b5c93', '#94a3b8', '#3b82f6', '#93c5fd'], counts: a => a.meteo },
];

function ConditionCard({ def, agg }: { def: Def; agg: Aggregate }) {
    const rows = compter(def.counts(agg), def.groupes, agg.total);
    const color = (i: number) => def.colors[i] ?? FALLBACK;
    const Icon = def.Icon;
    return (
        <section className="card p-5" aria-labelledby={`t-${def.id}`}>
            <h3 id={`t-${def.id}`} className="flex items-center justify-between text-sm font-semibold text-ink">
                {def.title}
                <Icon className="size-4 text-ink-faint" aria-hidden />
            </h3>
            <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-canvas" aria-hidden>
                {rows.map((r, i) => (
                    <span key={r.key} className="h-full transition-[width] duration-500"
                        style={{ width: `${agg.total ? (r.n / agg.total) * 100 : 0}%`, background: color(i) }} />
                ))}
            </div>
            <ul className="mt-3 space-y-1.5 text-xs">
                {rows.map((r, i) => (
                    <li key={r.key} className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-sm" style={{ background: color(i) }} aria-hidden />
                        <span className="text-ink-muted">{r.label}</span>
                        <AnimatedNumber value={agg.total ? r.n / agg.total : 0} format={fmtPct} className="ml-auto font-medium text-ink" />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function ConditionsBars() {
    const agg = useAggregate();
    if (!agg) return null;
    const jour = agg.total ? agg.eclairage[1] / agg.total : 0;

    return (
        <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
                {DEFS.map(d => <ConditionCard key={d.id} def={d} agg={agg} />)}
            </div>
            <Callout title="À savoir avant d’interpréter">
                Ces barres comptent les collisions qui ont eu lieu ; elles ne mesurent pas le danger. Par exemple,{' '}
                <AnimatedNumber value={jour} format={fmtPct} /> des collisions affichées arrivent en plein jour simplement parce qu’il y a
                beaucoup plus de circulation le jour. Cela ne veut pas dire que le jour est plus dangereux.
            </Callout>
        </div>
    );
}