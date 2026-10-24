import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface Item { id: string; q: string; a: ReactNode }

export default function Accordion({ items }: { items: Item[] }) {
  return (
    <div className="divide-y divide-line rounded-xl border border-line bg-white">
      {items.map(it => (
        <details key={it.id} className="group p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {it.q}
            <ChevronDown className="size-4 shrink-0 text-ink-faint transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="mt-3 space-y-2 text-sm text-ink-muted">{it.a}</div>
        </details>
      ))}
    </div>
  );
}