import { useMemo } from 'react';
import { computeMethodStats, type MethodStats } from '../utils/methodStats';
import { dataset } from '../utils/datasetStore';

export function useMethodStats(): MethodStats {
  return useMemo(() => computeMethodStats(dataset.collisions!, dataset.intersections!.n), []);
}