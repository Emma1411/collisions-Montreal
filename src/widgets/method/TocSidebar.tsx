interface Props { sections: readonly { id: string; n: string; label: string }[]; active: string }

export default function TocSidebar({ sections, active }: Props) {
  return (
    <nav aria-label="Index du document">
      <p className="kicker mb-2">Index du document</p>
      <ol className="space-y-0.5">
        {sections.map(s => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? 'location' : undefined}
              className={`flex items-baseline gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                active === s.id ? 'bg-brand-soft font-medium text-brand' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <span className="font-mono text-[11px] text-ink-faint">{s.n}</span>{s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}