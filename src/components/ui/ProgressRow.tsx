import type { ReactNode } from 'react';
import { fmtInt, fmtPct } from '../../utils/format';

interface Props { icon?: ReactNode; label: string; value: number; total: number }

export default function ProgressRow({ icon, label, value, total }: Props) {
  const p = total ? value / total : 0;
  return (
    <li className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-ink">{icon}{label}</span>
        <span className="tabular-nums text-ink-muted"><span className="font-medium text-ink">{fmtInt(value)}</span> · {fmtPct(p)}</span>
      </div>
      <span className="block h-1.5 overflow-hidden rounded-full bg-canvas" aria-hidden>
        <span className="block h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${p * 100}%` }} />
      </span>
    </li>
  );
}