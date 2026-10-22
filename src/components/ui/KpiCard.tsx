import type { ReactNode } from 'react';
import AnimatedNumber from './AnimatedNumber';
import Sparkline from './Sparkline';

interface Props {
  label: string;
  hint: string;
  value: number;
  unit: string;
  tone?: 'default' | 'brand' | 'mortel';
  badge?: ReactNode;
  badgeTitle?: string;
  serie: number[];
  serieLabel: string;
  color: string;
  note: ReactNode;
}

const VALUE_TONE = { default: 'text-ink', brand: 'text-brand', mortel: 'text-mortel' } as const;

export default function KpiCard({ label, hint, value, unit, tone = 'default', badge, badgeTitle, serie, serieLabel, color, note }: Props) {
  return (
    <article className="card flex flex-col gap-1 p-5">
      <h3 className={`text-[11px] font-medium uppercase tracking-[0.08em] ${tone === 'mortel' ? 'text-mortel' : 'text-ink-muted'}`}>{label}</h3>
      <p className="text-xs text-ink-muted">{hint}</p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <AnimatedNumber value={value} className={`num text-4xl ${VALUE_TONE[tone]}`} />
        <span className="text-xs text-ink-muted">{unit}</span>
        {badge && <span title={badgeTitle} className="rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-semibold text-brand">{badge}</span>}
      </p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-2">
        <p className="text-xs text-ink-muted">{note}</p>
        <div className="shrink-0 text-right">
          <Sparkline values={serie} color={color} className="h-7 w-24" />
          <span className="block text-[10px] text-ink-faint">{serieLabel}</span>
        </div>
      </div>
    </article>
  );
}