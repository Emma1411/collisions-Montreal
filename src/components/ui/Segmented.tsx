interface Option<T extends string> { value: T; label: string; color?: string; title?: string }
interface Props<T extends string> {
  ariaLabel: string;
  label?: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
}

export default function Segmented<T extends string>({ ariaLabel, label, value, options, onChange }: Props<T>) {
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="kicker">{label}</span>}
      <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-1">
        {options.map(o => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              title={o.title}
              onClick={() => onChange(o.value)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                active ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-white text-ink-muted hover:border-brand/40 hover:text-ink'
              }`}
            >
              {o.color && <span className="size-2 rounded-full" style={{ background: o.color }} aria-hidden />}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}