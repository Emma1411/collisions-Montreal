import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

export default function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="flex gap-3 rounded-xl border border-brand/20 bg-brand-soft/50 p-4">
      <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-ink">{title}</p>
        <p className="text-ink-muted">{children}</p>
      </div>
    </aside>
  );
}