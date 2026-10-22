import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../rootReducers';
import { aggregate } from '../utils/aggregate';
import { dataset } from '../utils/datasetStore';
import { useAppSelector } from './useAppSelector';

const selectReady = (s: RootState) => s.dataset.status === 'ready';
const selectPeriode = (s: RootState) => s.filters.periode;
const selectGravite = (s: RootState) => s.filters.gravite;
const selectLieu = (s: RootState) => s.filters.lieu;
const selectUsagers = (s: RootState) => s.filters.usagers;

// Tous les filtres : compteur, KPI, matrice, saisonnalité, configurations, conditions
export const selectAggregate = createSelector(
  [selectPeriode, selectGravite, selectUsagers, selectLieu, selectReady],
  (periode, gravite, usagers, lieu, ready) =>
    ready && dataset.collisions ? aggregate(dataset.collisions, { periode, gravite, usagers, lieu }) : null,
);

// Tendance : a ses propres boutons de gravité → ignore le filtre Gravité
export const selectTrendAggregate = createSelector(
  [selectPeriode, selectUsagers, selectLieu, selectReady],
  (periode, usagers, lieu, ready) =>
    ready && dataset.collisions ? aggregate(dataset.collisions, { periode, gravite: 'toutes', usagers, lieu }) : null,
);

// Cartes usagers : comparent les types entre eux → ignorent Gravité et Usagers
export const selectUsersAggregate = createSelector(
  [selectPeriode, selectLieu, selectReady],
  (periode, lieu, ready) =>
    ready && dataset.collisions ? aggregate(dataset.collisions, { periode, gravite: 'toutes', usagers: [], lieu }) : null,
);

export const useAggregate = () => useAppSelector(selectAggregate);
export const useTrendAggregate = () => useAppSelector(selectTrendAggregate);
export const useUsersAggregate = () => useAppSelector(selectUsersAggregate);
export const useKpiAggregate = useAggregate;
