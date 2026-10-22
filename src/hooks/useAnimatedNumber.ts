import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useAnimatedNumber(target: number, duration = 600): number {
  const [value, setValue] = useState(0);
  const shown = useRef(0); // valeur actuellement affichée (reprise si on filtre en cours d'animation)

  useEffect(() => {
    if (shown.current === target) return;
    const from = shown.current;
    const d = prefersReducedMotion() ? 0 : duration;
    const t0 = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const t = d === 0 ? 1 : Math.min(1, Math.max(0, (now - t0) / d));
      const v = from + (target - from) * (1 - Math.pow(1 - t, 3));
      shown.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}