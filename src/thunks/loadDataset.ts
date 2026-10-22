import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Meta } from '../interfaces/meta';
import { fetchCollisions } from '../services/collisionsService';
import { fetchMeta, fetchIntersections, fetchSimilaires } from '../services/staticDataService';
import { dataset } from '../utils/datasetStore';

export const loadDataset = createAsyncThunk<Meta, void>(
  'dataset/load',
  async () => {
    const [collisions, meta, intersections, similaires] = await Promise.all([
      fetchCollisions(), fetchMeta(), fetchIntersections(), fetchSimilaires(),
    ]);
    dataset.collisions = collisions;
    dataset.intersections = intersections;
    dataset.similaires = similaires;
    return meta;
  },
  {
    condition: (_, { getState }) => {
      const s = (getState() as { dataset: { status: string } }).dataset.status;
      return s === 'idle' || s === 'error'; // bloque le double appel du StrictMode
    },
  },
);