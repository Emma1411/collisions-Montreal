import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../rootReducers';
import { aggregateByIntersection, buildRanking } from '../utils/byIntersection';
import { dataset } from '../utils/datasetStore';
import { useAppSelector } from './useAppSelector';
import { useMemo } from 'react';
import type { InterStats } from '../utils/byIntersection';

export const selectInterStats = createSelector(
  [(s: RootState) => s.filters.periode, (s: RootState) => s.filters.gravite, (s: RootState) => s.filters.usagers,
   (s: RootState) => s.filters.lieu, (s: RootState) => s.dataset.status === 'ready'],
  (periode, gravite, usagers, lieu, ready) =>
    ready && dataset.collisions && dataset.intersections
      ? aggregateByIntersection(dataset.collisions, { periode, gravite, usagers, lieu }, dataset.intersections.n)
      : null,
);

export const useInterStats = () => useAppSelector(selectInterStats);
export const useRanking = (stats: InterStats | null) => useMemo(() => (stats ? buildRanking(stats) : null), [stats]);