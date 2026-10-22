interface Props { values: number[]; color: string; className?: string }

export default function Sparkline({ values, color, className }: Props) {
  if (values.length < 2) return null;
  const w = 100, h = 28, pad = 3;
  const min = Math.min(...values), max = Math.max(...values);
  const y = (v: number) => (max === min ? h / 2 : h - pad - ((v - min) / (max - min)) * (h - 2 * pad));
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * w).toFixed(2)} ${y(v).toFixed(2)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}