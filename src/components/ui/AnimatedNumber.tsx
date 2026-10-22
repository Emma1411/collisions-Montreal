import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { fmtInt } from '../../utils/format';

interface Props {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({ value, format = v => fmtInt(Math.round(v)), duration, className }: Props) {
  const shown = useAnimatedNumber(value, duration);
  return (
    <span className={className}>
      <span aria-hidden="true" className="tabular-nums">{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}