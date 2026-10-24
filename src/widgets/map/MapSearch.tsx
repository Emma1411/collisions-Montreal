import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { InterStats } from '../../utils/byIntersection';
import { dataset } from '../../utils/datasetStore';
import { SANS_NOM } from '../../utils/intersections';

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export default function MapSearch({ stats, onSelect }: { stats: InterStats; onSelect: (i: number) => void }) {
  const inters = dataset.intersections!;
  const norm = useMemo(() => inters.nom.map(normalize), [inters]);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const nq = normalize(q.trim());
    if (nq.length < 2) return [];
    const out: number[] = [];
    for (let i = 0; i < norm.length; i++) if (inters.nom[i] !== SANS_NOM && norm[i].includes(nq)) out.push(i);
    return out.sort((a, b) => stats.blesses[b] - stats.blesses[a] || a - b).slice(0, 8);
  }, [q, norm, inters, stats]);

  const pick = (i: number) => { setQ(inters.nom[i]); setOpen(false); onSelect(i); };

  return (
    <div className="relative w-full sm:w-72">
      <label className="kicker mb-1 block" htmlFor="recherche-inter">Chercher une intersection</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden />
        <input
          id="recherche-inter" type="search" autoComplete="off" value={q} placeholder="ex. Papineau"
          role="combobox" aria-expanded={open && results.length > 0} aria-controls="liste-recherche" aria-autocomplete="list"
          aria-activedescendant={open && results.length ? `opt-${results[active]}` : undefined}
          onChange={e => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
            else if (e.key === 'Enter' && results[active] !== undefined) { e.preventDefault(); pick(results[active]); }
            else if (e.key === 'Escape') setOpen(false);
          }}
          className="w-full rounded-md border border-line bg-white py-1.5 pl-8 pr-8 text-sm text-ink placeholder:text-ink-faint"
        />
        {q && (
          <button type="button" aria-label="Effacer la recherche" onClick={() => { setQ(''); setOpen(false); }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink-faint hover:text-ink">
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </div>
      {open && q.trim().length >= 2 && (
        <ul id="liste-recherche" role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-md border border-line bg-white py-1 shadow-card">
          {results.length === 0 && <li className="px-3 py-2 text-xs text-ink-muted">Aucune intersection trouvée.</li>}
          {results.map((i, k) => (
            <li key={i} id={`opt-${i}`} role="option" aria-selected={k === active}
              onMouseDown={e => e.preventDefault()} onClick={() => pick(i)}
              className={`cursor-pointer px-3 py-1.5 text-sm ${k === active ? 'bg-brand-soft text-brand' : 'text-ink'}`}>
              {inters.nom[i]}
              <span className="ml-2 text-xs text-ink-muted">{stats.blesses[i]} avec blessés</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}