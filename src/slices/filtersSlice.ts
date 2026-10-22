import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_FILTERS, type Filters, type GraviteFiltre, type Lieu, type Periode, type Usager } from '../interfaces/filters';
import { parseFilters } from '../utils/filtersUrl';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: parseFilters(new URLSearchParams(window.location.search)),
  reducers: {
    setPeriode: (s, a: PayloadAction<Periode>) => { s.periode = a.payload; },
    setGravite: (s, a: PayloadAction<GraviteFiltre>) => { s.gravite = a.payload; },
    setLieu: (s, a: PayloadAction<Lieu>) => { s.lieu = a.payload; },
    toggleUsager: (s, a: PayloadAction<Usager>) => {
      s.usagers = s.usagers.includes(a.payload) ? s.usagers.filter(u => u !== a.payload) : [...s.usagers, a.payload];
    },
    resetFilters: () => DEFAULT_FILTERS as Filters,
  },
});
export const { setPeriode, setGravite, setLieu, toggleUsager, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;