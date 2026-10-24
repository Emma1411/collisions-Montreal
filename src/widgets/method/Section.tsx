import type { ReactNode } from 'react';

interface Props { id: string; n: string; title: string; tag?: string; children: ReactNode }

export default function Section({ id, n, title, tag, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="card space-y-5 p-5 sm:p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${id}-t`} className="flex items-baseline gap-3 text-xl font-semibold tracking-tight text-ink">
          <span className="font-mono text-sm text-brand">{n}</span>{title}
        </h2>
        {tag && <span className="kicker">{tag}</span>}
      </header>
      {children}
    </section>
  );
}