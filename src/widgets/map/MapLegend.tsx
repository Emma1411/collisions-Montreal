import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MapMode } from '../../interfaces/map';
import { COLORS } from '../../utils/colors';

interface Props { mode: MapMode; min: number; max: number }

export default function MapLegend({ mode, min, max }: Props) {
  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 640px)').matches);
  return (
    <div className="absolute bottom-3 left-3 z-10 w-64 max-w-[calc(100%-1.5rem)] rounded-xl border border-line bg-white/95 p-3 text-xs shadow-card backdrop-blur">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-semibold text-ink">
        Légende
        <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && (mode === 'points' ? (
        <div className="mt-2 space-y-2">
          <p className="text-ink-muted">Chaque cercle est une intersection.</p>
          <ul className="space-y-1.5">
            {[
              [COLORS.mortel, 'Au moins une collision mortelle'],
              [COLORS.grave, 'Au moins une collision grave, aucune mortelle'],
              [COLORS.leger, 'Collisions légères seulement'],
            ].map(([color, label]) => (
              <li key={label} className="flex items-center gap-2">
                <span className="size-3 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
                <span className="text-ink">{label}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 border-t border-line pt-2 text-ink-muted">
            <span className="size-2 rounded-full bg-ink-faint" aria-hidden />
            <span className="size-5 rounded-full bg-ink-faint" aria-hidden />
            <span>Plus le cercle est grand, plus il y a de collisions avec blessés{max > 0 ? ` (de ${min} à ${max})` : ''}.</span>
          </div>
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          <p className="text-ink-muted">Les zones foncées concentrent le plus de collisions avec blessés.</p>
          <div className="h-2.5 rounded-full" aria-hidden
            style={{ background: 'linear-gradient(to right, rgba(147,197,253,0.55), rgb(59,130,246), rgb(11,92,147), rgb(8,43,77))' }} />
          <div className="flex justify-between text-ink-muted"><span>Moins</span><span>Plus</span></div>
        </div>
      ))}
    </div>
  );
}