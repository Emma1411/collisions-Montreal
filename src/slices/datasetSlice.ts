import { createSlice } from '@reduxjs/toolkit';
import type { Meta } from '../interfaces/meta';
import { loadDataset } from '../thunks/loadDataset';

interface DatasetState { status: 'idle' | 'loading' | 'ready' | 'error'; error: string | null; meta: Meta | null }
const initialState: DatasetState = { status: 'idle', error: null, meta: null };

const datasetSlice = createSlice({
  name: 'dataset',
  initialState,
  reducers: {},
  extraReducers: b => {
    b.addCase(loadDataset.pending, s => { s.status = 'loading'; s.error = null; })
      .addCase(loadDataset.fulfilled, (s, a) => { s.status = 'ready'; s.meta = a.payload; })
      .addCase(loadDataset.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message ?? 'Erreur de chargement'; });
  },
});
export default datasetSlice.reducer;